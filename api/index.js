import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes-json.js';
import { initDB } from './db-json.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar banco de dados
initDB();

// Rotas
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API rodando! 🚀' });
});

export default app;
