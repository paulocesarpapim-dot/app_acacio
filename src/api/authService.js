// App is publicly accessible - no authentication required
// This file is kept for potential future auth integration

export function logout() {
  // Clear any stored tokens
  localStorage.removeItem('acacio_token');
  localStorage.removeItem('acacio_user');
  window.location.href = '/';
}
