import { appParams } from '@/lib/app-params';

// Em produção no Replit, usa a raiz da aplicação
// Em desenvolvimento local, usa localhost:3000
const API_URL = (() => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Produção - usa a mesma origem
    return window.location.origin;
  }
  return appParams.appBaseUrl || 'http://localhost:3000';
})();

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProductsByCategory(category) {
  try {
    const response = await fetch(`${API_URL}/api/products/category/${category}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createProduct(product) {
  try {
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id, product) {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
