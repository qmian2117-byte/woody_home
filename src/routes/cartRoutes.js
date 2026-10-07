import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/cart', getCart);
router.post('/cart/add', addToCart);
router.patch('/cart/item/:id', updateCartItem);
router.delete('/cart/item/:id', removeCartItem);
router.delete('/cart/clear', clearCart);

export default router;
