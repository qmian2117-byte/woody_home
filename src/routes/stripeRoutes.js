import express from 'express';
import { createStripeSession, verifyStripeSession, handleStripeWebhook } from '../controllers/stripeController.js';
import { checkoutLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/checkout/stripe-session', checkoutLimiter, createStripeSession);
router.get('/checkout/stripe-verify/:session_id', verifyStripeSession);
router.post('/webhook/stripe', handleStripeWebhook);

export default router;
