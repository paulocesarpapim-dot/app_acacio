// Serviço para gerar imagens com IA usando Hugging Face
// Suporta múltiplos provedores de IA

import axios from 'axios';

const HF_API_KEY = process.env.HF_API_KEY || 'hf_placeholder';

// Cache simples para evitar múltiplas requisições
const imageCache = {};

/**
 * Gera uma descrição otimizada para IA gerar imagem
 */
function optimizePrompt(productName, category) {
  const categoryPrompts = {
    'Rapadura': 'traditional yellow/brown northeastern Brazilian rapadura candy, rustic artisanal presentation, on wooden surface, warm lighting',
    'Doces': 'traditional Brazilian sweets, colorful, rustic presentation, natural lighting, on white background',
    'Carne de Sol': 'dried beef jerky, traditional Brazilian carne seca, on wooden board, rustic style',
    'Feijão': 'dried beans, Brazilian feijão, in bowl or scattered, natural lighting, rustic wooden background',
    'Farinha': 'flour in traditional ceramic bowl, Brazilian farinha, natural light, rustic presentation',
    'Queijos': 'Brazilian cheese, artisanal presentation, on wooden board, warm lighting',
    'Manteiga': 'traditional butter in ceramic pot, Brazilian style, rustic background',
    'Confraternizações': 'confectionery treats assorted, Brazilian sweets, colorful, festive',
    'Cereais': 'various cereals and grains, natural presentation, wooden table',
    'Requeijão': 'traditional requeijão cheese spread, ceramic jar, rustic Brazilian style',
    'Temperos': 'colorful spices and seasonings, in bowls, natural lighting, traditional presentation',
    'Outros': 'regional product, handcrafted, artisanal Brazilian product'
  };

  const basePrompt = categoryPrompts[category] || 'traditional Brazilian regional product, artisanal, rustic style';
  return `${productName}, ${basePrompt}, high quality product photography, professional shot`;
}

/**
 * Gera imagem usando Hugging Face Inference API
 */
async function generateImageHuggingFace(productName, category) {
  try {
    const prompt = optimizePrompt(productName, category);
    
    // Usar modelo de geração de imagem do Hugging Face
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`
        },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );

    return {
      success: true,
      dataUrl: `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`,
      source: 'hugging-face'
    };
  } catch (error) {
    console.error('Erro ao gerar imagem no Hugging Face:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Busca imagem de stock usando Pexels API como fallback
 */
async function getStockImageFromPexels(productName, category) {
  try {
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
    if (!PEXELS_API_KEY) {
      return null;
    }

    const searchQuery = `${productName} ${category}`;
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: { query: searchQuery, per_page: 1 },
      headers: { Authorization: PEXELS_API_KEY }
    });

    if (response.data.photos && response.data.photos.length > 0) {
      return response.data.photos[0].src.medium;
    }
  } catch (error) {
    console.error('Erro ao buscar imagem no Pexels:', error.message);
  }
  return null;
}

/**
 * Obtém imagem para um produto (IA ou Stock)
 */
async function getProductImage(productName, category, preferAI = false) {
  const cacheKey = `${productName}-${category}`;

  // Retornar do cache se existir
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey];
  }

  let imageUrl = null;

  // Tentar gerar com IA
  if (preferAI && HF_API_KEY !== 'hf_placeholder') {
    const aiResult = await generateImageHuggingFace(productName, category);
    if (aiResult.success) {
      imageUrl = aiResult.dataUrl;
    }
  }

  // Fallback para Pexels
  if (!imageUrl) {
    imageUrl = await getStockImageFromPexels(productName, category);
  }

  // Fallback padrão (placeholder)
  if (!imageUrl) {
    imageUrl = `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop`;
  }

  // Cachear resultado
  imageCache[cacheKey] = imageUrl;
  
  return imageUrl;
}

export {
  generateImageHuggingFace,
  getStockImageFromPexels,
  getProductImage,
  imageCache
};
