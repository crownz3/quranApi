import jwt from 'jsonwebtoken';

export function isTokenExpired(token) {
  try {
    const decoded = jwt.decode(token); // no secret needed to decode
    if (!decoded || !decoded.exp) {
      return true; // no expiry = treat as expired
    }

    const currentTime = Math.floor(Date.now() / 1000); // in seconds
    return decoded.exp < currentTime;
  } catch (err) {
    return true; // error decoding = treat as expired
  }
}
