// Serviço para gerenciar imagens de produtos com IA

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Gera uma imagem para um produto usando IA
 */
export async function generateProductImage(productName, category, useAI = false) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/images/generate?name=${encodeURIComponent(productName)}&category=${encodeURIComponent(category)}&useAI=${useAI}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao gerar imagem: ${response.statusText}`);
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Erro ao gerar imagem do produto:', error);
    // Retornar imagem padrão em caso de erro
    return `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop`;
  }
}

/**
 * Gera imagens para múltiplos produtos em batch
 */
export async function generateProductImagesBatch(products, useAI = false) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/images/batch`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: products.map(p => ({
            name: p.name,
            category: p.category,
            id: p.id
          })),
          useAI
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao gerar imagens: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erro ao gerar imagens em batch:', error);
    // Retornar produtos com imagem padrão em caso de erro
    return products.map(p => ({
      ...p,
      imageUrl: `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop`
    }));
  }
}

/**
 * Obtém informações do cache de imagens
 */
export async function getImageCacheInfo() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/images/cache`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao obter cache: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter cache de imagens:', error);
    return { cacheSize: 0, cachedProducts: [] };
  }
}

/**
 * Limpa o cache de imagens
 */
export async function clearImageCache() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/images/cache`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao limpar cache: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao limpar cache de imagens:', error);
    return { success: false, error: error.message };
  }
}
