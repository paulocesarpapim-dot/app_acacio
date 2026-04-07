import { readDB, saveDB } from './db-json.js';

export function getProducts(req, res) {
  try {
    const db = readDB();
    res.json(db.products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}

export function getProductsByCategory(req, res) {
  try {
    const { category } = req.params;
    const db = readDB();
    const products = db.products.filter(p => p.category === category);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}

export function getProductById(req, res) {
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
}

export function createProduct(req, res) {
  try {
    const { name, description, category, price, unit, in_stock, image_url } = req.body;

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
      unit: unit || 'kg',
      in_stock: in_stock !== undefined ? Boolean(in_stock) : true,
      image_url: image_url || '',
      created_at: new Date().toISOString()
    };

    db.products.push(newProduct);
    saveDB(db);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
}

export function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, category, price, unit, in_stock, image_url } = req.body;

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
      unit: unit !== undefined ? unit : db.products[productIndex].unit,
      in_stock: in_stock !== undefined ? Boolean(in_stock) : db.products[productIndex].in_stock,
      image_url: image_url || db.products[productIndex].image_url
    };

    saveDB(db);
    res.json(db.products[productIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
}

export function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const db = readDB();
    const productIndex = db.products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    db.products.splice(productIndex, 1);
    saveDB(db);
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
}
