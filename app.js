import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import authRoutes from './routes/auth.js';
import quranRoutes from './routes/quran.js';

const app = express();

// ✅ Proper CORS setup
app.use(cors())

// app.use(express.json());
// app.use('/api', authRoutes);
// app.use('/api', quranRoutes);

app.get('/audio', async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith('https://podcasts.qurancentral.com/')) {
    return res.status(400).send('Invalid or missing URL');
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(502).send('Failed to fetch audio');
    }

    res.set('Content-Type', 'audio/mpeg');
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


export default app;
