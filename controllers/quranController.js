import axios from 'axios';

import { fetchWithRetry } from '../utils/requestWithToken.js';
const CLIENT_ID = '9d502b37-34d7-4dc5-9730-4e7ecd0438c7'

export const getWordByWordResources = async (req, res) => {
  const token = req.headers['x-auth-token'];
  const clientId = req.headers['x-client-id']; // optional if you use CLIENT_ID constant

  const language = req.query.language || 'en'; // default to English
  const url = `https://apis.quran.foundation/content/api/qdc/resources/word_by_word_translations?language=${language}`;

  if (!token) {
    return res.status(400).json({ error: 'Missing x-auth-token in headers' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'x-auth-token': token.trim(),
        'x-client-id': clientId || CLIENT_ID
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('❌ Failed to fetch word-by-word resources:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to fetch resources',
      details: error?.response?.data || error.message
    });
  }
};

export const getWordByWord = async (req, res) => {
  const token = req.headers['x-auth-token'];
  const { surah, ayah, langId, langCode } = req.params;

  if (!token || !surah || !ayah || !langId || !langCode) {
    return res.status(400).json({ error: 'Missing required token or parameters' });
  }

  const verseKey = `${surah}:${ayah}`;

  // const buildUrl = () => {
  //   return langId !== '554'
  //     ? `https://apis.quran.foundation/content/api/qdc/verses/by_key/${verseKey}?words=true&translations=${langId}&word_translation_language=${langCode}&fields=text_uthmani&word_fields=verse_key,text_uthmani&translation_fields=resource_name,language_id&mushaf=2`
  //     : `https://apis.quran.foundation/content/api/qdc/verses/by_key/${verseKey}?words=true&translations=${langId}&word_translation_language=ta&fields=text_uthmani&word_fields=verse_key,text_uthmani&translation_fields=resource_name,language_id&mushaf=2`;
  // };

  const buildUrl = () => {
    return `https://apis.quran.foundation/content/api/qdc/verses/by_key/${verseKey}?words=true&translations=${langId}&word_translation_language=${langCode}&fields=text_uthmani&word_fields=verse_key,text_uthmani&translation_fields=resource_name,language_id&mushaf=2`;
  };

  try {
    const response = await fetchWithRetry((activeToken) => {
      return axios.get(buildUrl(), {
        headers: {
          'x-auth-token': activeToken.trim(),
          'x-client-id': CLIENT_ID
        }
      });
    }, token);

    res.json(response.data);
  } catch (error) {
    console.error('❌ Word-by-word error:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to fetch word-by-word data',
      details: error?.response?.data || error.message
    });
  }
};

export const getAyahTranslation = async (req, res) => {
  const token = req.headers['x-auth-token'];
  const { surah, ayah, lang } = req.params;

  if (!token || !surah || !ayah || !lang) {
    return res.status(400).json({ error: 'Missing required token or parameters' });
  }

  const verseKey = `${surah}:${ayah}`;

  const url = `https://apis.quran.foundation/content/api/qdc/verses/by_key/${verseKey}?words=true&translations=${lang}&word_translation_language=${lang}&fields=text_uthmani&word_fields=verse_key,text_uthmani&translation_fields=resource_name,language_id`;

  try {
    const response = await fetchWithRetry((activeToken) => {
      return axios.get(url, {
        headers: {
          'x-auth-token': activeToken.trim(),
          'x-client-id': CLIENT_ID
        }
      });
    }, token);

    res.json(response.data);
  } catch (error) {
    console.error('❌ Ayah translation error:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to fetch ayah translation',
      details: error?.response?.data || error.message
    });
  }
};

export const getTranslations = async (req, res) => {
  const token = req.headers['x-auth-token'];

  if (!token) {
    return res.status(400).json({ error: 'Missing token in headers' });
  }

  try {
    const response = await axios.get('https://apis.quran.foundation/content/api/v4/resources/translations?language=ta', {
      headers: {
        'x-auth-token': token,
        'x-client-id': CLIENT_ID
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('❌ Failed to fetch translations:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to fetch translations',
      details: error?.response?.data || error.message
    });
  }
};
