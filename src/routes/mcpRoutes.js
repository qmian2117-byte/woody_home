import express from 'express';
import { handleMcp } from '../controllers/mcpController.js';

const router = express.Router();

router.post('/mcp', handleMcp);

export default router;
