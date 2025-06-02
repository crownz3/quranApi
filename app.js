import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import quranRoutes from './routes/quran.js';

const app = express();

// ✅ Proper CORS setup
app.use(cors())

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', quranRoutes);

export default app;
