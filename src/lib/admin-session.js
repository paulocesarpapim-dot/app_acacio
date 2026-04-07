export const ADMIN_TOKEN_KEY = "admin_token";

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function isAdminAuthenticated() {
  return !!sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function adminLogout() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}
