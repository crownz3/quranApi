import axios from 'axios';

const CLIENT_ID = '9d502b37-34d7-4dc5-9730-4e7ecd0438c7'
const CLIENT_SECRET = 'IdZyCNG~D2~Y-C.0FKBOlwez9h';

export async function getAccessToken() {

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios({
      method: 'post',
      url: 'https://oauth2.quran.foundation/oauth2/token',
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
