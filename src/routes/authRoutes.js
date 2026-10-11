import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
  getUserOrders, 
  updateUserProfile,
  setupAdminMfa,
  verifyAdminMfa,
  logoutUser 
} from '../controllers/authController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/auth/register', authLimiter, registerUser);
router.post('/auth/login', authLimiter, loginUser);
router.post('/auth/mfa/verify', authLimiter, verifyAdminMfa);
router.post('/auth/mfa/setup', authenticateUser, requireAdmin, setupAdminMfa);
router.get('/auth/me', authenticateUser, getCurrentUser);
router.put('/auth/profile', authenticateUser, updateUserProfile);
router.get('/auth/orders', authenticateUser, getUserOrders);
router.post('/auth/logout', logoutUser);

export default router;
