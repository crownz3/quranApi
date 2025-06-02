import { getAccessToken } from '../utils/apiClient.js';

export const getAuthToken = async (req, res) => {
  console.log('lol')
  try {
    const token = await getAccessToken();
    if (token) {
      res.status(200).json({ access_token: token });
    } else {
      res.status(500).json({ error: 'Failed to get token' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
