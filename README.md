# App Acacio - E-Commerce Nordestino

Um aplicativo de e-commerce moderno apresentando produtos autênticos da região Nordeste, com foco em produtos da Casa do Norte.

## 🚀 Sobre o Projeto

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Express.js + JSON Database
- **Deployment**: Vercel
- **Produtos**: 38 itens da Casa do Norte com imagens e preços reais

## 📋 Requisitos

- Node.js >= 18.0.0
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório
```bash
git clone https://github.com/paulocesarpapim-dot/app_acacio.git
cd app_acacio
```

2. Instale as dependências
```bash
npm install
```

3. Inicie o servidor local
```bash
npm run dev  # Frontend em http://localhost:5173
node api/server.js  # API em http://localhost:3000
```

## 📦 Estrutura do Projeto

```
├── src/
│   ├── components/    # Componentes React
│   ├── pages/        # Páginas
│   ├── lib/          # Utilidades
│   └── App.jsx       # App principal
├── api/
│   ├── server.js     # Servidor Express
│   ├── index.js      # Handler Vercel
│   ├── database.json # Dados dos produtos
│   └── controllers/  # API controllers
├── dist/             # Build production
└── package.json
```

## 🌐 Acesso

- **Local Frontend**: http://localhost:5173
- **Local API**: http://localhost:3000/api/products
- **Produção**: https://app-acacio-paulocesarpapim-dots-projects.vercel.app

## 📝 Scripts

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run lint` - Executar linter
- `npm run preview` - Preview do build

## 🎯 API Endpoints

- `GET /api/products` - Lista todos os produtos
- `GET /api/products/:id` - Produto por ID
- `GET /api/products/category/:category` - Produtos por categoria
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

---

**Desenvolvido com ❤️ para o Nordeste**

