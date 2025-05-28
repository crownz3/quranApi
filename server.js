import express from 'express';
import axios from 'axios';
import cors from 'cors';
import qs from 'querystring';

const app = express();
app.use(cors());
app.use(express.json());

// const CLIENT_ID = 'd945e9a9-7a10-443a-942b-946d8b6654c0';
// const CLIENT_SECRET = 'LZMB~X6gRqYd-KcCybN0FNcP13';
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
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios({
      method: 'post',
      url: 'https://oauth2.quran.foundation/oauth2/token',
      // url: 'https://prelive-oauth2.quran.foundation/oauth2/token',
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

app.get('/api/wordbyword/:token/:surah/:ayah', async (req, res) => {
  try {
    const { token, surah, ayah } = req.params;
    const verseKey = `${surah}:${ayah}`;

    const response = await axios.get(
      // `https://apis-prelive.quran.foundation/content/api/v4/verses/by_key/${verseKey}?language=ta&words=true&translations=158`,
      `https://apis.quran.foundation/content/api/v4/verses/by_key/${verseKey}?words=true&translations=229&word_translation_language=ta&fields=text_uthmani&word_fields=verse_key,text_uthmani&translation_fields=resource_name,language_id&mushaf=2`,
      {
        headers: {
          'x-auth-token': token.trim(),
          'x-client-id': CLIENT_ID
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('❌ Proxy error:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to fetch word-by-word data',
      details: error?.response?.data || error.message
    });
  }
});


app.get('/api/translations/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // const response = await axios.get('https://apis-prelive.quran.foundation/content/api/v4/resources/translations?language=ta', {
    const response = await axios.get('https://apis.quran.foundation/content/api/v4/resources/translations?language=ta', {
      headers: {
        'x-auth-token': token.trim(),
        'x-client-id': CLIENT_ID
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching languages:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to fetch languages',
      details: error?.response?.data || error.message
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔰 Server running on port ${PORT}`));
