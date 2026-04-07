import express from 'express';
import {
  getProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from './controllers-json.js';
import imageRoutes from './image-routes.js';
import { adminLoginHandler, requireAdmin, loginRateLimit, writeRateLimit } from './admin-auth.js';

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProductById);
router.post('/products', writeRateLimit, requireAdmin, createProduct);
router.put('/products/:id', writeRateLimit, requireAdmin, updateProduct);
router.delete('/products/:id', writeRateLimit, requireAdmin, deleteProduct);

// Rotas de imagens com IA
router.use('/images', imageRoutes);

// Admin auth
router.post('/admin/login', loginRateLimit, adminLoginHandler);

export default router;
