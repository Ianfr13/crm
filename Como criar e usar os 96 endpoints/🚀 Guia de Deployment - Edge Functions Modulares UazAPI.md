# 🚀 Guia de Deployment - Edge Functions Modulares UazAPI

Este guia explica como fazer o deployment de todas as 12 edge functions modulares no Supabase.

## 📋 Edge Functions Criadas

| # | Função | Endpoints | Descrição |
|---|--------|-----------|-----------|
| 1 | `uazapi-admin` | 5 | Administração (criar instância, listar, webhooks globais) |
| 2 | `uazapi-instance` | 8 | Gerenciamento de instância (conectar, desconectar, status, privacidade) |
| 3 | `uazapi-profile-calls` | 4 | Perfil e Chamadas (perfil, chamadas) |
| 4 | `uazapi-webhooks` | 3 | Webhooks e SSE |
| 5 | `uazapi-messages` | 11 | Enviar mensagens (texto, imagem, documento, áudio, vídeo, etc) |
| 6 | `uazapi-message-actions` | 6 | Ações em mensagens (reagir, editar, deletar, encaminhar, buscar) |
| 7 | `uazapi-chats` | 6 | Gerenciamento de chats (listar, arquivar, silenciar) |
| 8 | `uazapi-contacts` | 6 | Gerenciamento de contatos (listar, criar, atualizar, deletar, bloquear) |
| 9 | `uazapi-blocks-labels` | 5 | Bloqueios e Etiquetas |
| 10 | `uazapi-groups` | 17 | Grupos e Comunidades |
| 11 | `uazapi-quick-crm` | 4 | Respostas Rápidas e CRM |
| 12 | `uazapi-broadcast` | 7 | Mensagens em Massa |
| 13 | `uazapi-chatwoot` | 2 | Integração Chatwoot |
| 14 | `uazapi-proxy` | 3 | Proxy |
| 15 | `uazapi-chatbot` | 9 | ChatBot |

**Total: 96 endpoints distribuídos em 15 edge functions**

## 📁 Estrutura de Pastas

```
supabase/
├── functions/
│   ├── _shared/
│   │   ├── cors.ts
│   │   ├── uazapi-client.ts
│   │   └── shared-utils.ts
│   ├── uazapi-admin.ts
│   ├── uazapi-instance.ts
│   ├── uazapi-profile-calls.ts
│   ├── uazapi-webhooks.ts
│   ├── uazapi-messages.ts
│   ├── uazapi-message-actions.ts
│   ├── uazapi-chats.ts
│   ├── uazapi-contacts.ts
│   ├── uazapi-blocks-labels.ts
│   ├── uazapi-groups.ts
│   ├── uazapi-quick-crm.ts
│   ├── uazapi-broadcast.ts
│   ├── uazapi-chatwoot.ts
│   ├── uazapi-proxy.ts
│   └── uazapi-chatbot.ts
```

## 🔧 Instalação

### 1. Copie os arquivos compartilhados

```bash
# Copie o cliente UazAPI
cp uazapi-client.ts supabase/functions/_shared/

# Copie as utilidades compartilhadas
cp shared-utils.ts supabase/functions/_shared/
```

### 2. Copie todas as edge functions

```bash
cp uazapi-admin.ts supabase/functions/
cp uazapi-instance.ts supabase/functions/
cp uazapi-profile-calls.ts supabase/functions/
cp uazapi-webhooks.ts supabase/functions/
cp uazapi-messages.ts supabase/functions/
cp uazapi-message-actions.ts supabase/functions/
cp uazapi-chats.ts supabase/functions/
cp uazapi-contacts.ts supabase/functions/
cp uazapi-blocks-labels.ts supabase/functions/
cp uazapi-groups.ts supabase/functions/
cp uazapi-quick-crm.ts supabase/functions/
cp uazapi-broadcast.ts supabase/functions/
cp uazapi-chatwoot.ts supabase/functions/
cp uazapi-proxy.ts supabase/functions/
cp uazapi-chatbot.ts supabase/functions/
```

