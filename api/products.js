import { readDB, saveDB } from './db-json.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method } = req;
    const { category, id } = req.query;

    if (method === 'GET') {
      const db = readDB();

      if (id) {
        const product = db.products.find(p => p.id === parseInt(id));
        return res.status(product ? 200 : 404).json(product || { error: 'Produto não encontrado' });
      }

      if (category) {
        const products = db.products.filter(p => p.category === category);
        return res.status(200).json(products);
      }

      return res.status(200).json(db.products);
    }

    if (method === 'POST') {
      const { name, description, category: cat, price, image_url } = req.body;

      if (!name || !cat || !price) {
        return res.status(400).json({ error: 'Nome, categoria e preço são obrigatórios' });
      }

      const db = readDB();
      const newId = Math.max(...db.products.map(p => p.id), 0) + 1;

      const newProduct = {
        id: newId,
        name,
        description: description || '',
        category: cat,
        price: parseFloat(price),
        image_url: image_url || 'https://via.placeholder.com/400x400?text=' + name,
        created_at: new Date().toISOString()
      };

      db.products.push(newProduct);
      saveDB(db);
      return res.status(201).json(newProduct);
    }

    if (method === 'PUT') {
      const { name, description, category: cat, price, image_url } = req.body;
      const db = readDB();
      const productIndex = db.products.findIndex(p => p.id === parseInt(id));

      if (productIndex === -1) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      db.products[productIndex] = {
        ...db.products[productIndex],
        name: name || db.products[productIndex].name,
        description: description !== undefined ? description : db.products[productIndex].description,
        category: cat || db.products[productIndex].category,
        price: price ? parseFloat(price) : db.products[productIndex].price,
        image_url: image_url || db.products[productIndex].image_url
      };

      saveDB(db);
      return res.status(200).json(db.products[productIndex]);
    }

    if (method === 'DELETE') {
      const db = readDB();
      const productIndex = db.products.findIndex(p => p.id === parseInt(id));

      if (productIndex === -1) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      db.products.splice(productIndex, 1);
      saveDB(db);
      return res.status(200).json({ message: 'Produto deletado com sucesso' });
    }

    res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
