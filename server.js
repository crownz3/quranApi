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

app.get('/api/myAuth', async (req, res) => {
  try {
    const token = await getAccessToken(); // ✅ Await the async function
    if (token) {
      res.status(200).json({ access_token: token });
    } else {
      res.status(500).json({ error: 'Failed to get token' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

async function getAccessToken() {
  const clientId = 'd945e9a9-7a10-443a-942b-946d8b6654c0';
  const clientSecret = 'LZMB~X6gRqYd-KcCybN0FNcP13';

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios({
      method: 'post',
      url: 'https://prelive-oauth2.quran.foundation/oauth2/token',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'grant_type=client_credentials&scope=content'
    });

    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error getting access token:', error?.response?.data || error.message);
    return null;
  }
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
