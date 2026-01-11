require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const docsRoutes = require('./routes/docs');
const storyRoomRoutes = require('./routes/storyRooms');
const publicStoryRoutes = require('./routes/publicStory');
const requireAuth = require('./middleware/auth');
const { connectDB, prisma, disconnectDB } = require('./config/db');
const { initTurnTimer } = require('./cron/turnTimer');

const app = express();
initTurnTimer();

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:8082,http://10.7.0.219:8082,http://localhost:5173,http://localhost:8080')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.get('/api/ping', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/story-rooms', storyRoomRoutes);
app.use('/api/public', publicStoryRoutes);

const mapUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  googleId: user.googleId,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

app.get('/api/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user: mapUserResponse(user) });
  } catch (error) {
    console.error('Fetch me error:', error);
    return res.status(500).json({ error: 'Unable to load profile.' });
  }
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

    const gracefulShutdown = () => {
      console.log('Shutting down gracefully...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });
