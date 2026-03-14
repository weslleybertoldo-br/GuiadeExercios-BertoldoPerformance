# 💪 Guia de Ativação Muscular — Bertoldo Performance

Site interativo com os exercícios de maior ativação EMG por grupo muscular, com painel administrativo para gerenciar conteúdo.

## Stack
- **Frontend**: React + Vite
- **Banco de dados**: Supabase (PostgreSQL)
- **Hospedagem**: Vercel (grátis)
- **Fontes**: Bebas Neue + DM Sans

---

## 🚀 Configuração Passo a Passo

### 1. Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project**
3. Dê um nome (ex: `muscle-guide`) e defina uma senha do banco
4. Aguarde o projeto ser criado (~2 min)

### 2. Criar as tabelas e popular os dados
1. No Supabase, vá em **SQL Editor**
2. Cole o conteúdo do arquivo `supabase_migration.sql`
3. Clique em **Run** — isso cria todas as tabelas e popula com os dados científicos

### 3. Pegar as chaves do Supabase
1. Vá em **Settings → API**
2. Copie o **Project URL** e o **anon/public key**

### 4. Configurar variáveis de ambiente
1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```
2. Edite o `.env` com suas chaves:
```
VITE_SUPABASE_URL=https://XXXXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_ADMIN_PASSWORD=sua_senha_aqui
```

### 5. Rodar localmente
```bash
npm install
npm run dev
```
Acesse: `http://localhost:5173`

---

## 📦 Deploy no Vercel

### Opção A — Via GitHub (recomendado)
1. Suba o projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e conecte sua conta GitHub
3. Clique em **New Project** → importe o repositório
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
5. Clique em **Deploy**

### Opção B — Via CLI
```bash
npm install -g vercel
vercel --prod
```

---

## 🔐 Acesso Admin
- URL: `https://seusite.vercel.app/admin/login`
- Senha: definida em `VITE_ADMIN_PASSWORD`

No painel admin você pode:
- **Adicionar/editar/excluir** grupos musculares
- **Adicionar/editar/excluir** exercícios
- **Fazer upload** de fotos ou vídeos para cada exercício
- **Adicionar links** do YouTube para vídeos demonstrativos

---

## 📁 Estrutura do Projeto
```
muscle-guide/
├── src/
│   ├── components/
│   │   ├── ExerciseModal.jsx   # Modal com vídeo/foto ao clicar
│   │   └── ExerciseModal.css
│   ├── pages/
│   │   ├── PublicPage.jsx      # Página pública do guia
│   │   ├── PublicPage.css
│   │   ├── AdminLogin.jsx      # Login admin
│   │   ├── AdminLogin.css
│   │   ├── AdminPanel.jsx      # Painel CRUD completo
│   │   └── AdminPanel.css
│   ├── lib/
│   │   └── supabase.js         # Cliente Supabase
│   ├── App.jsx                 # Rotas
│   ├── main.jsx
│   └── index.css               # Tema global
├── supabase_migration.sql      # SQL completo (tabelas + dados)
├── .env.example
├── vite.config.js
└── package.json
```

---

## 🎨 Personalização
- **Senha admin**: altere `VITE_ADMIN_PASSWORD` no `.env`
- **Cores**: edite as variáveis CSS em `src/index.css`
- **Logo**: edite o componente `.logo` em `PublicPage.jsx`
