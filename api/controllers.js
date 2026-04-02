import pool from './db.js';

// GET all products
export async function getProducts(req, res) {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}

// GET product by category
export async function getProductsByCategory(req, res) {
  const { category } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC',
      [category]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}

// GET product by ID
export async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
}

// POST create product
export async function createProduct(req, res) {
  const { name, description, category, price, image_url } = req.body;
  
  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Nome, categoria e preço são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, category, price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description || null, category, price, image_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
}

// PUT update product
export async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, description, category, price, image_url } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name = COALESCE($1, name), description = COALESCE($2, description), category = COALESCE($3, category), price = COALESCE($4, price), image_url = COALESCE($5, image_url), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, description, category, price, image_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
}

// DELETE product
export async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto deletado com sucesso', product: result.rows[0] });
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
}
