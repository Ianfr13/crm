# Guia de Deploy - Vercel

## 📋 Pré-requisitos

- Conta no Vercel (https://vercel.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Variáveis de ambiente do Supabase

## 🚀 Passos para Deploy

### 1. Preparar Repositório Git

```bash
cd /home/ubuntu/crm

# Inicializar git (se ainda não estiver)
git init
git add .
git commit -m "Initial commit: CRM Frontend"

# Adicionar remote (substitua com seu repositório)
git remote add origin https://github.com/seu-usuario/crm.git
git branch -M main
git push -u origin main
```

### 2. Conectar no Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New..." → "Project"
3. Selecione seu repositório
4. Clique em "Import"

### 3. Configurar Variáveis de Ambiente

Na página de configuração do Vercel:

**Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`: `https://vglhaxrdsvqbwvyywexd.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Framework Preset:** Next.js (detectado automaticamente)

**Build Command:** `npm run build` (padrão)

**Output Directory:** `.next` (padrão)

### 4. Deploy

1. Clique em "Deploy"
2. Aguarde a compilação (2-3 minutos)
3. Vercel fornecerá uma URL pública

### 5. Configurar Domínio (Opcional)

1. Vá para "Settings" → "Domains"
2. Adicione seu domínio
3. Atualize os registros DNS conforme instruído
4. Aguarde propagação (até 48h)

## 🔄 Atualizações Futuras

Após o primeiro deploy, qualquer push para `main` será automaticamente deployado:

```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

Vercel detectará a mudança e fará o deploy automaticamente.

## 🔒 Segurança

- ✅ Anon Key é pública (seguro expor no frontend)
- ✅ Service Role Key nunca deve ser exposta
- ✅ Todas as operações sensíveis via Edge Functions
- ✅ RLS policies protegem os dados

## 📊 Monitoramento

No dashboard do Vercel você pode:
- Ver logs de deployment
- Monitorar performance
- Gerenciar certificados SSL
- Configurar webhooks

## 🆘 Troubleshooting

### Build falha
- Verifique se todas as dependências estão no `package.json`
- Confira se as variáveis de ambiente estão configuradas
- Veja os logs do Vercel para detalhes

### Página em branco
- Verifique o console do navegador (F12)
- Confira se o Supabase está acessível
- Verifique as variáveis de ambiente

### Erro de autenticação
- Confirme que a Anon Key está correta
- Verifique se o Supabase está online
- Teste localmente antes de fazer push

## 📝 Informações Úteis

- **Documentação Vercel:** https://vercel.com/docs
- **Documentação Next.js:** https://nextjs.org/docs
- **Documentação Supabase:** https://supabase.com/docs

---

**Deploy realizado com sucesso!** 🎉
