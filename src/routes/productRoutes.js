import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getCollections,
  getFaqs,
  createProduct,
  updateProduct,
  deleteProduct,
  updateVariantInventory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/productController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Catalog Endpoints
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);
router.get('/collections', getCollections);
router.get('/faqs', getFaqs);

// Protected Admin Product Management
router.post('/admin/products', authenticateUser, requireAdmin, createProduct);
router.put('/admin/products/:id', authenticateUser, requireAdmin, updateProduct);
router.patch('/admin/products/:id', authenticateUser, requireAdmin, updateProduct);
router.delete('/admin/products/:id', authenticateUser, requireAdmin, deleteProduct);

// Protected Admin Variant & Inventory Management
router.patch('/admin/variants/:id/inventory', authenticateUser, requireAdmin, updateVariantInventory);

// Protected Admin Category / Collection Management
router.post('/admin/categories', authenticateUser, requireAdmin, createCategory);
router.put('/admin/categories/:id', authenticateUser, requireAdmin, updateCategory);
router.delete('/admin/categories/:id', authenticateUser, requireAdmin, deleteCategory);

export default router;
