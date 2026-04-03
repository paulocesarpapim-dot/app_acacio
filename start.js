import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Iniciando APP Acacio...\n');

// Inicia a API na porta 3000
console.log('📦 Iniciando API...');
const apiProcess = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'api'),
  stdio: 'inherit'
});

apiProcess.on('error', (err) => {
  console.error('❌ Erro ao iniciar API:', err);
  process.exit(1);
});

apiProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ API encerrou com código ${code}`);
    process.exit(code);
  }
});

console.log('✅ API iniciada na porta 3000');
