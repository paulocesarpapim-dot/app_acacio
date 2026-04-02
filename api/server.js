import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes.js';
import initDB from './init-db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 API disponível em http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});
