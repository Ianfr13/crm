# Configuração do Supabase

## Credenciais do Projeto

**Project ID:** vglhaxrdsvqbwvyywexd  
**Project URL:** https://vglhaxrdsvqbwvyywexd.supabase.co  
**Region:** us-east-2  
**Status:** ✅ ACTIVE_HEALTHY

## Environment Variables

Adicione estas variáveis ao seu arquivo `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://vglhaxrdsvqbwvyywexd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbGhheHJkc3ZxYnd2eXl3ZXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDY1NDksImV4cCI6MjA3OTY4MjU0OX0.Ck0QsYl-LVRjA7c1U_ZslrO7MRgm_Rsm1QD_ldKoHvQ
```

## Database Configuration

### ✅ Migrations Aplicadas

1. **initial_schema** - Schema completo do banco de dados
   - Tabelas: `profiles`, `contacts`, `conversations`, `messages`, `integrations`, `agent_registrations`
   - RLS policies aplicadas
   - Realtime habilitado para `conversations` e `messages`
   - Storage bucket `attachments` criado

2. **event_dispatcher** - Sistema de eventos para AI Agents
   - Extension `pg_net` habilitada
   - Trigger `on_message_created` configurado

## Edge Functions Deployed

### ✅ Funções Ativas (6/7)

1. **contacts** - CRUD de contatos
   - GET: Listar todos os contatos
   - POST: Criar novo contato
   - PATCH: Atualizar contato

2. **conversations** - Gerenciamento de conversas
   - GET: Listar conversas (com filtro por contact_id)
   - POST: Criar nova conversa

3. **messages** - Gerenciamento de mensagens
   - GET: Buscar mensagens por conversation_id
   - POST: Enviar nova mensagem

4. **webhooks** - Receber webhooks externos
   - Provider: Meta (Facebook/Instagram)
   - Provider: Evolution API

5. **agents** - Registro de AI Agents
   - GET: Listar agents registrados
   - POST: Registrar novo agent

6. **dispatch-event** - ❌ FALHOU (dependência externa)
   - Nota: Não é crítico para o MVP inicial

## Próximos Passos

1. Configure `.env.local` localmente com as variáveis acima  
2. Execute `npm run dev` para iniciar o servidor de desenvolvimento  
3. Acesse http://localhost:3000 para ver a aplicação

## URLs Importantes

- Dashboard Supabase: https://supabase.com/dashboard/project/vglhaxrdsvqbwvyywexd
- Project Settings: https://supabase.com/dashboard/project/vglhaxrdsvqbwvyywexd/settings/api
- Database: https://supabase.com/dashboard/project/vglhaxrdsvqbwvyywexd/database/tables
- Edge Functions: https://supabase.com/dashboard/project/vglhaxrdsvqbwvyywexd/functions
