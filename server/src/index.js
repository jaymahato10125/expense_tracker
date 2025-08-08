import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import profileRoutes from './routes/profile.js';
import { notFound, errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();

// Config
const PORT = process.env.PORT || 5000;
const CORS_ORIGINS = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((s) => s.trim());
const IS_DEV = process.env.NODE_ENV !== 'production';

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (CORS_ORIGINS.includes('*') || CORS_ORIGINS.includes(origin)) return callback(null, true);
      if (IS_DEV && origin.startsWith('http://localhost:')) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Health (support both with and without '/api' prefix)
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routes (support both with and without '/api' prefix)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/transactions', '/transactions'], transactionRoutes);
app.use(['/api/profile', '/profile'], profileRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

// DB + Start
async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set');
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Startup error:', err.message);
    process.exit(1);
  }
}

start();
