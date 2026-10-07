import express from 'express';
import { createOrder, trackOrder, updateOrderStatus } from '../controllers/checkoutController.js';
import { checkoutLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/checkout/order', checkoutLimiter, createOrder);
router.get('/orders/track/:order_number', trackOrder);
router.patch('/admin/orders/:id/status', updateOrderStatus);

export default router;
