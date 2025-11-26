# CRM WhatsApp Integration - Documentação Técnica Completa

**Versão:** 1.0  
**Data:** 26/11/2025  
**Stack:** Next.js 16 + Supabase + UazAPI

---

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Componentes Backend](#componentes-backend)
3. [Componentes Frontend](#componentes-frontend)
4. [Fluxo de Dados](#fluxo-de-dados)
5. [Segurança](#segurança)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Status Atual do Projeto](#status-atual-do-projeto)

---

## 🏗️ Visão Geral da Arquitetura

### Stack Tecnológico

- **Frontend:** Next.js 16.0.4 (App Router) + TypeScript + React
- **Backend:** Supabase Edge Functions (Deno runtime)
- **Database:** PostgreSQL (via Supabase)
- **WhatsApp API:** UazAPI (96 endpoints disponíveis)
- **Autenticação:** Supabase Auth (JWT)

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  • src/app/uazapi-test/page.tsx (Test UI)                   │
│  • src/lib/supabase/client.ts (Supabase client)             │
│  • src/lib/supabase/middleware.ts (Auth middleware)         │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTPS + JWT
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTIONS (Deno)                  │
├─────────────────────────────────────────────────────────────┤
│  • uazapi-integration (Main API)                            │
│  • messages (Message sending)                               │
│  • webhooks (Incoming webhooks)                             │
│  • _shared/uazapi-client.ts (UazAPI SDK)                    │
│  • _shared/cors.ts (CORS headers)                           │
└─────────────────┬──────────────┬────────────────────────────┘
                  │              │
        ┌─────────▼──────┐      │
        │   SUPABASE     │      │
        │   SECRETS      │      │
        │  (Env Vars)    │      │
        └────────────────┘      │
                                │ HTTPS
                                ▼
                  ┌─────────────────────────┐
                  │   UAZAPI SERVICE        │
                  │  (WhatsApp Gateway)     │
                  └─────────────────────────┘
                                │
                                ▼
                  ┌─────────────────────────┐
                  │     WhatsApp API        │
                  └─────────────────────────┘
```

---

## 🔧 Componentes Backend

### 1. Edge Functions

#### **`supabase/functions/uazapi-integration/index.ts`**

**Propósito:** API principal para gerenciar instâncias UazAPI  
**Autenticação:** JWT via Supabase Auth  
**Métodos:** GET, POST, DELETE

**Actions Disponíveis:**

| Action | Method | Descrição |
|--------|--------|-----------|
| `create_instance` | POST | Cria nova instância WhatsApp |
| `list_instances` | GET | Lista todas as instâncias (admin) |
| `update_admin_fields` | POST | Atualiza campos administrativos |
| `get_global_webhook` | GET | Obtém webhook global |
| `configure_global_webhook` | POST | Configura webhook global |
| `connect_instance` | POST | Conecta instância ao WhatsApp |
| `disconnect_instance` | POST | Desconecta instância |
| `get_instance_status` | GET | Obtém status e QR code |
| `update_instance_name` | POST | Atualiza nome da instância |
| `delete_instance` | DELETE | Deleta instância |
| `get_privacy_settings` | GET | Obtém configurações de privacidade |
| `update_privacy_settings` | POST | Atualiza privacidade |
| `update_presence_status` | POST | Atualiza status de presença |
| `get_profile` | GET | Obtém perfil WhatsApp |
| `update_profile` | POST | Atualiza perfil |
| `list_calls` | GET | Lista chamadas |
| `reject_call` | POST | Rejeita chamada |
| `get_webhook` | GET | Obtém webhook da instância |
| `configure_webhook` | POST | Configura webhook |
| `connect_sse` | GET | Conecta via Server-Sent Events |
| `send_text` | POST | Envia mensagem de texto |
| `send_image` | POST | Envia imagem |
| `send_document` | POST | Envia documento |
| `send_audio` | POST | Envia áudio |
| `send_video` | POST | Envia vídeo |
| `send_location` | POST | Envia localização |
| `send_contact` | POST | Envia contato |
| `send_list` | POST | Envia lista interativa |
| `send_buttons` | POST | Envia botões |
| `send_template` | POST | Envia template |
| `send_poll` | POST | Envia enquete |
| ... | ... | +65 endpoints adicionais |

**Total de endpoints UazAPI: 96**

---

#### **`supabase/functions/messages/index.ts`**

**Propósito:** Enviar mensagens via WhatsApp  
**Método:** POST  
**Body:**
```json
{
  "conversation_id": "uuid",
  "content": "string",
  "type": "text" | "media"
}
```

**Fluxo:**
1. Autentica usuário
2. Busca conversation e contact
3. Busca integração uazapi ativa do usuário
4. Envia mensagem via UazapiClient
5. Salva mensagem no banco de dados

---

#### **`supabase/functions/webhooks/index.ts`**

**Propósito:** Receber webhooks do WhatsApp  
**Providers Suportados:** `meta`, `evolutionapi`, `uazapi`  
**URL:** `/functions/v1/webhooks?provider=uazapi`

**Eventos Processados:**
- `messages` - Nova mensagem recebida
- `messages_update` - Atualização de mensagem
- `connection` - Status de conexão alterado

**Processamento:**
1. Valida provider
2. Cria/atualiza contact baseado no telefone
3. Cria/busca conversation
4. Salva mensagem no banco
5. Processa mídia se presente

---

### 2. Cliente UazAPI

#### **`supabase/functions/_shared/uazapi-client.ts`**

**Classe:** `UazapiClient`

**Configuração:**
```typescript
interface UazapiClientConfig {
  baseUrl: string;          // URL base da API
  instanceToken?: string;   // Token da instância (por usuário)
  adminToken?: string;      // Token admin (global, do Secret)
}
```

**Categorias de Métodos (18 categorias, 96 métodos):**

1. **Administração** (5)
   - `createInstance()`, `listInstances()`, `updateAdminFields()`, etc.

2. **Instância** (8)
   - `connectInstance()`, `disconnectInstance()`, `getInstanceStatus()`, etc.

3. **Perfil** (2)
   - `getProfile()`, `updateProfile()`

4. **Chamadas** (2)
   - `listCalls()`, `rejectCall()`

5. **Webhooks e SSE** (3)
   - `getWebhook()`, `configureWebhook()`, `connectSSE()`

6. **Enviar Mensagem** (11)
   - `sendText()`, `sendImage()`, `sendDocument()`, `sendAudio()`, etc.

7. **Ações na Mensagem** (6)
   - `react ToMessage()`, `editMessage()`, `deleteMessage()`, etc.

8. **Chats** (6)
   - `listChats()`, `archiveChat()`, `muteChat()`, etc.

9. **Contatos** (6)
   - `listContacts()`, `createContact()`, `blockContact()`, etc.

10. **Bloqueios** (2)
11. **Etiquetas** (3)
12. **Grupos e Comunidades** (17)
13. **Respostas Rápidas** (2)
14. **CRM** (2)
15. **Mensagem em Massa** (7)
16. **Integração Chatwoot** (2)
17. **Proxy** (3)
18. **Chatbot** (9)

**Autenticação:**
- Headers `admintoken` para operações administrativas
- Headers `token` para operações de instância

---

### 3. CORS Configuration

#### **`supabase/functions/_shared/cors.ts`**

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

---

## 💻 Componentes Frontend

### 1. Página de Teste

#### **`src/app/uazapi-test/page.tsx`**

**Rota:** `/uazapi-test`

**Funcionalidades:**

1. **Display de Integração**
   - Mostra instance_token (se criado)
   - Status ativo/inativo
   - Indicação de Secrets configurados

2. **Criar Instância**
   - Input para nome da instância (opcional)
   - Botão "Create Instance"
   - Chama `create_instance` action

3. **Obter QR Code**
   - Botão "Get QR Code"
   - Chama `get_instance_status` action
   - Exibe QR code para scan no WhatsApp
   - Mostra mensagem se já conectado

4. **Check Status**
   - Botão "Check Connection Status"
   - Chama `get_instance_status` action
   - Mostra dados completos do status

5. **Test Message Sending**
   - Input conversation_id
   - Textarea para mensagem
   - Envia via `/functions/v1/messages`

**Estados:**
```typescript
const [loading, setLoading] = useState(false)
const [result, setResult] = useState<any>(null)
const [error, setError] = useState<string | null>(null)
const [integration, setIntegration] = useState<any>(null)
const [session, setSession] = useState<any>(null)
const [qrCode, setQrCode] = useState<string | null>(null)
```

---

### 2. Supabase Client

#### **`src/lib/supabase/client.ts`**

```typescript
import { createBrowserClient } from '@supabase/ssr'
import { supabaseConfig } from './config'

export const createClient = () => 
  createBrowserClient(
    supabaseConfig.supabaseUrl, 
    supabaseConfig.supabaseAnonKey
  )
```

---

### 3. Supabase Config

#### **`src/lib/supabase/config.ts`**

**Hardcoded** (para evitar problemas com Turbopack):
```typescript
export const supabaseConfig = {
  supabaseUrl: 'https://[PROJECT_ID].supabase.co',
  supabaseAnonKey: '[ANON_KEY]'
}
```

---

### 4. Middleware

#### **`src/lib/supabase/middleware.ts`**

**Propósito:** Gerenciar sessão Supabase no Next.js middleware  
**Função:** Atualiza sessão, redireciona não autenticados

---

## 🔄 Fluxo de Dados

### Fluxo 1: Criar Instância WhatsApp

```
1. USER clica "Create Instance" no frontend
   └─> POST /functions/v1/uazapi-integration?action=create_instance
       ├─ Headers: Authorization: Bearer [JWT]
       └─ Body: { instance_name: "optional" }

2. Edge Function autentica JWT
   └─> supabase.auth.getUser()

3. Edge Function busca Secrets
   ├─> UAZAPI_BASE_URL (do Supabase Secrets)
   └─> UAZAPI_ADMIN_TOKEN (do Supabase Secrets)

4. Cria UazapiClient com adminToken

5. Chama uazapi.createInstance(name)
   └─> POST https://[UAZAPI_URL]/instance/init
       ├─ Headers: { admintoken: [ADMIN_TOKEN] }
       └─ Body: { name, systemName, adminField01, adminField02 }

6. UazAPI cria instância e retorna
   {
     token: "[INSTANCE_TOKEN]",
     instance: { id: "[ID]", ... }
   }

7. Edge Function salva no banco
   └─> INSERT/UPDATE integrations
       ├─ user_id: [USER_ID]
       ├─ provider: 'uazapi'
       ├─ instance_token: [INSTANCE_TOKEN]
       ├─ active: true
       └─ metadata: { instance_id, instance_name }

8. Retorna sucesso ao frontend
```

---

### Fluxo 2: Obter QR Code e Conectar

```
1. USER clica "Get QR Code"
   └─> GET /functions/v1/uazapi-integration?action=get_instance_status

2. Edge Function busca instance_token do banco
   └─> SELECT instance_token FROM integrations 
       WHERE user_id = [USER_ID] AND provider = 'uazapi'

3. Cria UazapiClient com instanceToken

4. Chama uazapi.getInstanceStatus()
   └─> GET https://[UAZAPI_URL]/instance/[NAME]/status
       └─ Headers: { token: [INSTANCE_TOKEN] }

5. UazAPI retorna status
   {
     connected: false,
     instance: {
       qrcode: "data:image/png;base64,...",
       status: "disconnected",
       ...
     }
   }

6. Frontend exibe QR code
   └─> <img src={qrcode} />

7. USER escaneia QR com WhatsApp

8. UazAPI detecta conexão via webhook
   └─> POST /functions/v1/webhooks?provider=uazapi
       └─ Body: { event: "connection", connected: true, ... }

9. Webhook atualiza status no banco (se necessário)
```

---

### Fluxo 3: Enviar Mensagem

```
1. USER preenche formulário e clica "Send Message"
   └─> POST /functions/v1/messages
       ├─ Headers: Authorization: Bearer [JWT]
       └─ Body: { conversation_id, content, type }

2. Edge Function autentica e busca dados
   ├─> Busca conversation
   ├─> Busca contact
   └─> Busca integração uazapi ativa

3. Cria UazapiClient com instance_token do banco

4. Envia mensagem
   └─> uazapi.sendText(instanceName, phoneNumber, message)
       └─> POST https://[UAZAPI_URL]/instance/[NAME]/message/send
           ├─ Headers: { token: [INSTANCE_TOKEN] }
           └─ Body: { number, message }

5. UazAPI envia via WhatsApp

6. Edge Function salva mensagem no banco
   └─> INSERT INTO messages
       ├─ conversation_id
       ├─ content
       ├─ direction: 'outbound'
       └─ provider_message_id (se retornado)

7. Retorna sucesso ao frontend
```

---

### Fluxo 4: Receber Mensagem (Webhook)

```
1. WhatsApp envia mensagem para número conectado

2. UazAPI processa e envia webhook
   └─> POST /functions/v1/webhooks?provider=uazapi
       └─ Body: {
            event: "messages",
            data: {
              fromMe: false,
              from: "55119999999@c.us",
              body: "Olá!",
              ...
            }
          }

3. Webhook Edge Function processa
   ├─> Extrai número de telefone
   ├─> Busca/cria contact
   ├─> Busca/cria conversation
   └─> Salva message

4. Frontend pode buscar mensagens via polling ou real-time subscription
```

---

## 🔐 Segurança

### 1. Autenticação

- **JWT Bearer Tokens:** Todas as requisições ao backend requerem JWT
- **Supabase Auth:** Gerencia autenticação de usuários
- **Row-Level Security (RLS):** Habilitado no banco de dados

### 2. Gestão de Credenciais

**Secrets no Supabase (Nível de Projeto):**
- `UAZAPI_BASE_URL` - URL base da API UazAPI
- `UAZAPI_ADMIN_TOKEN` - Token administrativo (compartilhado)
- `SUPABASE_URL` - Configurado automaticamente
- `SUPABASE_ANON_KEY` - Configurado automaticamente
- `SUPABASE_SERVICE_ROLE_KEY` - Configurado automaticamente

**Tokens por Usuário (Database):**
- `instance_token` - Armazenado na tabela `integrations`
- Único para cada usuário
- Usado para operações específicas da instância

**Frontend:**
- ❌ NENHUM token sensível hardcoded
- ✅ Apenas `supabaseUrl` e `anonKey` (públicos)
- ✅ JWT obtido via autenticação

### 3. CORS

- Configurado para permitir requisições do frontend
- Headers apropriados em todas as Edge Functions

---

## 🗄️ Database Schema

### Tabela: `integrations`

```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  provider VARCHAR CHECK (provider IN ('meta', 'evolutionapi', 'uazapi')),
  
  -- UazAPI specific fields
  base_url TEXT,           -- DEPRECATED: Agora usa Secret
  instance_token TEXT,     -- Token da instância (por usuário)
  admin_token TEXT,        -- DEPRECATED: Agora usa Secret
  
  active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'
);

-- Índices
CREATE INDEX idx_integrations_user_provider 
  ON integrations(user_id, provider);
```

**Metadata JSON Structure:**
```json
{
  "instance_id": "r7a307e127a6a1d",
  "instance_name": "minha-instancia"
}
```

---

### Tabela: `conversations`

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  channel VARCHAR, -- 'whatsapp', 'email', etc.
  status VARCHAR DEFAULT 'open',
  assigned_to UUID REFERENCES profiles(id),
  last_message_at TIMESTAMPTZ,
  unread_count INT DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);
```

---

### Tabela: `contacts`

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  phone VARCHAR,
  email VARCHAR,
  name VARCHAR,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_contacts_phone ON contacts(phone);
```

---

### Tabela: `messages`

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  direction VARCHAR CHECK (direction IN ('inbound', 'outbound')),
  content TEXT,
  content_type VARCHAR DEFAULT 'text',
  provider_message_id VARCHAR,
  status VARCHAR DEFAULT 'sent',
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_messages_conversation 
  ON messages(conversation_id, created_at DESC);
```

---

## 📡 API Endpoints

### Frontend → Backend

| Endpoint | Method | Autenticação | Propósito |
|----------|--------|--------------|-----------|
| `/functions/v1/uazapi-integration` | GET | JWT | Obter integração do usuário |
| `/functions/v1/uazapi-integration?action=*` | POST/GET/DELETE | JWT | Gerenciar instâncias |
| `/functions/v1/messages` | POST | JWT | Enviar mensagem |
| `/functions/v1/webhooks?provider=uazapi` | POST | Public | Receber webhooks |

### Backend → UazAPI

**Base URL:** Configurado via Secret `UAZAPI_BASE_URL`

**Exemplos de Endpoints:**

| Path | Method | Headers | Propósito |
|------|--------|---------|-----------|
| `/instance/init` | POST | `admintoken` | Criar instância |
| `/instance/list` | GET | `admintoken` | Listar instâncias |
| `/instance/{name}/status` | GET | `token` | Obter status/QR |
| `/instance/{name}/message/send` | POST | `token` | Enviar texto |
| `/instance/{name}/webhook` | POST | `token` | Configurar webhook |

---

## ✅ Status Atual do Projeto

### Implementado ✅

1. **Backend Completo**
   - ✅ 96 endpoints UazAPI integrados
   - ✅ Cliente UazAPI completo para TypeScript/Deno
   - ✅ Edge Function `uazapi-integration` com todas as actions
   - ✅ Edge Function `messages` para envio
   - ✅ Edge Function `webhooks` para receber mensagens
   - ✅ Gestão de credenciais via Supabase Secrets
   - ✅ Autenticação JWT em todas as rotas

2. **Database**
   - ✅ Schema completo criado
   - ✅ Migração `20241125000000_add_uazapi_support.sql` aplicada
   - ✅ Tabelas: integrations, conversations, contacts, messages

3. **Frontend**
   - ✅ Página de teste `/uazapi-test`
   - ✅ UI para criar instância
   - ✅ UI para obter QR code
   - ✅ UI para check status
   - ✅ UI para enviar mensagens de teste
   - ✅ Integração com Supabase Auth

4. **Segurança**
   - ✅ Tokens sensíveis em Supabase Secrets
   - ✅ JWT Authentication
   - ✅ CORS configurado
   - ✅ Nenhum token exposto no frontend

5. **Deployment**
   - ✅ Edge Functions deployadas no Supabase
   - ✅ Secrets configurados
   - ✅ Frontend rodando localmente (Next.js dev)

### Testado ✅

- ✅ Criação de instância WhatsApp
- ✅ Geração de QR code
- ⏳ Conexão via QR code (pendente teste do usuário)
- ⏳ Envio de mensagens (aguardando conexão)
- ⏳ Recebimento de webhooks (aguardando conexão)

### Próximos Passos 📋

1. **Testar Conexão Completa**
   - Escanear QR code com WhatsApp
   - Verificar status de conexão
   - Enviar mensagem de teste

2. **Configurar Webhook**
   - Usar action `configure_webhook`
   - Apontar para `/functions/v1/webhooks?provider=uazapi`
   - Testar recebimento de mensagens

3. **Integração com CRM Principal**
   - Criar componentes reais de conversação
   - Implementar UI de chat
   - Sincronizar com outros módulos do CRM

4. **Melhorias**
   - Adicionar retry logic
   - Implementar rate limiting
   - Adicionar logs estruturados
   - Criar dashboard de monitoramento

---

## 📚 Arquivos de Referência

### Documentação Criada

1. **`EDGE_FUNCTION_README.md`** - Documentação completa dos 96 endpoints
2. **`UAZAPI_SECRETS_SETUP.md`** - Guia de configuração dos Secrets
3. **`SUPABASE_CONFIG.md`** - Configuração geral do Supabase
4. **Este documento** - Visão geral da arquitetura

### Estrutura de Arquivos

```
c:\Users\Ian Francio\Desktop\CRM\
├── src/
│   ├── app/
│   │   └── uazapi-test/
│   │       └── page.tsx                    # UI de teste
│   └── lib/
│       └── supabase/
│           ├── client.ts                   # Cliente Supabase
│           ├── config.ts                   # Configuração
│           └── middleware.ts               # Middleware de auth
├── supabase/
│   ├── functions/
│   │   ├── uazapi-integration/
│   │   │   └── index.ts                    # API principal (96 endpoints)
│   │   ├── messages/
│   │   │   └── index.ts                    # Envio de mensagens
│   │   ├── webhooks/
│   │   │   └── index.ts                    # Recebimento de webhooks
│   │   └── _shared/
│   │       ├── uazapi-client.ts            # SDK UazAPI
│   │       └── cors.ts                     # Configuração CORS
│   └── migrations/
│       ├── 20240525000000_initial_schema.sql
│       └── 20241125000000_add_uazapi_support.sql
├── EDGE_FUNCTION_README.md
├── UAZAPI_SECRETS_SETUP.md
├── SUPABASE_CONFIG.md
└── package.json
```

---

## 🔍 Comandos Úteis

### Deployment

```bash
# Deploy todas as funções
npx supabase functions deploy --project-ref [PROJECT_ID]

# Deploy função específica
npx supabase functions deploy uazapi-integration --project-ref [PROJECT_ID]

# Configurar secrets
npx supabase secrets set UAZAPI_BASE_URL=https://[URL] --project-ref [PROJECT_ID]
npx supabase secrets set UAZAPI_ADMIN_TOKEN=[TOKEN] --project-ref [PROJECT_ID]

# Listar secrets
npx supabase secrets list --project-ref [PROJECT_ID]
```

### Development

```bash
# Rodar frontend
npm run dev

# Ver logs das Edge Functions
npx supabase functions logs uazapi-integration --project-ref [PROJECT_ID]
```

---

## 📞 Suporte

Para dúvidas técnicas sobre:
- **UazAPI:** https://docs.uazapi.com
- **Supabase:** https://supabase.com/docs
- **Next.js:** https://nextjs.org/docs

---

**Última Atualização:** 26/11/2025  
**Status:** ✅ Produção Ready (aguardando testes finais de conexão)
