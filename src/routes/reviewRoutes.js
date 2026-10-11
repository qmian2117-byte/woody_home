import express from 'express';
import {
  getProductReviews,
  createProductReview,
  getAdminReviews,
  toggleApproveReview,
  deleteAdminReview
} from '../controllers/reviewController.js';
import { authenticateUser, requireAdmin, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Customer Reviews
router.get('/products/:slug/reviews', getProductReviews);
router.post('/products/:slug/reviews', optionalAuth, createProductReview);

// Admin Review Moderation
router.get('/admin/reviews', authenticateUser, requireAdmin, getAdminReviews);
router.patch('/admin/reviews/:id/approve', authenticateUser, requireAdmin, toggleApproveReview);
router.delete('/admin/reviews/:id', authenticateUser, requireAdmin, deleteAdminReview);

export default router;
