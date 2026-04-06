# Casa do Norte - API de Imagens com IA

## Configuração das Imagens com IA

Este projeto integra geração de imagens com IA usando o serviço Hugging Face. Para ativar a geração de imagens com IA, siga os passos abaixo:

### 1. Obter API Key do Hugging Face

1. Acesse [https://huggingface.co](https://huggingface.co)
2. Crie uma conta gratuita
3. Acesse [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
4. Crie um novo token (pode ser do tipo "read")
5. Copie seu token

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `api/` com o seguinte conteúdo:

```env
# Hugging Face API Key (para gerar imagens com IA)
HF_API_KEY=hf_seu_token_aqui

# Pexels API Key (opcional - para buscar imagens de stock)
PEXELS_API_KEY=sua_api_key_pexels

# Port (padrão: 3000)
PORT=3000
```

### 3. Usar a API de Imagens

#### Gerar imagem para um produto

**Request:**
```bash
GET /api/images/generate?name=Rapadura&category=Doces&useAI=true
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,...",
  "product": {
    "name": "Rapadura",
    "category": "Doces"
  }
}
```

#### Gerar imagens em batch

**Request:**
```bash
POST /api/images/batch

{
  "products": [
    { "name": "Rapadura", "category": "Doces", "id": 1 },
    { "name": "Carne de Sol", "category": "Carnes", "id": 2 }
  ],
  "useAI": true
}
```

#### Verificar cache de imagens

**Request:**
```bash
GET /api/images/cache
```

**Response:**
```json
{
  "cacheSize": 15,
  "cachedProducts": ["Rapadura", "Carne de Sol", ...]
}
```

#### Limpar cache de imagens

**Request:**
```bash
DELETE /api/images/cache
```

**Response:**
```json
{
  "success": true,
  "message": "Cache limpo. 15 itens removidos."
}
```

### 4. Usar no Frontend React

```javascript
import { generateProductImage, generateProductImagesBatch } from '@/api/productImageService';

// Gerar imagem para um produto
const imageUrl = await generateProductImage('Rapadura', 'Doces', true);

// Gerar imagens para múltiplos produtos
const products = [
  { id: 1, name: 'Rapadura', category: 'Doces' },
  { id: 2, name: 'Carne de Sol', category: 'Carnes' }
];
const updatedProducts = await generateProductImagesBatch(products, true);
```

### 5. Customizar Prompts de IA

Os prompts dos produtos estão definidos em `api/image-service.js` na função `optimizePrompt()`. Você pode customizar os prompts para cada categoria:

```javascript
const categoryPrompts = {
  'Rapadura': 'traditional yellow/brown northeastern Brazilian rapadura candy...',
  'Doces': 'traditional Brazilian sweets...',
  // ... adicione mais categorias aqui
};
```

### 6. Fallback para Imagens de Stock

Se a IA falhar ou não estiver configurada, o sistema automaticamente:
1. Tenta buscar imagens do Pexels (se configurado)
2. Usa uma imagem padrão de placeholder

### 7. Deploy no Vercel

As variáveis de ambiente devem ser adicionadas no painel do Vercel:

1. Acesse seu projeto no Vercel
2. Vá para Settings → Environment Variables
3. Adicione `HF_API_KEY` e `PEXELS_API_KEY`
4. Redeploy o projeto

### Modelos Disponíveis de IA

- **Stable Diffusion 2**: Modelo padrão para gerar imagens (melhor qualidade)
- **Stable Diffusion 1.5**: Alternativa mais rápida
- Outros modelos podem ser ativados alterando a URL em `image-service.js`

### Performance e Cache

- Imagens geradas são automaticamente cacheadas em memória
- O cache persiste durante a sessão do servidor
- Use `/api/images/cache` para monitorar o tamanho do cache

### Dicas de Otimização

1. Use `useAI=false` para usar apenas imagens de stock (mais rápido)
2. Gere imagens em batch ao invés de individual quando possível
3. Implemente cache no frontend com React Query
4. Considere pré-gerar imagens durante a build para evitar latência

### Troubleshooting

**Erro 401 (Unauthorized)**
- Verifique se o `HF_API_KEY` está correto
- Confirme que o token tem acesso ao modelo Stable Diffusion

**Timeout ao gerar imagem**
- A geração de imagem pode levar até 30 segundos
- Aumente o timeout se necessário em `image-service.js`

**Imagens de baixa qualidade**
- Ajuste o prompt em `categoryPrompts`
- Tente diferentes modelos de IA

---

**Desenvolvido para Casa do Norte Filho de Deus 🌵**
