# 🚀 Deploy no Replit em 1 Minuto

## Passo 1: Acessar Replit
1. Vá para https://replit.com
2. Clique em **"Sign up"** (ou faça login se tiver conta)
3. Use GitHub para registrar (mais fácil)

## Passo 2: Importar Projeto
1. Clique em **"+ Create"**
2. Selecione **"Import from GitHub"**
3. Cole: `https://github.com/paulocesarpapim-dot/app_acacio`

## Passo 3: Rodar
- Clique no botão **"Run"** (verde no topo)
- Aguarde ~1 minuto

## Pronto! 🎉
Você vai receber uma URL tipo:
```
https://app-acacio.you-username.repl.co/api
```

---

## Configurar Banco de Dados (Supabase)

1. Vá para https://supabase.com
2. Clique em **"Start your project"**
3. Crie um novo projeto (PostgreSQL grátis)
4. Copie a **Database URL** da aba "Connect"
5. No Replit, vá para **"Secrets"** (ícone de chave)
6. Adicione:
   ```
   DATABASE_URL = (copie a URL do Supabase)
   ```
7. Clique em **"Run"** novamente

**E pronto! API online com banco de dados! ✅**

Depois atualizo o frontend para apontar para essa URL!
