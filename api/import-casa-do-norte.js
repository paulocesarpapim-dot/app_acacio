#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Script para importar produtos da Casa do Norte Loja
 * Extrai nome, preço e imagem de produtos do site
 */

const CASA_DO_NORTE_BASE = 'https://www.casadonorteloja.com.br';

// Categorias para importar
const CATEGORIAS = [
  { slug: 'doces-e-mel', name: 'Doces' },
  { slug: 'produtos-naturais', name: 'Outros' },
  { slug: 'temperos', name: 'Outros' },
  { slug: 'manteiga-de-garrafa', name: 'Manteiga' },
  { slug: 'conservas-e-molhos', name: 'Outros' },
];

const dbPath = path.join(__dirname, 'database.json');

// Função para extrair dados do HTML
function extrairDadosDoHTML(html) {
  const produtos = [];
  
  // Padrão para encontrar blocos de produtos
  const padraoBloco = /<a\s+href="([^"]*\/produtos\/[^"]*)"[^>]*>[\s\S]*?<\/a>/g;
  const blocos = html.match(padraoBloco) || [];
  
  blocos.forEach((bloco) => {
    // Extrair URL do produto
    const matchUrl = bloco.match(/href="([^"]*\/produtos\/[^"]*)"/);
    const url = matchUrl ? matchUrl[1] : null;
    
    if (!url) return;
    
    // Extrair nome (entre > e <)
    const matchNome = bloco.match(/>([^<]+)<\/a>/);
    const nome = matchNome ? matchNome[1].trim() : null;
    
    if (!nome) return;
    
    produtos.push({
      url: url.startsWith('http') ? url : CASA_DO_NORTE_BASE + url,
      nome: nome,
      slug: url.split('/').filter(Boolean).pop()
    });
  });
  
  return produtos;
}

// Função para buscar página e extrair produtos
async function buscarProdutosDaCategoría(categoria) {
  try {
    console.log(`📦 Buscando produtos de ${categoria.name}...`);
    
    const url = `${CASA_DO_NORTE_BASE}/${categoria.slug}/`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`❌ Erro ao acessar ${url}`);
      return [];
    }
    
    const html = await response.text();
    const produtosExtraidos = extrairDadosDoHTML(html);
    
    console.log(`✅ ${produtosExtraidos.length} produtos encontrados em ${categoria.name}`);
    
    return produtosExtraidos.map(p => ({
      ...p,
      category: categoria.name
    }));
  } catch (error) {
    console.error(`❌ Erro ao buscar categoria ${categoria.name}:`, error.message);
    return [];
  }
}

// Função para extrair preço de uma página de produto
async function extrairPrecoDoProdu(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    
    // Padrão para encontrar preço: R$ + números + vírgula + números
    const matchPreco = html.match(/R\$\s*(\d+(?:,\d{2})?)/);
    if (matchPreco) {
      return parseFloat(matchPreco[1].replace(',', '.'));
    }
    
    // Padrão alternativo
    const matchPrecoAlt = html.match(/"price":\s*(\d+(?:\.\d{2})?)/);
    if (matchPrecoAlt) {
      return parseFloat(matchPrecoAlt[1]);
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Erro ao extrair preço de ${url}`);
    return null;
  }
}

// Função para extrair imagem de uma página de produto
async function extrairImagemDoProduto(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    
    // Padrão para encontrar imagem do produto (CDN da Nuvemshop)
    const matchImagem = html.match(/https:\/\/acdn-us\.mitiendanube\.com\/stores\/[^"]+(?:\.webp|\.jpg|\.png)/);
    if (matchImagem) {
      return matchImagem[0];
    }
    
    // Alternativamente, buscar por data-src ou src
    const matchSrc = html.match(/(?:data-)?src="(https:\/\/acdn[^"]+(?:\.webp|\.jpg|\.png))"/);
    if (matchSrc) {
      return matchSrc[1];
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Erro ao extrair imagem de ${url}`);
    return null;
  }
}

// Função principal
async function importarProdutos() {
  console.log('🚀 Iniciando importação de produtos da Casa do Norte...\n');
  
  let todosProdutos = [];
  
  // Buscar produtos de cada categoria
  for (const categoria of CATEGORIAS) {
    const produtos = await buscarProdutosDaCategoría(categoria);
    todosProdutos = [...todosProdutos, ...produtos];
  }
  
  console.log(`\n📥 Total de ${todosProdutos.length} produtos encontrados`);
  console.log('⏳ Extraindo preços e imagens (pode levar alguns minutos)...\n');
  
  // Para cada produto, extrair preço e imagem
  const produtosComDetalhes = [];
  let id = 31; // Começar de 31 (30 já existem)
  
  for (let i = 0; i < todosProdutos.length; i++) {
    const produto = todosProdutos[i];
    
    process.stdout.write(`\r[${i + 1}/${todosProdutos.length}] ${produto.nome.substring(0, 50)}...`);
    
    const preco = await extrairPrecoDoProdu(produto.url);
    const image_url = await extrairImagemDoProduto(produto.url);
    
    if (preco && image_url) {
      produtosComDetalhes.push({
        id: id++,
        name: produto.nome,
        description: `Produto da Casa do Norte - ${produto.category}`,
        category: produto.category,
        price: preco,
        image_url: image_url,
        created_at: new Date().toISOString()
      });
    }
    
    // Pequeno delay para não sobrecarregar o servidor
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`\n\n✅ ${produtosComDetalhes.length} produtos importados com sucesso!\n`);
  
  // Carregar banco existente
  let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  // Substituir produtos ou adicionar novos
  db.products = [...db.products.slice(0, 30), ...produtosComDetalhes];
  
  // Salvar banco atualizado
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  
  console.log('💾 Banco de dados atualizado!');
  console.log(`📊 Total de produtos agora: ${db.products.length}`);
}

// Executar
importarProdutos().catch(console.error);
