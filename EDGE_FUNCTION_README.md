# UazAPI Edge Function - Documentação Completa

Esta edge function Deno/Supabase fornece uma integração completa com a **UazAPI**, incluindo todos os **96 endpoints** organizados em 18 categorias.

## 📋 Índice

1. [Instalação](#instalação)
2. [Configuração](#configuração)
3. [Uso da Edge Function](#uso-da-edge-function)
4. [Endpoints Disponíveis](#endpoints-disponíveis)
5. [Exemplos de Uso](#exemplos-de-uso)
6. [Tratamento de Erros](#tratamento-de-erros)

## 🚀 Instalação

### Pré-requisitos

- Supabase CLI instalado
- Projeto Supabase configurado
- Variáveis de ambiente configuradas

### Passos

1. **Copie os arquivos para seu projeto Supabase:**

```bash
# Copie o cliente UazAPI
cp uazapi-client.ts supabase/functions/_shared/

# Copie a edge function
cp uazapi-integration.ts supabase/functions/
```

2. **Configure as variáveis de ambiente no Supabase:**

```bash
supabase secrets set UAZAPI_BASE_URL=https://free.uazapi.com
supabase secrets set UAZAPI_ADMIN_TOKEN=seu_admin_token_aqui
```

3. **Deploy a edge function:**

```bash
supabase functions deploy uazapi-integration
```

## ⚙️ Configuração

### Variáveis de Ambiente Necessárias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `UAZAPI_BASE_URL` | URL base da API UazAPI | `https://free.uazapi.com` |
| `UAZAPI_ADMIN_TOKEN` | Token administrativo da UazAPI | `seu_token_aqui` |
| `SUPABASE_URL` | URL do seu projeto Supabase | Configurado automaticamente |
| `SUPABASE_ANON_KEY` | Chave anônima do Supabase | Configurado automaticamente |

## 📡 Uso da Edge Function

### Headers Obrigatórios

Todas as requisições devem incluir:

```bash
-H 'Authorization: Bearer SEU_TOKEN_SUPABASE'
-H 'Content-Type: application/json'
```

### Formato da Requisição

```bash
curl -X {METHOD} https://seu-projeto.supabase.co/functions/v1/uazapi-integration \
  -H 'Authorization: Bearer SEU_TOKEN_SUPABASE' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "nome_da_acao",
    "instance": "nome_da_instancia",
    ...dados_adicionais
  }'
```

## 📚 Endpoints Disponíveis

### 1. ADMINISTRAÇÃO (5 endpoints)

#### Criar Instância
```bash
POST /functions/v1/uazapi-integration?action=create_instance
Body: {
  "instance_name": "minha-instancia",
  "system_name": "apilocal",
  "admin_field_01": "custom-1",
  "admin_field_02": "custom-2"
}
```

#### Listar Instâncias
```bash
GET /functions/v1/uazapi-integration?action=list_instances
```

#### Atualizar Campos Administrativos
```bash
POST /functions/v1/uazapi-integration?action=update_admin_fields
Body: {
  "instance_name": "minha-instancia",
  "admin_field_01": "novo-valor-1",
  "admin_field_02": "novo-valor-2"
}
```

#### Ver Webhook Global
```bash
GET /functions/v1/uazapi-integration?action=get_global_webhook
```

#### Configurar Webhook Global
```bash
POST /functions/v1/uazapi-integration?action=configure_global_webhook
Body: {
  "url": "https://seu-servidor.com/webhook",
  "events": ["messages", "messages_update", "connection"]
}
```

### 2. INSTANCIA (8 endpoints)

#### Conectar Instância
```bash
POST /functions/v1/uazapi-integration?action=connect_instance&instance=minha-instancia
```

#### Desconectar Instância
```bash
POST /functions/v1/uazapi-integration?action=disconnect_instance&instance=minha-instancia
```

#### Obter Status da Instância
```bash
GET /functions/v1/uazapi-integration?action=get_instance_status&instance=minha-instancia
```

#### Atualizar Nome da Instância
```bash
POST /functions/v1/uazapi-integration?action=update_instance_name&instance=minha-instancia
Body: {
  "new_name": "novo-nome"
}
```

#### Deletar Instância
```bash
DELETE /functions/v1/uazapi-integration?action=delete_instance&instance=minha-instancia
```

#### Obter Configurações de Privacidade
```bash
GET /functions/v1/uazapi-integration?action=get_privacy_settings&instance=minha-instancia
```

#### Atualizar Configurações de Privacidade
```bash
POST /functions/v1/uazapi-integration?action=update_privacy_settings&instance=minha-instancia
Body: {
  "read_receipts": true,
  "typing_indicators": true
}
```

#### Atualizar Status de Presença
```bash
POST /functions/v1/uazapi-integration?action=update_presence_status&instance=minha-instancia
Body: {
  "status": "available"
}
```

### 3. PERFIL (2 endpoints)

#### Obter Perfil
```bash
GET /functions/v1/uazapi-integration?action=get_profile&instance=minha-instancia
```

#### Atualizar Perfil
```bash
POST /functions/v1/uazapi-integration?action=update_profile&instance=minha-instancia
Body: {
  "name": "Novo Nome",
  "about": "Meu status",
  "picture": "url_da_imagem"
}
```

### 4. CHAMADAS (2 endpoints)

#### Listar Chamadas
```bash
GET /functions/v1/uazapi-integration?action=list_calls&instance=minha-instancia
```

#### Rejeitar Chamada
```bash
POST /functions/v1/uazapi-integration?action=reject_call&instance=minha-instancia
Body: {
  "call_id": "id_da_chamada"
}
```

### 5. WEBHOOKS E SSE (3 endpoints)

#### Obter Webhook
```bash
GET /functions/v1/uazapi-integration?action=get_webhook&instance=minha-instancia
```

#### Configurar Webhook
```bash
POST /functions/v1/uazapi-integration?action=configure_webhook&instance=minha-instancia
Body: {
  "url": "https://seu-servidor.com/webhook",
  "events": ["message.received", "instance.status"]
}
```

#### Conectar SSE
```bash
GET /functions/v1/uazapi-integration?action=connect_sse&instance=minha-instancia
```

### 6. ENVIAR MENSAGEM (11 endpoints)

#### Enviar Texto
```bash
POST /functions/v1/uazapi-integration?action=send_text&instance=minha-instancia
Body: {
  "number": "5511999999999",
  "message": "Olá! Como vai?"
}
```

#### Enviar Imagem
```bash
POST /functions/v1/uazapi-integration?action=send_image&instance=minha-instancia
Body: {
  "number": "5511999999999",
  "image_url": "https://exemplo.com/imagem.jpg",
  "caption": "Descrição da imagem"
}
```

#### Enviar Documento
```bash
POST /functions/v1/uazapi-integration?action=send_document&instance=minha-instancia
Body: {
  "number": "5511999999999",
  "document_url": "https://exemplo.com/documento.pdf",
  "filename": "documento.pdf"
}
```

#### Enviar Áudio
```bash
POST /functions/v1/uazapi-integration?action=send_audio&instance=minha-instancia
Body: {
  "number": "5511999999999",
  "audio_url": "https://exemplo.com/audio.mp3"
}
```

#### Enviar Vídeo
```bash
POST /functions/v1/uazapi-integration?action=send_video&instance=minha-instancia
Body: {
  "number": "5511999999999",
  "video_url": "https://exemplo.com/video.mp4",
  "caption": "Descrição do vídeo"
}
```

#### Enviar Localização
```bash
POST /functions/v1/uazapi-integration?action=send_location&instance=minha-instancia
Body: {
  "number": "5511999999999",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "label": "São Paulo"
}
```

#### Enviar Contato
```bash
POST /functions/v1/uazapi-integration?action=send_contact&instance=minha-instancia
Body: {
  "number": "5511999999999",
  "contact": {
    "name": "João Silva",
    "phone": "5511988888888"
  }
}
```

#### Enviar Lista
```bash
POST /functions/v1/uazapi-integration?action=send_list&instance=minha-instancia
Body: {
  "number": "5511999999999",
  "list": {
    "title": "Escolha uma opção",
    "items": [
      { "id": "1", "title": "Opção 1" },
      { "id": "2", "title": "Opção 2" }
    ]
  }
}
```

#### Enviar Botões
```bash
POST /functions/v1/uazapi-integration?action=send_buttons&instance=minha-instancia
Body: {
  "number": "5511999999999",
  "message": "Escolha uma opção",
  "buttons": [
    { "id": "1", "text": "Botão 1" },
    { "id": "2", "text": "Botão 2" }
  ]
}
```

#### Enviar Template
```bash
POST /functions/v1/uazapi-integration?action=send_template&instance=minha-instancia
Body: {
  "number": "5511999999999",
  "template_id": "id_do_template",
  "parameters": ["param1", "param2"]
}
```

#### Enviar Enquete
```bash
POST /functions/v1/uazapi-integration?action=send_poll&instance=minha-instancia
Body: {
  "number": "5511999999999",
  "question": "Qual é sua opinião?",
  "options": ["Opção A", "Opção B", "Opção C"]
}
```

### 7. AÇÕES NA MENSAGEM E BUSCAR (6 endpoints)

#### Reagir à Mensagem
```bash
POST /functions/v1/uazapi-integration?action=react_to_message&instance=minha-instancia
Body: {
  "message_id": "id_da_mensagem",
  "emoji": "👍"
}
```

#### Editar Mensagem
```bash
POST /functions/v1/uazapi-integration?action=edit_message&instance=minha-instancia
Body: {
  "message_id": "id_da_mensagem",
  "new_message": "Mensagem editada"
}
```

#### Deletar Mensagem
```bash
POST /functions/v1/uazapi-integration?action=delete_message&instance=minha-instancia
Body: {
  "message_id": "id_da_mensagem"
}
```

#### Encaminhar Mensagem
```bash
POST /functions/v1/uazapi-integration?action=forward_message&instance=minha-instancia
Body: {
  "message_id": "id_da_mensagem",
  "target_number": "5511999999999"
}
```

#### Buscar Mensagens
```bash
GET /functions/v1/uazapi-integration?action=search_messages&instance=minha-instancia&query=termo&limit=50
```

#### Obter Detalhes da Mensagem
```bash
GET /functions/v1/uazapi-integration?action=get_message_details&instance=minha-instancia&message_id=id_da_mensagem
```

### 8. CHATS (6 endpoints)

#### Listar Chats
```bash
GET /functions/v1/uazapi-integration?action=list_chats&instance=minha-instancia
```

#### Obter Chat
```bash
GET /functions/v1/uazapi-integration?action=get_chat&instance=minha-instancia&chat_id=id_do_chat
```

#### Arquivar Chat
```bash
POST /functions/v1/uazapi-integration?action=archive_chat&instance=minha-instancia
Body: {
  "chat_id": "id_do_chat"
}
```

#### Desarquivar Chat
```bash
POST /functions/v1/uazapi-integration?action=unarchive_chat&instance=minha-instancia
Body: {
  "chat_id": "id_do_chat"
}
```

#### Silenciar Chat
```bash
POST /functions/v1/uazapi-integration?action=mute_chat&instance=minha-instancia
Body: {
  "chat_id": "id_do_chat",
  "duration": 3600
}
```

#### Dessilenciar Chat
```bash
POST /functions/v1/uazapi-integration?action=unmute_chat&instance=minha-instancia
Body: {
  "chat_id": "id_do_chat"
}
```

### 9. CONTATOS (6 endpoints)

#### Listar Contatos
```bash
GET /functions/v1/uazapi-integration?action=list_contacts&instance=minha-instancia
```

#### Obter Contato
```bash
GET /functions/v1/uazapi-integration?action=get_contact&instance=minha-instancia&contact_id=id_do_contato
```

#### Criar Contato
```bash
POST /functions/v1/uazapi-integration?action=create_contact&instance=minha-instancia
Body: {
  "name": "João Silva",
  "number": "5511999999999",
  "email": "joao@exemplo.com"
}
```

#### Atualizar Contato
```bash
POST /functions/v1/uazapi-integration?action=update_contact&instance=minha-instancia
Body: {
  "contact_id": "id_do_contato",
  "name": "Novo Nome",
  "email": "novo@exemplo.com"
}
```

#### Deletar Contato
```bash
DELETE /functions/v1/uazapi-integration?action=delete_contact&instance=minha-instancia&contact_id=id_do_contato
```

#### Bloquear Contato
```bash
POST /functions/v1/uazapi-integration?action=block_contact&instance=minha-instancia
Body: {
  "contact_id": "id_do_contato"
}
```

### 10. BLOQUEIOS (2 endpoints)

#### Listar Contatos Bloqueados
```bash
GET /functions/v1/uazapi-integration?action=list_blocked_contacts&instance=minha-instancia
```

#### Desbloquear Contato
```bash
POST /functions/v1/uazapi-integration?action=unblock_contact&instance=minha-instancia
Body: {
  "contact_id": "id_do_contato"
}
```

### 11. ETIQUETAS (3 endpoints)

#### Listar Etiquetas
```bash
GET /functions/v1/uazapi-integration?action=list_labels&instance=minha-instancia
```

#### Criar Etiqueta
```bash
POST /functions/v1/uazapi-integration?action=create_label&instance=minha-instancia
Body: {
  "label": "Importante",
  "color": "#FF0000"
}
```

#### Adicionar Etiqueta à Mensagem
```bash
POST /functions/v1/uazapi-integration?action=add_label_to_message&instance=minha-instancia
Body: {
  "label_id": "id_da_etiqueta",
  "message_id": "id_da_mensagem"
}
```

### 12. GRUPOS E COMUNIDADES (17 endpoints)

#### Listar Grupos
```bash
GET /functions/v1/uazapi-integration?action=list_groups&instance=minha-instancia
```

#### Obter Grupo
```bash
GET /functions/v1/uazapi-integration?action=get_group&instance=minha-instancia&group_id=id_do_grupo
```

#### Criar Grupo
```bash
POST /functions/v1/uazapi-integration?action=create_group&instance=minha-instancia
Body: {
  "subject": "Meu Grupo",
  "participants": ["5511999999999", "5511888888888"]
}
```

#### Atualizar Grupo
```bash
POST /functions/v1/uazapi-integration?action=update_group&instance=minha-instancia
Body: {
  "group_id": "id_do_grupo",
  "subject": "Novo Nome",
  "description": "Nova descrição"
}
```

#### Deletar Grupo
```bash
DELETE /functions/v1/uazapi-integration?action=delete_group&instance=minha-instancia&group_id=id_do_grupo
```

#### Sair do Grupo
```bash
POST /functions/v1/uazapi-integration?action=leave_group&instance=minha-instancia
Body: {
  "group_id": "id_do_grupo"
}
```

#### Adicionar Membro ao Grupo
```bash
POST /functions/v1/uazapi-integration?action=add_group_member&instance=minha-instancia
Body: {
  "group_id": "id_do_grupo",
  "number": "5511999999999"
}
```

#### Remover Membro do Grupo
```bash
POST /functions/v1/uazapi-integration?action=remove_group_member&instance=minha-instancia
Body: {
  "group_id": "id_do_grupo",
  "number": "5511999999999"
}
```

#### Promover Membro do Grupo
```bash
POST /functions/v1/uazapi-integration?action=promote_group_member&instance=minha-instancia
Body: {
  "group_id": "id_do_grupo",
  "number": "5511999999999"
}
```

#### Rebaixar Membro do Grupo
```bash
POST /functions/v1/uazapi-integration?action=demote_group_member&instance=minha-instancia
Body: {
  "group_id": "id_do_grupo",
  "number": "5511999999999"
}
```

#### Listar Membros do Grupo
```bash
GET /functions/v1/uazapi-integration?action=list_group_members&instance=minha-instancia&group_id=id_do_grupo
```

#### Obter Link de Convite do Grupo
```bash
GET /functions/v1/uazapi-integration?action=get_group_invite_link&instance=minha-instancia&group_id=id_do_grupo
```

#### Revogar Link de Convite do Grupo
```bash
POST /functions/v1/uazapi-integration?action=revoke_group_invite_link&instance=minha-instancia
Body: {
  "group_id": "id_do_grupo"
}
```

#### Criar Comunidade
```bash
POST /functions/v1/uazapi-integration?action=create_community&instance=minha-instancia
Body: {
  "subject": "Minha Comunidade",
  "description": "Descrição da comunidade"
}
```

#### Listar Comunidades
```bash
GET /functions/v1/uazapi-integration?action=list_communities&instance=minha-instancia
```

#### Adicionar Subgrupo à Comunidade
```bash
POST /functions/v1/uazapi-integration?action=add_subgroup_to_community&instance=minha-instancia
Body: {
  "community_id": "id_da_comunidade",
  "group_id": "id_do_grupo"
}
```

#### Remover Subgrupo da Comunidade
```bash
POST /functions/v1/uazapi-integration?action=remove_subgroup_from_community&instance=minha-instancia
Body: {
  "community_id": "id_da_comunidade",
  "group_id": "id_do_grupo"
}
```

### 13. RESPOSTAS RÁPIDAS (2 endpoints)

#### Listar Respostas Rápidas
```bash
GET /functions/v1/uazapi-integration?action=list_quick_replies&instance=minha-instancia
```

#### Criar Resposta Rápida
```bash
POST /functions/v1/uazapi-integration?action=create_quick_reply&instance=minha-instancia
Body: {
  "trigger": "oi",
  "response": "Olá! Como posso ajudar?"
}
```

### 14. CRM (2 endpoints)

#### Listar Contatos CRM
```bash
GET /functions/v1/uazapi-integration?action=list_crm_contacts&instance=minha-instancia
```

#### Criar Contato CRM
```bash
POST /functions/v1/uazapi-integration?action=create_crm_contact&instance=minha-instancia
Body: {
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "phone": "5511999999999",
  "company": "Minha Empresa"
}
```

### 15. MENSAGEM EM MASSA (7 endpoints)

#### Enviar Broadcast
```bash
POST /functions/v1/uazapi-integration?action=send_broadcast&instance=minha-instancia
Body: {
  "message": "Mensagem para todos",
  "recipients": ["5511999999999", "5511888888888"]
}
```

#### Obter Status do Broadcast
```bash
GET /functions/v1/uazapi-integration?action=get_broadcast_status&instance=minha-instancia&broadcast_id=id_do_broadcast
```

#### Listar Broadcasts
```bash
GET /functions/v1/uazapi-integration?action=list_broadcasts&instance=minha-instancia
```

#### Cancelar Broadcast
```bash
POST /functions/v1/uazapi-integration?action=cancel_broadcast&instance=minha-instancia
Body: {
  "broadcast_id": "id_do_broadcast"
}
```

#### Pausar Broadcast
```bash
POST /functions/v1/uazapi-integration?action=pause_broadcast&instance=minha-instancia
Body: {
  "broadcast_id": "id_do_broadcast"
}
```

#### Retomar Broadcast
```bash
POST /functions/v1/uazapi-integration?action=resume_broadcast&instance=minha-instancia
Body: {
  "broadcast_id": "id_do_broadcast"
}
```

#### Obter Estatísticas do Broadcast
```bash
GET /functions/v1/uazapi-integration?action=get_broadcast_stats&instance=minha-instancia&broadcast_id=id_do_broadcast
```

### 16. INTEGRAÇÃO CHATWOOT (2 endpoints)

#### Conectar Chatwoot
```bash
POST /functions/v1/uazapi-integration?action=connect_chatwoot&instance=minha-instancia
Body: {
  "account_id": "id_da_conta",
  "inbox_id": "id_da_inbox",
  "api_key": "sua_chave_api"
}
```

#### Desconectar Chatwoot
```bash
POST /functions/v1/uazapi-integration?action=disconnect_chatwoot&instance=minha-instancia
```

### 17. PROXY (3 endpoints)

#### Ativar Proxy
```bash
POST /functions/v1/uazapi-integration?action=enable_proxy&instance=minha-instancia
Body: {
  "proxy_url": "http://proxy.exemplo.com:8080"
}
```

#### Desativar Proxy
```bash
POST /functions/v1/uazapi-integration?action=disable_proxy&instance=minha-instancia
```

#### Obter Status do Proxy
```bash
GET /functions/v1/uazapi-integration?action=get_proxy_status&instance=minha-instancia
```

### 18. CHATBOT (9 endpoints)

#### Criar Chatbot
```bash
POST /functions/v1/uazapi-integration?action=create_chatbot&instance=minha-instancia
Body: {
  "name": "Meu Bot",
  "description": "Descrição do bot",
  "welcome_message": "Bem-vindo!"
}
```

#### Listar Chatbots
```bash
GET /functions/v1/uazapi-integration?action=list_chatbots&instance=minha-instancia
```

#### Obter Detalhes do Chatbot
```bash
GET /functions/v1/uazapi-integration?action=get_chatbot_details&instance=minha-instancia&bot_id=id_do_bot
```

#### Atualizar Chatbot
```bash
POST /functions/v1/uazapi-integration?action=update_chatbot&instance=minha-instancia
Body: {
  "bot_id": "id_do_bot",
  "name": "Novo Nome",
  "description": "Nova descrição"
}
```

#### Deletar Chatbot
```bash
DELETE /functions/v1/uazapi-integration?action=delete_chatbot&instance=minha-instancia&bot_id=id_do_bot
```

#### Ativar Chatbot
```bash
POST /functions/v1/uazapi-integration?action=enable_chatbot&instance=minha-instancia
Body: {
  "bot_id": "id_do_bot"
}
```

#### Desativar Chatbot
```bash
POST /functions/v1/uazapi-integration?action=disable_chatbot&instance=minha-instancia
Body: {
  "bot_id": "id_do_bot"
}
```

#### Treinar Chatbot
```bash
POST /functions/v1/uazapi-integration?action=train_chatbot&instance=minha-instancia
Body: {
  "bot_id": "id_do_bot",
  "training_data": [
    { "input": "oi", "output": "Olá!" },
    { "input": "como vai", "output": "Tudo bem!" }
  ]
}
```

#### Obter Logs do Chatbot
```bash
GET /functions/v1/uazapi-integration?action=get_chatbot_logs&instance=minha-instancia&bot_id=id_do_bot
```

## 💡 Exemplos de Uso

### Exemplo 1: Criar Instância e Enviar Mensagem

```typescript
// 1. Criar instância
const createResponse = await fetch(
  'https://seu-projeto.supabase.co/functions/v1/uazapi-integration?action=create_instance',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer SEU_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      instance_name: 'minha-loja'
    })
  }
);

const { instance_token } = await createResponse.json();

// 2. Enviar mensagem
const sendResponse = await fetch(
  'https://seu-projeto.supabase.co/functions/v1/uazapi-integration?action=send_text&instance=minha-loja',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer SEU_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      number: '5511999999999',
      message: 'Bem-vindo à nossa loja!'
    })
  }
);

const result = await sendResponse.json();
console.log('Mensagem enviada:', result);
```

### Exemplo 2: Criar Grupo e Adicionar Membros

```typescript
// 1. Criar grupo
const createGroupResponse = await fetch(
  'https://seu-projeto.supabase.co/functions/v1/uazapi-integration?action=create_group&instance=minha-loja',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer SEU_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subject: 'Atendimento',
      participants: ['5511999999999']
    })
  }
);

const { data: { id: groupId } } = await createGroupResponse.json();

// 2. Adicionar membro
await fetch(
  'https://seu-projeto.supabase.co/functions/v1/uazapi-integration?action=add_group_member&instance=minha-loja',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer SEU_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      group_id: groupId,
      number: '5511888888888'
    })
  }
);
```

### Exemplo 3: Enviar Broadcast

```typescript
const broadcastResponse = await fetch(
  'https://seu-projeto.supabase.co/functions/v1/uazapi-integration?action=send_broadcast&instance=minha-loja',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer SEU_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Promoção especial: 50% de desconto!',
      recipients: [
        '5511999999999',
        '5511888888888',
        '5511777777777'
      ]
    })
  }
);

const result = await broadcastResponse.json();
console.log('Broadcast enviado:', result);
```

## ⚠️ Tratamento de Erros

### Respostas de Erro

A edge function retorna erros no seguinte formato:

```json
{
  "error": "Descrição do erro",
  "success": false
}
```

### Códigos de Status HTTP

| Código | Significado |
|--------|------------|
| 200 | Sucesso |
| 400 | Requisição inválida ou erro na API |
| 401 | Não autenticado |
| 500 | Erro no servidor |

### Tratamento de Erro Exemplo

```typescript
try {
  const response = await fetch(
    'https://seu-projeto.supabase.co/functions/v1/uazapi-integration?action=send_text&instance=minha-loja',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer SEU_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        number: '5511999999999',
        message: 'Teste'
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error('Erro:', data.error);
    return;
  }

  console.log('Sucesso:', data);
} catch (error) {
  console.error('Erro na requisição:', error);
}
```

## 📝 Notas Importantes

1. **Autenticação**: Todas as requisições devem ser autenticadas com um token Supabase válido.
2. **Instância**: A maioria dos endpoints requer o parâmetro `instance` na query string.
3. **Rate Limiting**: Respeite os limites de taxa da UazAPI.
4. **Tokens**: Mantenha seus tokens seguros e nunca os exponha no código do cliente.
5. **Webhooks**: Configure webhooks para receber notificações em tempo real.

## 🔗 Referências

- [Documentação UazAPI](https://docs.uazapi.com/)
- [Documentação Supabase Functions](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)

---

**Versão**: 2.0  
**Última atualização**: 26 de novembro de 2025  
**Suporte**: Contate o time de desenvolvimento
