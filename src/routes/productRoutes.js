import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getCollections,
  getFaqs,
  createProduct
} from '../controllers/productController.js';


const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);
router.get('/collections', getCollections);
router.get('/faqs', getFaqs);
router.post('/admin/products', createProduct);


export default router;
