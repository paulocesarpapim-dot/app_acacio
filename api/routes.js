import express from 'express';
import {
  getProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from './controllers.js';

const router = express.Router();

// Rotas de produtos
router.get('/products', getProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
