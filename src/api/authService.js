import { appParams } from '@/lib/app-params';

const API_URL = appParams.appBaseUrl || 'http://localhost:3000';

// Simulated auth (você pode integrar com um backend real)
export async function checkUserAuth() {
  try {
    // Se tiver um token, verificar no backend
    if (appParams.token) {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${appParams.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error checking auth:', error);
    return null;
  }
}

export function logout() {
  // Limpar token do localStorage
  localStorage.removeItem('base44_access_token');
  window.location.href = '/';
}
