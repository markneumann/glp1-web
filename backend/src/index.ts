import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import medicationRoutes from './routes/medications';
import healthMetricRoutes from './routes/health-metrics';
import sideEffectRoutes from './routes/side-effects';
import exportRoutes from './routes/export';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(helmet());
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glp1', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/health-metrics', healthMetricRoutes);
app.use('/api/side-effects', sideEffectRoutes);
app.use('/api/export', exportRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});