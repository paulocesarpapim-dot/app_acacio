import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'database.json');

// Dados iniciais (seed data)
const initialDB = {
  products: [
    { id: 1, name: "Feijão Carioca", description: "Feijão carioca de qualidade premium, colhido no sertão", category: "Feijão", price: 15.50, image_url: "https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 2, name: "Feijão Preto", description: "Feijão preto autêntico do Nordeste", category: "Feijão", price: 18.00, image_url: "https://images.pexels.com/photos/5737391/pexels-photo-5737391.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 3, name: "Feijão Fradinho", description: "Feijão fradinho fresco e saboroso", category: "Feijão", price: 16.00, image_url: "https://images.pexels.com/photos/4970107/pexels-photo-4970107.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 4, name: "Farinha de Mandioca", description: "Farinha de mandioca brava, moída no dia", category: "Farinha", price: 12.00, image_url: "https://via.placeholder.com/400x400?text=Farinha+Mandioca", created_at: new Date().toISOString() },
    { id: 5, name: "Farinha de Milho", description: "Farinha de milho integral do sertão", category: "Farinha", price: 11.50, image_url: "https://via.placeholder.com/400x400?text=Farinha+Milho", created_at: new Date().toISOString() },
    { id: 6, name: "Farinha de Trigo Integral", description: "Farinha integral moída artesanalmente", category: "Farinha", price: 13.50, image_url: "https://via.placeholder.com/400x400?text=Farinha+Trigo", created_at: new Date().toISOString() },
    { id: 7, name: "Queijo Coalho", description: "Queijo coalho tradicional em cordas", category: "Queijos", price: 25.00, image_url: "https://images.pexels.com/photos/3915857/pexels-photo-3915857.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 8, name: "Queijo de Nata", description: "Queijo meia cura de sabor suave", category: "Queijos", price: 22.00, image_url: "https://via.placeholder.com/400x400?text=Queijo+Nata", created_at: new Date().toISOString() },
    { id: 9, name: "Queijo Meia Cura", description: "Queijo envelhecido 60 dias", category: "Queijos", price: 28.00, image_url: "https://images.pexels.com/photos/3915856/pexels-photo-3915856.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 10, name: "Manteiga Artesanal", description: "Manteiga feita de forma artesanal e natural", category: "Manteiga", price: 32.00, image_url: "https://images.pexels.com/photos/5456286/pexels-photo-5456286.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 11, name: "Manteiga com Sal", description: "Manteiga salgada de qualidade superior", category: "Manteiga", price: 35.00, image_url: "https://via.placeholder.com/400x400?text=Manteiga+Sal", created_at: new Date().toISOString() },
    { id: 12, name: "Manteiga Clarificada", description: "Ghee - manteiga clarificada pura", category: "Manteiga", price: 38.00, image_url: "https://via.placeholder.com/400x400?text=Manteiga+Ghee", created_at: new Date().toISOString() },
    { id: 13, name: "Biscoito de Polvilho", description: "Biscoito crocante de polvilho azedo", category: "Bolachas", price: 8.50, image_url: "https://images.pexels.com/photos/3624529/pexels-photo-3624529.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 14, name: "Broa de Milho", description: "Broa caseira feita com milho torrado", category: "Bolachas", price: 9.00, image_url: "https://images.pexels.com/photos/2624478/pexels-photo-2624478.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 15, name: "Biscoito de Goma", description: "Biscoito tradicional de goma seca", category: "Bolachas", price: 7.50, image_url: "https://via.placeholder.com/400x400?text=Biscoito+Goma", created_at: new Date().toISOString() },
    { id: 16, name: "Rapadura de Cana", description: "Rapadura artesanal da cana de açúcar", category: "Rapadura", price: 6.00, image_url: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 17, name: "Rapadura com Amendoim", description: "Rapadura envolvida em amendoim fresco", category: "Rapadura", price: 8.00, image_url: "https://via.placeholder.com/400x400?text=Rapadura+Amendoim", created_at: new Date().toISOString() },
    { id: 18, name: "Rapadura com Coco", description: "Rapadura feita com coco ralado", category: "Rapadura", price: 8.50, image_url: "https://via.placeholder.com/400x400?text=Rapadura+Coco", created_at: new Date().toISOString() },
    { id: 19, name: "Goiabada Real", description: "Goiabada caseira feita com goiaba selecionada", category: "Doces", price: 14.00, image_url: "https://images.pexels.com/photos/5632593/pexels-photo-5632593.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 20, name: "Doce de Leite Caseiro", description: "Doce de leite feito no tacho de cobre", category: "Doces", price: 16.00, image_url: "https://images.pexels.com/photos/841365/pexels-photo-841365.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 21, name: "Calda de Melado", description: "Melado puro artesanal", category: "Doces", price: 10.00, image_url: "https://via.placeholder.com/400x400?text=Melado", created_at: new Date().toISOString() },
    { id: 22, name: "Milho Branco", description: "Milho branco para canjica e bolo", category: "Cereais", price: 11.00, image_url: "https://via.placeholder.com/400x400?text=Milho+Branco", created_at: new Date().toISOString() },
    { id: 23, name: "Milho Amarelo", description: "Milho amarelo para polenta e mingau", category: "Cereais", price: 10.50, image_url: "https://images.pexels.com/photos/4958618/pexels-photo-4958618.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 24, name: "Arroz Integral", description: "Arroz integral colhido organicamente", category: "Cereais", price: 13.00, image_url: "https://via.placeholder.com/400x400?text=Arroz+Integral", created_at: new Date().toISOString() },
    { id: 25, name: "Requeijão Caseiro", description: "Requeijão feito artesanalmente com leite fresco", category: "Requeijão", price: 19.00, image_url: "https://images.pexels.com/photos/3915858/pexels-photo-3915858.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 26, name: "Requeijão com Manteiga", description: "Requeijão cremoso com manteiga derretida", category: "Requeijão", price: 21.00, image_url: "https://via.placeholder.com/400x400?text=Requeijao+Manteiga", created_at: new Date().toISOString() },
    { id: 27, name: "Requeijão Tradicional", description: "Requeijão na forma tradicional", category: "Requeijão", price: 18.50, image_url: "https://via.placeholder.com/400x400?text=Requeijao", created_at: new Date().toISOString() },
    { id: 28, name: "Mel Puro", description: "Mel silvestre colhido artesanalmente", category: "Outros", price: 24.00, image_url: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 29, name: "Coco Ralado", description: "Coco ralado fresco do sertão", category: "Outros", price: 9.50, image_url: "https://images.pexels.com/photos/3625518/pexels-photo-3625518.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() },
    { id: 30, name: "Amendoim Torrado", description: "Amendoim torrado e salgado", category: "Outros", price: 12.50, image_url: "https://images.pexels.com/photos/4551841/pexels-photo-4551841.jpeg?h=400&w=400&fit=crop", created_at: new Date().toISOString() }
  ]
};

// Função para inicializar banco (JSON)
export function initDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(initialDB, null, 2));
    console.log('✅ Banco de dados criado com 30 produtos!');
  }
}

// Função para ler banco
export function readDB() {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return initialDB;
  }
}

// Função para salvar banco
export function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export default { initDB, readDB, saveDB };
