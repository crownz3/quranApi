import express from 'express';
import { isTokenExpired } from '../utils/verifyToken.js';
import { getAuthToken } from '../controllers/authController.js';

const router = express.Router();

router.get('/', (req,res)=>{
    res.send('please close and do your work well...congrats')
});

router.get('/myAuth', getAuthToken);

router.get('/validateToken', (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(400).json({ valid: false, error: 'No token provided' });
  }

  const expired = isTokenExpired(token);
  return res.status(200).json({ valid: !expired });
});

export default router;
