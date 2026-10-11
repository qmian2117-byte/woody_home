import express from 'express';
import {
  createOrder,
  trackOrder,
  updateOrderStatus,
  getAdminOrders
} from '../controllers/checkoutController.js';
import { checkoutLimiter } from '../middleware/rateLimiter.js';
import { authenticateUser, requireAdmin, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Checkout & Order Tracking
router.post('/checkout/order', checkoutLimiter, optionalAuth, createOrder);
router.get('/orders/track/:order_number', optionalAuth, trackOrder);

// Admin Order Management
router.get('/admin/orders', authenticateUser, requireAdmin, getAdminOrders);
router.patch('/admin/orders/:id/status', authenticateUser, requireAdmin, updateOrderStatus);

export default router;
