# 🛍️ Integração Casa do Norte - Guia Completo

Adicionei 8 produtos da Casa do Norte ao seu app! Aqui está como expandir ainda mais.

---

## ✅ Produtos Já Importados (38 no total)

### De Casa do Norte:
- Rapadura Estrela Batida Sabores - R$ 6,00
- Noz da Índia 10 Sementes - R$ 37,47
- Carne Seca Premium - R$ 45,90
- Mel Puro Silvestre - R$ 28,50
- Castanha do Pará - R$ 42,00
- Goiabada Cascão Premium - R$ 12,90
- Cachaça Artesanal - R$ 35,00
- Bacalhau Importado - R$ 89,90

---

## 🔧 Como Adicionar Mais Produtos?

### Opção 1: Via API (Recomendado)

Envie um POST para `/api/products/batch` com múltiplos produtos:

```bash
curl -X POST http://localhost:3000/api/products/batch \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "name": "Rapadura Castilho Sabores 400g",
        "description": "Rapadura artesanal de qualidade",
        "category": "Rapadura",
        "price": 12.64,
        "image_url": "https://acdn-us.mitiendanube.com/stores/..."
      },
      {
        "name": "Carne Seca Premium 500g",
        "description": "Carne seca de qualidade superior",
        "category": "Outros",
        "price": 35.90,
        "image_url": "https://acdn-us.mitiendanube.com/stores/..."
      }
    ]
  }'
```

### Opção 2: Node.js Script (Para Scraping Automático)

```bash
cd api
node import-casa-do-norte.js
```

⚠️ **Nota**: O script de scraping pode levar alguns minutos pois respeita um delay entre requisições.

### Opção 3: Edição Manual do JSON

1. Abra `api/database.json`
2. Adicione um novo produto no array `products`:

```json
{
  "id": 39,
  "name": "Seu Produto",
  "description": "Descrição aqui",
  "category": "Rapadura",
  "price": 15.50,
  "image_url": "https://...",
  "created_at": "2026-04-03T10:00:00.000Z"
}
```

---

## 📋 Categorias Disponíveis

Ao adicionar produtos, use uma destas categorias:

- `Feijão`
- `Farinha`
- `Queijos`
- `Manteiga`
- `Bolachas`
- `Rapadura`
- `Doces`
- `Cereais`
- `Requeijão`
- `Outros`

---

## 🔗 Endpoints da API

### Listar todos os produtos
```
GET /api/products
```

### Listar por categoria
```
GET /api/products/category/Rapadura
```

### Obter um produto específico
```
GET /api/products/1
```

### Criar um produto
```
POST /api/products
Body: {
  "name": "...",
  "category": "...",
  "price": 0.00,
  "description": "...",
  "image_url": "..."
}
```

### Atualizar um produto
```
PUT /api/products/1
Body: { ...dados atualizados }
```

### Deletar um produto
```
DELETE /api/products/1
```

### Adicionar múltiplos produtos
```
POST /api/products/batch
Body: { "products": [...] }
```

---

## 🖼️ Onde Pegar Imagens?

### Casa do Norte (CDN Nuvemshop)
```
https://acdn-us.mitiendanube.com/stores/...
```

Veja exemplo on site deles: https://www.casadonorteloja.com.br/produtos/rapadura-estrela-batida-sabores-1-unidade/

### Alternativas Gratuitas
- **Pexels**: https://pexels.com
- **Unsplash**: https://unsplash.com
- **Pixabay**: https://pixabay.com

---

## 💡 Dicas

1. **Nomes Descritivos**: Use nomes claros com quantidade/tamanho
   - ✅ "Rapadura Castilho Sabores 400g - 1 Unidade"
   - ❌ "Rapadura"

2. **Preços Realistas**: Compare com o site da Casa do Norte
   - Mantenha compatibilidade com o mercado

3. **Imagens de Qualidade**: Prefira imagens grandes (400x400 px mínimo)

4. **Testes**: Após adicionar, teste:
   ```
   curl http://localhost:3000/api/products | jq
   ```

---

## 🚀 Deploy Automático

Depois que adicionar/alterar produtos localmente:

```bash
git add api/database.json
git commit -m "update: add new Casa do Norte products"
git push origin main
```

No Replit, ele vai usar automaticamente os dados atualizados!

---

## ❓ Problemas Comuns

### Erro 404 na imagem
- Verifique se a URL é válida
- Use o console do browser para testar: `fetch('sua-url-imagem')`

### Preço in inválido
- Deve ser um número: `15.50` (não `R$ 15,50`)
- Use ponto como separador decimal

### Produto não aparece no app
- Reinicie o servidor: `npm run dev`
- Limpe cache do browser: Ctrl+Shift+Delete

---

## 📞 Suporte

Se tiver dúvidas sobre adicionar mais produtos, é só me chamar! 🎯
