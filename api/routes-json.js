import express from 'express';
import {
  getCustomers,
  registerCustomer,
  loginCustomer,
  updateCustomerLoyalty,
  deleteCustomer,
  createPaymentPreference,
  getOrders,
  createPixCharge,
  checkPixStatus,
  pixWebhook,
  registerPixWebhook,
  handleMPNotification,
  getSettings,
  updateSettings,
  getProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  loginAdmin,
} from './controllers-json.js';
import { adminAuth, loginRateLimit } from './middleware.js';

const router = express.Router();

// ============ PUBLIC ROUTES ============

// Products (leitura publica)
router.get('/products', getProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProductById);

// Customer auth
router.post('/customers/register', registerCustomer);
router.post('/customers/login', loginRateLimit, loginCustomer);

// Webhooks (chamados pelos provedores de pagamento)
router.post('/pix/webhook', pixWebhook);
router.post('/payments/notification', handleMPNotification);

// Checkout (público — clientes precisam criar cobranças)
router.post('/payments/preference', createPaymentPreference);
router.post('/pix/charge', createPixCharge);
router.get('/pix/status/:txid', checkPixStatus);

// Admin login
router.post('/admin/login', loginRateLimit, loginAdmin);

// ============ ADMIN ROUTES (protegidas) ============

// Products (escrita)
router.post('/products', adminAuth, createProduct);
router.put('/products/:id', adminAuth, updateProduct);
router.delete('/products/:id', adminAuth, deleteProduct);

// Customers
router.get('/customers', adminAuth, getCustomers);
router.put('/customers/:id/loyalty', adminAuth, updateCustomerLoyalty);
router.delete('/customers/:id', adminAuth, deleteCustomer);

// Orders
router.get('/orders', adminAuth, getOrders);

// Payments (admin-only)
router.post('/pix/webhook/register', adminAuth, registerPixWebhook);

// Settings
router.get('/settings', adminAuth, getSettings);
router.put('/settings', adminAuth, updateSettings);

export default router;
