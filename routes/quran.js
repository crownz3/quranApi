import express from 'express';
import {
  getWordByWord,
  getAyahTranslation,
  getTranslations
} from '../controllers/quranController.js';
import { getWordByWordResources } from '../controllers/quranController.js';

const router = express.Router();

router.get('/', (req,res)=>{
    res.send('please close and do your work well...congrat1s')
});

router.get('/wordbyword/:surah/:ayah/:langId/:langCode', getWordByWord);
router.get('/wordbyword-resources', getWordByWordResources);
router.get('/ayahTranslation/:surah/:ayah/:lang', getAyahTranslation);
router.get('/translations', getTranslations); 

export default router;
