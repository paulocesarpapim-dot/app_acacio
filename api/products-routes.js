import express from 'express';
import { readDB, saveDB } from './db-json.js';

const router = express.Router();

/**
 * Endpoint para adicionar múltiplos produtos de uma vez
 * POST /api/products/batch
 */
router.post('/batch', (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products deve ser um array' });
    }

    const db = readDB();
    const newProducts = [];

    products.forEach((product) => {
      if (!product.name || !product.category || !product.price) {
        return; // Skip invalid products
      }

      const newId = Math.max(...db.products.map(p => p.id), 0) + 1;

      const newProduct = {
        id: newId,
        name: product.name,
        description: product.description || '',
        category: product.category,
        price: parseFloat(product.price),
        image_url: product.image_url || 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(product.name),
        created_at: new Date().toISOString()
      };

      db.products.push(newProduct);
      newProducts.push(newProduct);
    });

    saveDB(db);
    res.status(201).json({
      message: `${newProducts.length} produtos adicionados com sucesso`,
      products: newProducts
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar produtos em lote' });
  }
});

/**
 * Endpoint para buscar produtos por categoria
 * GET /api/products/category/:category
 */
router.get('/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const db = readDB();
    const products = db.products.filter(p => p.category === category);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

/**
 * Endpoint para buscar todos os produtos
 * GET /api/products
 */
router.get('/', (req, res) => {
  try {
    const db = readDB();
    res.json(db.products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

/**
 * Endpoint para buscar um produto por ID
 * GET /api/products/:id
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const product = db.products.find(p => p.id === parseInt(id));
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

/**
 * Endpoint para criar um produto
 * POST /api/products
 */
router.post('/', (req, res) => {
  try {
    const { name, description, category, price, image_url } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Nome, categoria e preço são obrigatórios' });
    }

    const db = readDB();
    const newId = Math.max(...db.products.map(p => p.id), 0) + 1;

    const newProduct = {
      id: newId,
      name,
      description: description || '',
      category,
      price: parseFloat(price),
      image_url: image_url || 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(name),
      created_at: new Date().toISOString()
    };

    db.products.push(newProduct);
    saveDB(db);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

/**
 * Endpoint para atualizar um produto
 * PUT /api/products/:id
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, image_url } = req.body;

    const db = readDB();
    const productIndex = db.products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    db.products[productIndex] = {
      ...db.products[productIndex],
      name: name || db.products[productIndex].name,
      description: description !== undefined ? description : db.products[productIndex].description,
      category: category || db.products[productIndex].category,
      price: price ? parseFloat(price) : db.products[productIndex].price,
      image_url: image_url || db.products[productIndex].image_url
    };

    saveDB(db);
    res.json(db.products[productIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

/**
 * Endpoint para deletar um produto
 * DELETE /api/products/:id
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const productIndex = db.products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const deletedProduct = db.products.splice(productIndex, 1);
    saveDB(db);
    res.json({ message: 'Produto deletado com sucesso', product: deletedProduct[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

export default router;