### 3. Configure as variáveis de ambiente

```bash
supabase secrets set UAZAPI_BASE_URL=https://free.uazapi.com
supabase secrets set UAZAPI_ADMIN_TOKEN=seu_admin_token_aqui
```

### 4. Deploy todas as edge functions

```bash
# Deploy individual
supabase functions deploy uazapi-admin
supabase functions deploy uazapi-instance
supabase functions deploy uazapi-profile-calls
supabase functions deploy uazapi-webhooks
supabase functions deploy uazapi-messages
supabase functions deploy uazapi-message-actions
supabase functions deploy uazapi-chats
supabase functions deploy uazapi-contacts
supabase functions deploy uazapi-blocks-labels
supabase functions deploy uazapi-groups
supabase functions deploy uazapi-quick-crm
supabase functions deploy uazapi-broadcast
supabase functions deploy uazapi-chatwoot
supabase functions deploy uazapi-proxy
supabase functions deploy uazapi-chatbot

# Ou deploy em lote
for func in admin instance profile-calls webhooks messages message-actions chats contacts blocks-labels groups quick-crm broadcast chatwoot proxy chatbot; do
  supabase functions deploy uazapi-$func
done
```

## 📡 Usando as Edge Functions

### Headers Obrigatórios

```bash
-H 'Authorization: Bearer SEU_TOKEN_SUPABASE'
-H 'Content-Type: application/json'
```

### Formato de URL

```
https://seu-projeto.supabase.co/functions/v1/uazapi-{categoria}?action={acao}&instance={nome_instancia}
```

### Exemplo: Criar Instância

```bash
curl -X POST https://seu-projeto.supabase.co/functions/v1/uazapi-admin?action=create_instance \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "instance_name": "minha-instancia"
  }'
```

### Exemplo: Enviar Mensagem

```bash
curl -X POST https://seu-projeto.supabase.co/functions/v1/uazapi-messages?action=send_text&instance=minha-instancia \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "number": "5511999999999",
    "message": "Olá!"
  }'
```

### Exemplo: Criar Grupo

```bash
curl -X POST https://seu-projeto.supabase.co/functions/v1/uazapi-groups?action=create_group&instance=minha-instancia \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "subject": "Meu Grupo",
    "participants": ["5511999999999", "5511888888888"]
  }'
```

## 🗂️ Mapeamento de Ações por Função

### uazapi-admin (5 endpoints)
- `create_instance` - POST
- `list_instances` - GET
- `update_admin_fields` - POST
- `get_global_webhook` - GET
- `configure_global_webhook` - POST

### uazapi-instance (8 endpoints)
- `connect_instance` - POST
- `disconnect_instance` - POST
- `get_instance_status` - GET
- `update_instance_name` - POST
- `delete_instance` - DELETE
- `get_privacy_settings` - GET
- `update_privacy_settings` - POST
- `update_presence_status` - POST

### uazapi-profile-calls (4 endpoints)
- `get_profile` - GET
- `update_profile` - POST
- `list_calls` - GET
- `reject_call` - POST

### uazapi-webhooks (3 endpoints)
- `get_webhook` - GET
- `configure_webhook` - POST
- `connect_sse` - GET

### uazapi-messages (11 endpoints)
- `send_text` - POST
- `send_image` - POST
- `send_document` - POST
- `send_audio` - POST
- `send_video` - POST
- `send_location` - POST
- `send_contact` - POST
- `send_list` - POST
- `send_buttons` - POST
- `send_template` - POST
- `send_poll` - POST

### uazapi-message-actions (6 endpoints)
- `react_to_message` - POST
- `edit_message` - POST
- `delete_message` - POST
- `forward_message` - POST
- `search_messages` - GET
- `get_message_details` - GET

