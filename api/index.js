import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes-json.js';
import { initDB } from './db-json.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// CORS — origens permitidas
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
  'https://emporiofilhodedeus.com.br',
  'https://www.emporiofilhodedeus.com.br',
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('Bloqueado pelo CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Inicializar banco de dados
initDB();

// Rotas da API
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API rodando! 🚀', environment: process.env.NODE_ENV });
});

// Servir arquivos estáticos do frontend (build) - apenas para local
if (process.env.NODE_ENV !== 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  // Fallback para SPA
  app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Erro ao servir index.html:', err);
        res.status(404).json({ error: 'Página não encontrada' });
      }
    });
  });
}

export default app;
