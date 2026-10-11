import express from 'express';
import {
  applyCoupon,
  removeCoupon,
  getAdminCoupons,
  createAdminCoupon,
  deleteAdminCoupon
} from '../controllers/couponController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Cart Coupon Operations
router.post('/cart/apply-coupon', applyCoupon);
router.delete('/cart/remove-coupon', removeCoupon);

// Admin Coupon Management
router.get('/admin/coupons', authenticateUser, requireAdmin, getAdminCoupons);
router.post('/admin/coupons', authenticateUser, requireAdmin, createAdminCoupon);
router.delete('/admin/coupons/:id', authenticateUser, requireAdmin, deleteAdminCoupon);

export default router;
