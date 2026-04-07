import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.warn('[admin-auth] AVISO: variável ADMIN_PASSWORD não definida. Defina-a no ambiente para proteger o acesso admin.');
}
const PASSWORD = ADMIN_PASSWORD || 'acacio@admin';

const TOKEN_VALIDITY_MS = 24 * 60 * 60 * 1000; // 24 horas
const HMAC_ALG = 'sha256';
// sha256 hex digest is always 64 characters
const SIG_BYTE_LEN = 32;

// --- Simple in-memory rate limiter for login ---
const loginAttempts = new Map(); // ip -> { count, resetAt }
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count += 1;
  return true;
}

function resetRateLimit(ip) {
  loginAttempts.delete(ip);
}

// --- HMAC token ---
function sign(expires) {
  return crypto
    .createHmac(HMAC_ALG, PASSWORD)
    .update(String(expires))
    .digest('hex');
}

export function generateToken() {
  const expires = Date.now() + TOKEN_VALIDITY_MS;
  return `${expires}.${sign(expires)}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return false;
  const expires = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (Date.now() > parseInt(expires, 10)) return false;
  // Ensure buffers are equal length before timingSafeEqual
  if (signature.length !== SIG_BYTE_LEN * 2) return false;
  const expected = sign(expires);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

// --- Hash-based password comparison (avoids length-mismatch in timingSafeEqual) ---
function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw).digest();
}

export function adminLoginHandler(req, res) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Muitas tentativas. Tente novamente em 15 minutos.' });
  }

  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ error: 'Senha obrigatória' });
  }

  const inputHash = hashPassword(String(password));
  const expectedHash = hashPassword(PASSWORD);
  const correct = crypto.timingSafeEqual(inputHash, expectedHash);

  if (!correct) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  resetRateLimit(ip);
  res.json({ token: generateToken() });
}

export function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }
  next();
}
