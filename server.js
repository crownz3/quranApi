import express from 'express';
import axios from 'axios';
import cors from 'cors';
import qs from 'querystring';

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = '9d502b37-34d7-4dc5-9730-4e7ecd0438c7';
const CLIENT_SECRET = 'IdZyCNG~D2~Y-C.0FKBOlwez9h';

let tokenCache = null;

async function getAccessToken() {
  if (tokenCache?.expires > Date.now()) return tokenCache.token;

  const res = await axios.post(
    'https://prelive-oauth2.quran.foundation/oauth2/token',
    qs.stringify({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );

  tokenCache = {
    token: res.data.access_token,
    expires: Date.now() + res.data.expires_in * 1000
  };

  return tokenCache.token;
}

app.get('/api/wordbyword/:surah/:ayah', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { surah, ayah } = req.params;
    const apiUrl = `https://apis-prelive.quran.foundation/content/api/v4/verses/by_key/${surah}:${ayah}?language=en&words=true`;

    const quranRes = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.json(quranRes.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch data');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔰 Server running on port ${PORT}`));
