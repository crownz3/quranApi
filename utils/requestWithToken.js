import { getAccessToken } from './apiClient.js';

export async function fetchWithRetry(requestFn, oldToken) {
  try {
    // First attempt with provided token
    return await requestFn(oldToken);
  } catch (error) {
    const status = error?.response?.status;
    const errorType = error?.response?.data?.type || error?.response?.data?.error;

    if (errorType === 'invalid_token' || status === 401) {
      console.warn('🔁 Token expired, refreshing...');
      const newToken = await getAccessToken();
      if (!newToken) throw new Error('❌ Failed to refresh token');

      // Retry with new token
      return await requestFn(newToken);
    }

    // Any other error, rethrow
    throw error;
  }
}