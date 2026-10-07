import express from 'express';
import { searchSuggest } from '../controllers/searchController.js';

const router = express.Router();

router.get('/search/suggest', searchSuggest);

export default router;
