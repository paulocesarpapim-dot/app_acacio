const https = require('https');
const url = require('url');

// Categorias do site Casa do Norte
const categories = [
  { name: 'BEBIDAS', url: 'https://www.casadonorteloja.com.br/bebidas/' },
  { name: 'CONSERVAS E MOLHOS', url: 'https://www.casadonorteloja.com.br/conservas-e-molhos/' },
  { name: 'DOCES E MEL', url: 'https://www.casadonorteloja.com.br/doces-e-mel/' },
  { name: 'FLOCÃO E GOMA DE TAPIÓCA', url: 'https://www.casadonorteloja.com.br/flocao-e-goma-de-tapioca/' },
  { name: 'MANTEIGA DE GARRAFA', url: 'https://www.casadonorteloja.com.br/manteiga-de-garrafa/' },
  { name: 'PRODUTOS NATURAIS', url: 'https://www.casadonorteloja.com.br/produtos-naturais/' },
  { name: 'TEMPEROS', url: 'https://www.casadonorteloja.com.br/temperos/' }
];

// URLs de produtos extraídas manualmente (mais confiável que scraping dinâmico)
const products = [
  {
    id: 1,
    name: 'Rapadura Castilho Sabores 400g',
    price: 12.00,
    category: 'DOCES E MEL',
    description: 'Rapadura tradicional com sabores variados',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/rapadura-castilho-400g1-grande.jpg'
  },
  {
    id: 2,
    name: 'Rapadura Estrela Batida',
    price: 8.50,
    category: 'DOCES E MEL',
    description: 'Rapadura batida cremosa',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/rapadura-estrela-batida1-grande.jpg'
  },
  {
    id: 3,
    name: 'Noz da Índia - 10 Sementes',
    price: 37.49,
    category: 'PRODUTOS NATURAIS',
    description: 'Sementes de noz da índia para uso medicinal',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/noz-da-india-10-sementes1-grande.jpg'
  },
  {
    id: 4,
    name: 'Goiabada Cascão 1500g',
    price: 45.00,
    category: 'DOCES E MEL',
    description: 'Goiabada de alta qualidade',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/goiabada-cascao-1500g-grande.jpg'
  },
  {
    id: 5,
    name: 'Mel de Laranjeira',
    price: 55.00,
    category: 'DOCES E MEL',
    description: 'Mel puro de laranjeira',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/mel-laranjeira-grande.jpg'
  },
  {
    id: 6,
    name: 'Carne Seca Nordestina 500g',
    price: 32.00,
    category: 'CONSERVAS E MOLHOS',
    description: 'Carne seca de excelente qualidade',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/carne-seca-nordestina-500g-grande.jpg'
  },
  {
    id: 7,
    name: 'Manteiga de Garrafa Nordestina 500g',
    price: 28.00,
    category: 'MANTEIGA DE GARRAFA',
    description: 'Manteiga de garrafa tradicional',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/manteiga-garrafa-500g-grande.jpg'
  },
  {
    id: 8,
    name: 'Queijo Fresco da Serra 500g',
    price: 26.00,
    category: 'PRODUCTOS NATURAIS',
    description: 'Queijo fresco artesanal de alta qualidade',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/queijo-fresco-serra-500g-grande.jpg'
  },
  {
    id: 9,
    name: 'Farinha de Mandioca 1kg',
    price: 8.00,
    category: 'PRODUCTOS NATURAIS',
    description: 'Farinha de mandioca pura',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/farinha-mandioca-1kg-grande.jpg'
  },
  {
    id: 10,
    name: 'Feijão Carioca 1kg',
    price: 6.50,
    category: 'PRODUCTOS NATURAIS',
    description: 'Feijão carioca tipo 1',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/feijao-carioca-1kg-grande.jpg'
  },
  {
    id: 11,
    name: 'Açúcar Cristal 1kg',
    price: 4.50,
    category: 'PRODUCTOS NATURAIS',
    description: 'Açúcar cristal puro',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/acucar-cristal-1kg-grande.jpg'
  },
  {
    id: 12,
    name: 'Sal Grosso 1kg',
    price: 3.00,
    category: 'TEMPEROS',
    description: 'Sal grosso para cozinha',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/sal-grosso-1kg-grande.jpg'
  },
  {
    id: 13,
    name: 'Cachaça Premium 750ml',
    price: 45.00,
    category: 'BEBIDAS',
    description: 'Cachaça artesanal de qualidade premium',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/cachaca-premium-750ml-grande.jpg'
  },
  {
    id: 14,
    name: 'Vinho Nordestino 750ml',
    price: 35.00,
    category: 'BEBIDAS',
    description: 'Vinho tinto regional',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/vinho-nordestino-750ml-grande.jpg'
  },
  {
    id: 15,
    name: 'Suco de Caju Natural 1L',
    price: 12.00,
    category: 'BEBIDAS',
    description: 'Suco de caju natural congelado',
    image_url: 'https://acdn-us.mitiendanube.com/stores/001/686/595/products/suco-caju-1l-grande.jpg'
  }
];

// Função para fazer requisição HTTPS
function fetchUrl(pageUrl) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    https.get(pageUrl, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

// Função para extrair preço e imagem do HTML
function extractProductDetails(html, productName) {
  const priceMatch = html.match(/R\$[\d,]+/g);
  const price = priceMatch ? parseFloat(priceMatch[0].replace('R$', '').replace(',', '.')) : null;
  
  // Tenta extrair URL da imagem
  const imgMatch = html.match(/acdn-us\.mitiendanube\.com\/stores\/[^"']+\.(jpg|png)/i);
  const image = imgMatch ? imgMatch[0] : null;

  return { price, image };
}

// Exporta dados para uso em outro arquivo
module.exports = {
  products,
  categories,
  fetchUrl,
  extractProductDetails
};

// Se executado diretamente, exibe os produtos
if (require.main === module) {
  console.log('=== PRODUTOS CASA DO NORTE ===\n');
  products.forEach(p => {
    console.log(`${p.id}. ${p.name}`);
    console.log(`   Preço: R$ ${p.price.toFixed(2)}`);
    console.log(`   Categoria: ${p.category}`);
    console.log(`   Imagem: ${p.image_url}\n`);
  });
}
