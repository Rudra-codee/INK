const express = require('express');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const { prisma } = require('../config/db');
const rateLimiter = require('../middleware/rateLimiter');
const {
  buildTokens,
  verifyRefreshToken,
  hashRefreshToken,
  compareRefreshToken,
} = require('../utils/tokens');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const isProduction = process.env.NODE_ENV === 'production';
const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

router.use(rateLimiter);

const refreshCookieConfig = {
  httpOnly: true,
  secure: isProduction ? true : false,
  sameSite: 'lax',
  domain: process.env.COOKIE_DOMAIN || undefined,
  path: '/',
};

const setRefreshCookie = (res, token) => {
  res.cookie('jid', token, { ...refreshCookieConfig, maxAge: THIRTY_DAYS_MS });
};

const clearRefreshCookie = (res) => {
  res.clearCookie('jid', { ...refreshCookieConfig, maxAge: 0 });
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  googleId: user.googleId,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const persistRefreshToken = async (userId, refreshToken) => {
  const refreshTokenHash = await hashRefreshToken(refreshToken);
  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenHash },
  });
};

const issueTokens = async (res, user) => {
  const tokens = buildTokens(user);
  await persistRefreshToken(user.id, tokens.refreshToken);
  setRefreshCookie(res, tokens.refreshToken);
  return tokens.accessToken;
};

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    const accessToken = await issueTokens(res, user);
    return res.status(201).json({ accessToken, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Unable to complete signup.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const accessToken = await issueTokens(res, user);
    return res.json({ accessToken, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Unable to complete login.' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'idToken is required.' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google Sign-In is not configured.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const name = payload.name;
    const avatar = payload.picture;

    if (!email) {
      return res.status(400).json({ error: 'Google account missing email.' });
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { googleId }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email, name, googleId, avatar },
      });
    } else if (!user.googleId || user.googleId !== googleId || !user.avatar) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          avatar: user.avatar || avatar,
          name: user.name || name,
        },
      });
    }

    const accessToken = await issueTokens(res, user);
    return res.json({ accessToken, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ error: 'Unable to complete Google sign-in.' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.jid;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token missing.' });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid refresh token.' });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ error: 'Refresh token revoked.' });
    }

    const tokenMatches = await compareRefreshToken(refreshToken, user.refreshTokenHash);
    if (!tokenMatches) {
      return res.status(401).json({ error: 'Refresh token revoked.' });
    }

    const accessToken = await issueTokens(res, user);
    return res.json({ accessToken, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Refresh error:', error);
    return res.status(500).json({ error: 'Unable to refresh session.' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies.jid;
    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        await prisma.user.updateMany({
          where: { id: payload.sub },
          data: { refreshTokenHash: null },
        });
      } catch (err) {
        // Invalid token is fine during logout
      }
    }

    clearRefreshCookie(res);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Unable to logout.' });
  }
});

module.exports = router;
