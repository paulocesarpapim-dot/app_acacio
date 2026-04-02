import pool from './db.js';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const createTablesSQL = `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
`;

async function createDatabaseIfNotExists() {
  try {
    // Conectar ao banco "postgres" para criar o novo banco
    const adminPool = new pg.Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: 'postgres',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Verificar se banco existe
    const res = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME]
    );

    if (res.rows.length === 0) {
      await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Banco de dados ${process.env.DB_NAME} criado!`);
    } else {
      console.log(`✅ Banco de dados ${process.env.DB_NAME} já existe!`);
    }

    await adminPool.end();
  } catch (err) {
    console.error('❌ Erro ao criar banco:', err);
  }
}

async function initDB() {
  try {
    // Primeiro criar o banco se não existir
    await createDatabaseIfNotExists();

    // Aguardar um pouco para o banco estar pronto
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Depois criar as tabelas
    await pool.query(createTablesSQL);
    console.log('✅ Tabelas criadas com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao criar tabelas:', err);
  }
}

export default initDB;
