const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const API_URL = isProduction ? '/api' : 'http://localhost:3000/api';

// Dados mockados como fallback
const MOCK_PRODUCTS = [
  { id: 1, name: "Feijão Carioca", description: "Feijão carioca de qualidade premium, colhido no sertão", category: "Feijão", price: 15.50, image_url: "https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 2, name: "Feijão Preto", description: "Feijão preto autêntico do Nordeste", category: "Feijão", price: 18.00, image_url: "https://images.pexels.com/photos/5737391/pexels-photo-5737391.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 3, name: "Feijão Fradinho", description: "Feijão fradinho fresco e saboroso", category: "Feijão", price: 16.00, image_url: "https://images.pexels.com/photos/4970107/pexels-photo-4970107.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 4, name: "Farinha de Mandioca", description: "Farinha de mandioca brava, moída no dia", category: "Farinha", price: 12.00, image_url: "https://images.pexels.com/photos/5737382/pexels-photo-5737382.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 5, name: "Farinha de Milho", description: "Farinha de milho integral do sertão", category: "Farinha", price: 11.50, image_url: "https://images.pexels.com/photos/4551831/pexels-photo-4551831.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 6, name: "Farinha de Trigo Integral", description: "Farinha integral moída artesanalmente", category: "Farinha", price: 13.50, image_url: "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 7, name: "Queijo Coalho", description: "Queijo coalho tradicional em cordas", category: "Queijos", price: 25.00, image_url: "https://images.pexels.com/photos/3915857/pexels-photo-3915857.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 8, name: "Queijo de Nata", description: "Queijo meia cura de sabor suave", category: "Queijos", price: 22.00, image_url: "https://images.pexels.com/photos/3915856/pexels-photo-3915856.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 9, name: "Queijo Meia Cura", description: "Queijo envelhecido 60 dias", category: "Queijos", price: 28.00, image_url: "https://images.pexels.com/photos/7621574/pexels-photo-7621574.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 10, name: "Manteiga Artesanal", description: "Manteiga feita de forma artesanal e natural", category: "Manteiga", price: 32.00, image_url: "https://images.pexels.com/photos/5456286/pexels-photo-5456286.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 11, name: "Manteiga com Sal", description: "Manteiga salgada de qualidade superior", category: "Manteiga", price: 35.00, image_url: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 12, name: "Manteiga Clarificada", description: "Ghee - manteiga clarificada pura", category: "Manteiga", price: 38.00, image_url: "https://images.pexels.com/photos/5737389/pexels-photo-5737389.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 13, name: "Biscoito de Polvilho", description: "Biscoito crocante de polvilho azedo", category: "Bolachas", price: 8.50, image_url: "https://images.pexels.com/photos/3624529/pexels-photo-3624529.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 14, name: "Broa de Milho", description: "Broa caseira feita com milho torrado", category: "Bolachas", price: 9.00, image_url: "https://images.pexels.com/photos/2624478/pexels-photo-2624478.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 15, name: "Biscoito de Goma", description: "Biscoito tradicional de goma seca", category: "Bolachas", price: 7.50, image_url: "https://images.pexels.com/photos/5737386/pexels-photo-5737386.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 16, name: "Rapadura de Cana", description: "Rapadura artesanal da cana de açúcar", category: "Rapadura", price: 6.00, image_url: "https://images.pexels.com/photos/11326/pexels-photo-11326.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 17, name: "Rapadura com Amendoim", description: "Rapadura envolvida em amendoim fresco", category: "Rapadura", price: 8.00, image_url: "https://images.pexels.com/photos/4551841/pexels-photo-4551841.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 18, name: "Rapadura com Coco", description: "Rapadura feita com coco ralado", category: "Rapadura", price: 8.50, image_url: "https://images.pexels.com/photos/3625518/pexels-photo-3625518.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 19, name: "Goiabada Real", description: "Goiabada caseira feita com goiaba selecionada", category: "Doces", price: 14.00, image_url: "https://images.pexels.com/photos/5632593/pexels-photo-5632593.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 20, name: "Doce de Leite Caseiro", description: "Doce de leite feito no tacho de cobre", category: "Doces", price: 16.00, image_url: "https://images.pexels.com/photos/841365/pexels-photo-841365.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 21, name: "Calda de Melado", description: "Melado puro artesanal", category: "Doces", price: 10.00, image_url: "https://images.pexels.com/photos/2775448/pexels-photo-2775448.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 22, name: "Milho Branco", description: "Milho branco para canjica e bolo", category: "Cereais", price: 11.00, image_url: "https://images.pexels.com/photos/5737377/pexels-photo-5737377.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 23, name: "Milho Amarelo", description: "Milho amarelo para polenta e mingau", category: "Cereais", price: 10.50, image_url: "https://images.pexels.com/photos/4958618/pexels-photo-4958618.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 24, name: "Arroz Integral", description: "Arroz integral colhido organicamente", category: "Cereais", price: 13.00, image_url: "https://images.pexels.com/photos/5737378/pexels-photo-5737378.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 25, name: "Requeijão Caseiro", description: "Requeijão feito artesanalmente com leite fresco", category: "Requeijão", price: 19.00, image_url: "https://images.pexels.com/photos/3915858/pexels-photo-3915858.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 26, name: "Requeijão com Manteiga", description: "Requeijão cremoso com manteiga derretida", category: "Requeijão", price: 21.00, image_url: "https://images.pexels.com/photos/7621573/pexels-photo-7621573.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 27, name: "Requeijão Tradicional", description: "Requeijão na forma tradicional", category: "Requeijão", price: 18.50, image_url: "https://images.pexels.com/photos/5737387/pexels-photo-5737387.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 28, name: "Mel Puro", description: "Mel silvestre colhido artesanalmente", category: "Outros", price: 24.00, image_url: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 29, name: "Coco Ralado", description: "Coco ralado fresco do sertão", category: "Outros", price: 9.50, image_url: "https://images.pexels.com/photos/3625518/pexels-photo-3625518.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() },
  { id: 30, name: "Amendoim Torrado", description: "Amendoim torrado e salgado", category: "Outros", price: 12.50, image_url: "https://images.pexels.com/photos/4551841/pexels-photo-4551841.jpeg?auto=compress&cs=tinysrgb&h=400&w=400", created_at: new Date().toISOString() }
];

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Erro ao buscar produtos');
    return await response.json();
  } catch (error) {
    console.warn('API indisponível, usando dados mockados:', error);
    return MOCK_PRODUCTS;
  }
}

export async function fetchProductsByCategory(category) {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    if (!response.ok) throw new Error('Erro ao buscar produtos');
    return await response.json();
  } catch (error) {
    console.warn('API indisponível, usando dados mockados:', error);
    return MOCK_PRODUCTS.filter(p => p.category === category);
  }
}

export async function createProduct(product) {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Erro ao criar produto');
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
}

export async function updateProduct(id, product) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Erro ao atualizar produto');
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar produto');
    return await response.json();
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
}
