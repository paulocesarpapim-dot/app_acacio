# 🚀 Deploy Online no Vercel - Passo a Passo

Pronto! Seu app está configurado para fazer deploy no Vercel. Aqui está como ativar:

---

## ✅ O que foi feito:

1. ✨ Configuração `vercel.json` completa
2. ✨ Express API integrada ao Vercel (serverless functions)
3. ✨ Frontend buildado e servido staticamente
4. ✨ Roteamento automático para SPA

---

## 🔗 Seu Link do Vercel:

```
https://vercel.com/paulocesarpapim-dots-projects/app-acacio/Bateo6FRXGQ6TMe3VsksyYGt7bnu
```

---

## 🎯 PASSO 1: Acessar o Vercel

Abra este link (você deve estar logado com GitHub):
```
https://vercel.com/paulocesarpapim-dots-projects/app-acacio
```

---

## 🎯 PASSO 2: Verificar o Deploy

O Vercel deve ter detectado a mudança no GitHub. Você verá:

- ✅ Uma nova "Deployment" em progresso
- ✅ Logs mostrando o build
- ✅ Status "Building..." → "Ready" (em verde)

**Isso leva ~2-3 minutos**

---

## 🎯 PASSO 3: Copiar a URL

Quando o build terminar com sucesso (verde), você terá uma URL tipo:

```
https://app-acacio-xxxxx.vercel.app
```

---

## 🧪 TESTE SEU APP:

### Frontend:
```
https://app-acacio-xxxxx.vercel.app/
```

### API - Listar Produtos:
```
https://app-acacio-xxxxx.vercel.app/api/products
```

### Health Check:
```
https://app-acacio-xxxxx.vercel.app/health
```

---

## ⚙️ Se algo der errado:

### Erro: "Build Failed"

1. Abra o build log (clique em "View Build Logs")
2. Procure por erros de tipo:
   - `Missing dependencies` → Faltam pacotes
   - `Build error` → Erro na compilação

**Solução**: Envia a estrutura de pastas:
```
/
├── dist/         ← Frontend buildado
├── api/          ← Backend serverless
├── src/          ← Código React
├── package.json  ← Dependências
└── vercel.json   ← Config Vercel
```

### Erro: "API não funciona"

1. Abra o console do browser (F12)
2. Vá para "Network"
3. Clique em um endpoint da API `/api/products`
4. Veja o erro de resposta

**Solução mais comum**: Aguarde 30 segundos (cold start)

---

## 📊 O que está rodando:

```
Vercel (Edge Network Global)
│
├─ Frontend (React + Vite)
│  └─ /          → index.html com React
│  └─ /produtos  → Página de produtos
│  └─ /carrinho  → Página do carrinho
│
└─ API (Express serverless)
   ├─ /api/products              → GET: Listar todos
   ├─ /api/products/:id          → GET: Um produto
   ├─ /api/products/category/:cat → GET: Por categoria
   ├─ /api/products              → POST: Criar
   ├─ /api/products/:id          → PUT: Atualizar
   ├─ /api/products/:id          → DELETE: Deletar
   └─ /health                     → Hash check da API
```

---

## 🔄 Atualizar seu App:

Qualquer mudança que você fizer:

1. **Modificar código React** (pasta `src/`)
   ```bash
   git add .
   git commit -m "update: mudança no app"
   git push origin main
   ```
   → Vercel faz build automático

2. **Adicionar produtos** (arquivo `api/database.json`)
   ```bash
   git add api/database.json
   git commit -m "update: add new products"
   git push origin main
   ```
   → Produtos aparecem em minutos

3. **Mudar API** (pasta `api/`)
   ```bash
   git add api/
   git commit -m "feat: novo endpoint"
   git push origin main
   ```
   → Vercel faz redeploy automático

---

## 💡 DICAS IMPORTANTES:

1. **Domínio Customizado** (opcional)
   - No painel do Vercel: Settings → Domains
   - Aponte seu domínio para lá
   - Ex: `acacio.com.br`

2. **Variáveis de Ambiente**
   - Settings → Environment Variables
   - Adicione se precisar de APIs externas

3. **Banco de Dados Real** (futuro)
   - `api/database.json` está em memória
   - Para escalabilidade, use:
     - PostgreSQL (Supabase)
     - MongoDB (Atlas)
     - Firebase

4. **Monitoramento**
   - Vercel mostra logs em tempo real
   - Veja latência, erros, etc.

---

## 📞 PRÓXIMOS PASSOS:

- ✅ Veja seu app online
- ✅ Compartilhe a URL
- ✅ Colha feedback dos clientes
- ✅ Adicione mais produtos conforme necessário

---

## ⏱️ Quanto Tempo Leva?

| Etapa | Tempo |
|-------|-------|
| Build Frontend (Vite) | ~30s |
| Setup Backend (Express) | ~10s |
| Deploy Serverless | ~20s |
| **TOTAL** | **~1 min** |

---

**Seu app está PRONTO para o mundo! 🎉**

Qualquer dúvida durante o deploy, me chama!
