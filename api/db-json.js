import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(__dirname, 'database.json');

const isVercel = !!process.env.VERCEL;
const dbPath = isVercel ? '/tmp/database.json' : sourcePath;

// Upstash Redis REST API (no package needed — just fetch)
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = !!(UPSTASH_URL && UPSTASH_TOKEN);

// ——— Redis helpers ———
async function redisCommand(...args) {
  const res = await fetch(UPSTASH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  return await res.json();
}

async function redisGet(key) {
  const { result } = await redisCommand('GET', key);
  return result ? (typeof result === 'string' ? JSON.parse(result) : result) : null;
}

async function redisSet(key, value) {
  await redisCommand('SET', key, JSON.stringify(value));
}

// ——— File helpers ———
function ensureFile() {
  if (isVercel && !fs.existsSync(dbPath)) {
    try {
      const data = fs.readFileSync(sourcePath, 'utf-8');
      fs.writeFileSync(dbPath, data);
      console.log('✅ Copied database.json to /tmp');
    } catch (e) {
      console.error('❌ Error copying database to /tmp:', e.message);
    }
  }
}

function readFile() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch {
    return { products: [], customers: [], orders: [] };
  }
}

function writeFile(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('❌ Error saving file:', e.message);
  }
}

// ——— Sync from Redis on cold start ———
let initPromise = null;

async function syncFromRedis() {
  try {
    const remoteData = await redisGet('database');
    if (remoteData) {
      // Merge: use Redis data as base, fallback to local file for products if Redis has none
      const localData = readFile();
      const merged = {
        ...remoteData,
        // Use Redis products if they were updated (different count or newer),
        // otherwise use deploy bundle as initial seed
        products: (remoteData.products && remoteData.products.length > 0)
          ? remoteData.products
          : localData.products,
        customers: remoteData.customers || [],
        orders: remoteData.orders || [],
        settings: remoteData.settings || {},
        promotions: remoteData.promotions || [],
      };
      writeFile(merged);
      console.log(`✅ Redis sync: ${merged.products.length} produtos, ${merged.customers.length} clientes, ${merged.orders.length} pedidos`);
    } else {
      // First time: seed Redis from file
      const localData = readFile();
      await redisSet('database', localData);
      console.log('✅ Seeded Redis from database.json');
    }
  } catch (e) {
    console.error('❌ Redis sync error:', e.message);
  }
}

// ——— Public API ———
export function initDB() {
  ensureFile();
  if (useRedis) {
    initPromise = syncFromRedis();
    console.log('✅ Database: Upstash Redis + file');
  } else {
    console.log('✅ Database: file only —', dbPath);
    if (isVercel) {
      console.log('⚠️  Dados efêmeros! Configure UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN no Vercel para persistência.');
    }
  }
}

export async function readDB() {
  // Wait for Redis sync on first request after cold start
  if (initPromise) {
    await initPromise;
    initPromise = null;
  }
  return readFile();
}

export function saveDB(data) {
  writeFile(data);
  // Fire-and-forget: persist to Redis in background
  if (useRedis) {
    redisSet('database', data).catch(e => console.error('❌ Redis save error:', e.message));
  }
}

export default { initDB, readDB, saveDB };
