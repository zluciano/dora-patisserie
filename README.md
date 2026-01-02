# Dora Patisserie - Sistema de Gerenciamento de Pedidos

Sistema de gerenciamento de pedidos para a patisserie Dora, construido com Next.js e Supabase.

## Funcionalidades

- **Dashboard**: Visao geral dos pedidos e estatisticas
- **Produtos**: CRUD completo para gerenciar o catalogo de produtos
- **Pedidos**: Gerenciamento de pedidos com status e itens

## Tecnologias

- **Frontend**: Next.js 14 + React + TypeScript
- **Estilizacao**: Tailwind CSS (cores personalizadas para a marca)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Hospedagem**: Vercel (gratis)

## Configuracao

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratis
2. Crie um novo projeto
3. Va em Settings > API e copie:
   - Project URL
   - anon public key

### 2. Configurar variaveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 3. Criar tabelas no Supabase

Va em SQL Editor no Supabase e execute o conteudo do arquivo `supabase-schema.sql`.

### 4. Executar localmente

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Deploy no Vercel

1. Faca push do projeto para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositorio
3. Adicione as variaveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Estrutura do Projeto

```
src/
  app/
    api/           # Rotas da API
      orders/      # CRUD de pedidos
      products/    # CRUD de produtos
      stats/       # Estatisticas
    orders/        # Paginas de pedidos
    products/      # Paginas de produtos
    page.tsx       # Dashboard
  components/      # Componentes reutilizaveis
  lib/             # Utilitarios (Supabase client)
```

## Paleta de Cores

- **Rose**: #E14B71 (principal)
- **Cream**: #FDF9F3 (fundo)
- **Gold**: #D9A516 (detalhes)
- **Brown**: #4A3728 (texto)

## Licenca

MIT
