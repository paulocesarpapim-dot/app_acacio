import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'database.json');

// Initialize database if it doesn't exist
export function initDB() {
  if (!fs.existsSync(dbPath)) {
    console.log('❌ database.json not found. Please create it first.');
  } else {
    console.log('✅ Database loaded from database.json');
  }
}

// Read database
export function readDB() {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading database:', error.message);
    return { products: [] };
  }
}

// Save database
export function saveDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    console.log('✅ Database saved');
  } catch (error) {
    console.error('❌ Error saving database:', error.message);
  }
}

export default { initDB, readDB, saveDB };
