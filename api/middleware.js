import crypto from 'crypto';

// ============ PASSWORD HASHING (scrypt — no external deps) ============

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
    crypto.scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export function verifyPassword(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    if (!salt || !key) return resolve(false);
    crypto.scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey));
    });
  });
}

// ============ ADMIN AUTH (token-based) ============

// In-memory admin sessions (simple token store)
const adminSessions = new Map();
const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours

export function createAdminToken() {
  const token = crypto.randomBytes(32).toString('hex');
  adminSessions.set(token, { createdAt: Date.now() });
  return token;
}

export function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de administrador necessário' });
  }

  const token = authHeader.slice(7);
  const session = adminSessions.get(token);

  if (!session) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }

  if (Date.now() - session.createdAt > SESSION_TTL) {
    adminSessions.delete(token);
    return res.status(401).json({ error: 'Sessão expirada' });
  }

  next();
}

// ============ RATE LIMITING (in-memory) ============

const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function loginRateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, []);
  }

  const attempts = loginAttempts.get(ip).filter(t => now - t < WINDOW_MS);
  loginAttempts.set(ip, attempts);

  if (attempts.length >= MAX_ATTEMPTS) {
    return res.status(429).json({
      error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    });
  }

  attempts.push(now);
  next();
}

// Cleanup old entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, attempts] of loginAttempts) {
    const valid = attempts.filter(t => now - t < WINDOW_MS);
    if (valid.length === 0) loginAttempts.delete(ip);
    else loginAttempts.set(ip, valid);
  }
}, 30 * 60 * 1000).unref();
