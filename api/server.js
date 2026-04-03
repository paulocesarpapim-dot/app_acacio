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
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar banco de dados
initDB();

// Rotas da API
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API rodando! 🚀' });
});

// Servir arquivos estáticos do frontend (build)
const publicPath = path.join(__dirname, '../dist');
app.use(express.static(publicPath));

// Fallback para SPA - redireciona para index.html para rotas não encontradas
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html')).catch(err => {
    console.error('Erro ao servir index.html:', err);
    res.status(404).json({ error: 'Página não encontrada' });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 API disponível em http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend em http://localhost:${PORT}`);
});
