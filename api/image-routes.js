// Rotas para gerar/obter imagens de produtos com IA
import express from 'express';
import { getProductImage, imageCache } from './image-service.js';

const router = express.Router();

/**
 * GET /api/images/generate
 * Gera imagem para um produto
 * Query params: name, category, useAI (default: false)
 */
router.get('/generate', async (req, res) => {
  try {
    const { name, category, useAI } = req.query;

    if (!name || !category) {
      return res.status(400).json({
        error: 'Missing required params: name, category'
      });
    }

    const imageUrl = await getProductImage(
      name,
      category,
      useAI === 'true'
    );

    res.json({
      success: true,
      imageUrl,
      product: { name, category }
    });
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    res.status(500).json({
      error: 'Erro ao gerar imagem',
      message: error.message
    });
  }
});

/**
 * POST /api/images/batch
 * Gera imagens para múltiplos produtos
 */
router.post('/batch', async (req, res) => {
  try {
    const { products, useAI } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        error: 'Products deve ser um array'
      });
    }

    const results = await Promise.all(
      products.map(async (product) => {
        const imageUrl = await getProductImage(
          product.name,
          product.category,
          useAI === true
        );
        return {
          ...product,
          imageUrl
        };
      })
    );

    res.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Erro ao gerar imagens em batch:', error);
    res.status(500).json({
      error: 'Erro ao gerar imagens',
      message: error.message
    });
  }
});

/**
 * GET /api/images/cache
 * Retorna status do cache de imagens
 */
router.get('/cache', (req, res) => {
  const cacheSize = Object.keys(imageCache).length;
  res.json({
    cacheSize,
    cachedProducts: Object.keys(imageCache)
  });
});

/**
 * DELETE /api/images/cache
 * Limpa o cache de imagens
 */
router.delete('/cache', (req, res) => {
  const cacheSize = Object.keys(imageCache).length;
  // Limpar cache
  Object.keys(imageCache).forEach(key => {
    delete imageCache[key];
  });
  res.json({
    success: true,
    message: `Cache limpo. ${cacheSize} itens removidos.`
  });
});

export default router;