### uazapi-chats (6 endpoints)
- `list_chats` - GET
- `get_chat` - GET
- `archive_chat` - POST
- `unarchive_chat` - POST
- `mute_chat` - POST
- `unmute_chat` - POST

### uazapi-contacts (6 endpoints)
- `list_contacts` - GET
- `get_contact` - GET
- `create_contact` - POST
- `update_contact` - POST
- `delete_contact` - DELETE
- `block_contact` - POST

### uazapi-blocks-labels (5 endpoints)
- `list_blocked_contacts` - GET
- `unblock_contact` - POST
- `list_labels` - GET
- `create_label` - POST
- `add_label_to_message` - POST

### uazapi-groups (17 endpoints)
- `list_groups` - GET
- `get_group` - GET
- `create_group` - POST
- `update_group` - POST
- `delete_group` - DELETE
- `leave_group` - POST
- `add_group_member` - POST
- `remove_group_member` - POST
- `promote_group_member` - POST
- `demote_group_member` - POST
- `list_group_members` - GET
- `get_group_invite_link` - GET
- `revoke_group_invite_link` - POST
- `create_community` - POST
- `list_communities` - GET
- `add_subgroup_to_community` - POST
- `remove_subgroup_from_community` - POST

### uazapi-quick-crm (4 endpoints)
- `list_quick_replies` - GET
- `create_quick_reply` - POST
- `list_crm_contacts` - GET
- `create_crm_contact` - POST

### uazapi-broadcast (7 endpoints)
- `send_broadcast` - POST
- `get_broadcast_status` - GET
- `list_broadcasts` - GET
- `cancel_broadcast` - POST
- `pause_broadcast` - POST
- `resume_broadcast` - POST
- `get_broadcast_stats` - GET

### uazapi-chatwoot (2 endpoints)
- `connect_chatwoot` - POST
- `disconnect_chatwoot` - POST

### uazapi-proxy (3 endpoints)
- `enable_proxy` - POST
- `disable_proxy` - POST
- `get_proxy_status` - GET

### uazapi-chatbot (9 endpoints)
- `create_chatbot` - POST
- `list_chatbots` - GET
- `get_chatbot_details` - GET
- `update_chatbot` - POST
- `delete_chatbot` - DELETE
- `enable_chatbot` - POST
- `disable_chatbot` - POST
- `train_chatbot` - POST
- `get_chatbot_logs` - GET

## 🔍 Monitoramento

Para monitorar as edge functions no Supabase:

1. Acesse o dashboard do Supabase
2. Vá para **Functions**
3. Clique em cada função para ver logs e métricas

## 📊 Vantagens da Arquitetura Modular

✅ **Menor tamanho de arquivo** - Cada função é independente  
✅ **Melhor performance** - Funções especializadas  
✅ **Fácil manutenção** - Código organizado por categoria  
✅ **Escalabilidade** - Adicione novas funções facilmente  
✅ **Debugging simplificado** - Logs mais claros por função  
✅ **Deploy independente** - Atualize funções sem afetar outras  

## 🐛 Troubleshooting

### Erro: "UAZAPI_BASE_URL and UAZAPI_ADMIN_TOKEN must be configured"

**Solução:** Configure as variáveis de ambiente:
```bash
supabase secrets set UAZAPI_BASE_URL=https://free.uazapi.com
supabase secrets set UAZAPI_ADMIN_TOKEN=seu_token
```

### Erro: "Unauthorized"

**Solução:** Verifique se o token Supabase está correto no header Authorization.

### Erro: "No uazapi instance found"

**Solução:** Crie uma instância primeiro usando `uazapi-admin?action=create_instance`

## 📚 Próximos Passos

1. Deploy todas as edge functions
2. Teste cada função individualmente
3. Integre com seu frontend
4. Configure webhooks para receber notificações
5. Implemente tratamento de erros robusto

---

**Versão**: 2.0  
**Data**: 26 de novembro de 2025  
**Total de Endpoints**: 96  
**Total de Functions**: 15
