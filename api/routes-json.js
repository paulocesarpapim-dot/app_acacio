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

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Rotas de imagens com IA
router.use('/images', imageRoutes);

export default router;
