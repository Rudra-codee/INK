const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const ACCESS_TOKEN_EXP = process.env.ACCESS_TOKEN_EXP || '15m';
const REFRESH_TOKEN_EXP = process.env.REFRESH_TOKEN_EXP || '30d';

const signAccessToken = ({ id, email }) =>
  jwt.sign({ sub: id, email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXP,
  });

const signRefreshToken = ({ id, email }) =>
  jwt.sign({ sub: id, email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXP,
  });

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

const hashRefreshToken = async (token) => bcrypt.hash(token, 10);

const compareRefreshToken = async (token, hash) => {
  if (!token || !hash) return false;
  return bcrypt.compare(token, hash);
};

const buildTokens = (user) => ({
  accessToken: signAccessToken(user),
  refreshToken: signRefreshToken(user),
});

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashRefreshToken,
  compareRefreshToken,
  buildTokens,
};
