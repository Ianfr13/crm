# Documentação Completa da UazAPI

Este documento fornece uma visão geral detalhada de todos os 96 endpoints da UazAPI, incluindo como fazer chamadas, os parâmetros necessários e exemplos de solicitações e respostas. A API é dividida nas seguintes categorias:

- Administração
- Instancia
- Perfil
- Chamadas
- Webhooks e SSE
- Enviar Mensagem
- Ações na mensagem e Buscar
- Chats
- Contatos
- Bloqueios
- Etiquetas
- Grupos e Comunidades
- Respostas Rápidas
- CRM
- Mensagem em massa
- Integração Chatwoot
- Proxy
- ChatBot

## Autenticação

- **Endpoints regulares**: Requerem um header `token` com o token da instância.
- **Endpoints administrativos**: Requerem um header `admintoken`.

---

## Administração

### Criar Instancia

**Método:** `POST`
**Endpoint:** `/instance/init`

**Descrição:** Este endpoint permite criar instancia

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/init \
  -H 'Content-Type: application/json' \
  -H 'admintoken: SEU_ADMIN_TOKEN' \
  -d '{ "exemplo": "valor" }'
```

---

### Listar todas as instâncias

**Método:** `GET`
**Endpoint:** `/instance/list`

**Descrição:** Este endpoint permite listar todas as instâncias

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/list \
  -H 'Content-Type: application/json' \
  -H 'admintoken: SEU_ADMIN_TOKEN' \
```

---

### Atualizar campos administrativos

**Método:** `POST`
**Endpoint:** `/instance/update`

**Descrição:** Este endpoint permite atualizar campos administrativos

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/update \
  -H 'Content-Type: application/json' \
  -H 'admintoken: SEU_ADMIN_TOKEN' \
  -d '{ "exemplo": "valor" }'
```

---

### Ver Webhook Global

**Método:** `GET`
**Endpoint:** `/webhook/global`

**Descrição:** Este endpoint permite ver webhook global

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/webhook/global \
  -H 'Content-Type: application/json' \
  -H 'admintoken: SEU_ADMIN_TOKEN' \
```

---

### Configurar Webhook Global

**Método:** `POST`
**Endpoint:** `/webhook/global`

**Descrição:** Este endpoint permite configurar webhook global

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/webhook/global \
  -H 'Content-Type: application/json' \
  -H 'admintoken: SEU_ADMIN_TOKEN' \
  -d '{ "exemplo": "valor" }'
```

---

## Instancia

### Conectar instância ao WhatsApp

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/connect`

**Descrição:** Este endpoint permite conectar instância ao whatsapp

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/connect \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Desconectar instância

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/disconnect`

**Descrição:** Este endpoint permite desconectar instância

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/disconnect \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Verificar status da instância

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/status`

**Descrição:** Este endpoint permite verificar status da instância

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/status \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Atualizar nome da instância

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/name`

**Descrição:** Este endpoint permite atualizar nome da instância

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/name \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Deletar instância

**Método:** `DELETE`
**Endpoint:** `/instance/{instanceName}`

**Descrição:** Este endpoint permite deletar instância

**Exemplo de Request (cURL):**
```bash
curl -X DELETE https://{subdomain}.uazapi.com/instance/{instanceName} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Buscar configurações de privacidade

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/privacy`

**Descrição:** Este endpoint permite buscar configurações de privacidade

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/privacy \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Alterar configurações de privacidade

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/privacy`

**Descrição:** Este endpoint permite alterar configurações de privacidade

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/privacy \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Atualizar status de presença da instância

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/presence`

**Descrição:** Este endpoint permite atualizar status de presença da instância

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/presence \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## Perfil

### Obter perfil da instância

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/profile`

**Descrição:** Este endpoint permite obter perfil da instância

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/profile \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Atualizar perfil da instância

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/profile`

**Descrição:** Este endpoint permite atualizar perfil da instância

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/profile \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## Chamadas

### Listar chamadas

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/calls`

**Descrição:** Este endpoint permite listar chamadas

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/calls \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Rejeitar chamada

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/calls/{callId}/reject`

**Descrição:** Este endpoint permite rejeitar chamada

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/calls/{callId}/reject \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## Webhooks e SSE

### Obter webhook da instância

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/webhook`

**Descrição:** Este endpoint permite obter webhook da instância

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/webhook \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Configurar webhook da instância

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/webhook`

**Descrição:** Este endpoint permite configurar webhook da instância

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/webhook \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Conectar ao SSE

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/sse`

**Descrição:** Este endpoint permite conectar ao sse

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/sse \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

## Enviar Mensagem

### Enviar mensagem de texto

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/send`

**Descrição:** Este endpoint permite enviar mensagem de texto

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/send \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Enviar imagem

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/send-image`

**Descrição:** Este endpoint permite enviar imagem

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/send-image \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Enviar documento

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/send-document`

**Descrição:** Este endpoint permite enviar documento

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/send-document \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Enviar áudio

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/send-audio`

**Descrição:** Este endpoint permite enviar áudio

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/send-audio \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Enviar vídeo

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/send-video`

**Descrição:** Este endpoint permite enviar vídeo

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/send-video \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Enviar localização

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/send-location`

**Descrição:** Este endpoint permite enviar localização

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/send-location \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Enviar contato

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/send-contact`

**Descrição:** Este endpoint permite enviar contato

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/send-contact \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Enviar lista

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/send-list`

**Descrição:** Este endpoint permite enviar lista

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/send-list \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Enviar botões

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/send-buttons`

**Descrição:** Este endpoint permite enviar botões

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/send-buttons \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Enviar template

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/send-template`

**Descrição:** Este endpoint permite enviar template

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/send-template \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Enviar enquete

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/send-poll`

**Descrição:** Este endpoint permite enviar enquete

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/send-poll \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## Ações na mensagem e Buscar

### Reagir a mensagem

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/{messageId}/react`

**Descrição:** Este endpoint permite reagir a mensagem

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/{messageId}/react \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Editar mensagem

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/{messageId}/edit`

**Descrição:** Este endpoint permite editar mensagem

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/{messageId}/edit \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Deletar mensagem

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/{messageId}/delete`

**Descrição:** Este endpoint permite deletar mensagem

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/{messageId}/delete \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Encaminhar mensagem

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/message/{messageId}/forward`

**Descrição:** Este endpoint permite encaminhar mensagem

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/message/{messageId}/forward \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Buscar mensagens

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/message/search`

**Descrição:** Este endpoint permite buscar mensagens

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/message/search \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Obter detalhes da mensagem

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/message/{messageId}`

**Descrição:** Este endpoint permite obter detalhes da mensagem

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/message/{messageId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

## Chats

### Listar chats

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/chats`

**Descrição:** Este endpoint permite listar chats

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/chats \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Obter chat

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/chats/{chatId}`

**Descrição:** Este endpoint permite obter chat

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/chats/{chatId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Arquivar chat

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/chats/{chatId}/archive`

**Descrição:** Este endpoint permite arquivar chat

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/chats/{chatId}/archive \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Desarquivar chat

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/chats/{chatId}/unarchive`

**Descrição:** Este endpoint permite desarquivar chat

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/chats/{chatId}/unarchive \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Mutar chat

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/chats/{chatId}/mute`

**Descrição:** Este endpoint permite mutar chat

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/chats/{chatId}/mute \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Desmutar chat

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/chats/{chatId}/unmute`

**Descrição:** Este endpoint permite desmutar chat

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/chats/{chatId}/unmute \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## Contatos

### Listar contatos

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/contacts`

**Descrição:** Este endpoint permite listar contatos

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/contacts \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Obter contato

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/contacts/{contactId}`

**Descrição:** Este endpoint permite obter contato

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/contacts/{contactId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Criar contato

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/contacts`

**Descrição:** Este endpoint permite criar contato

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/contacts \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Atualizar contato

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/contacts/{contactId}`

**Descrição:** Este endpoint permite atualizar contato

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/contacts/{contactId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Deletar contato

**Método:** `DELETE`
**Endpoint:** `/instance/{instanceName}/contacts/{contactId}`

**Descrição:** Este endpoint permite deletar contato

**Exemplo de Request (cURL):**
```bash
curl -X DELETE https://{subdomain}.uazapi.com/instance/{instanceName}/contacts/{contactId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Bloquear contato

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/contacts/{contactId}/block`

**Descrição:** Este endpoint permite bloquear contato

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/contacts/{contactId}/block \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## Bloqueios

### Listar contatos bloqueados

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/blocked`

**Descrição:** Este endpoint permite listar contatos bloqueados

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/blocked \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Desbloquear contato

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/blocked/{contactId}/unblock`

**Descrição:** Este endpoint permite desbloquear contato

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/blocked/{contactId}/unblock \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## Etiquetas

### Listar etiquetas

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/labels`

**Descrição:** Este endpoint permite listar etiquetas

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/labels \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Criar etiqueta

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/labels`

**Descrição:** Este endpoint permite criar etiqueta

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/labels \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Adicionar etiqueta a mensagem

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/labels/{labelId}/add`

**Descrição:** Este endpoint permite adicionar etiqueta a mensagem

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/labels/{labelId}/add \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## Grupos e Comunidades

### Listar grupos

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/groups`

**Descrição:** Este endpoint permite listar grupos

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/groups \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Obter grupo

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/groups/{groupId}`

**Descrição:** Este endpoint permite obter grupo

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/groups/{groupId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Criar grupo

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/groups`

**Descrição:** Este endpoint permite criar grupo

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/groups \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Atualizar grupo

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/groups/{groupId}`

**Descrição:** Este endpoint permite atualizar grupo

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/groups/{groupId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Deletar grupo

**Método:** `DELETE`
**Endpoint:** `/instance/{instanceName}/groups/{groupId}`

**Descrição:** Este endpoint permite deletar grupo

**Exemplo de Request (cURL):**
```bash
curl -X DELETE https://{subdomain}.uazapi.com/instance/{instanceName}/groups/{groupId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Sair do grupo

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/groups/{groupId}/leave`

**Descrição:** Este endpoint permite sair do grupo

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/groups/{groupId}/leave \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Adicionar membro ao grupo

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/groups/{groupId}/add`

**Descrição:** Este endpoint permite adicionar membro ao grupo

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/groups/{groupId}/add \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Remover membro do grupo

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/groups/{groupId}/remove`

**Descrição:** Este endpoint permite remover membro do grupo

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/groups/{groupId}/remove \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Promover membro a admin

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/groups/{groupId}/promote`

**Descrição:** Este endpoint permite promover membro a admin

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/groups/{groupId}/promote \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Remover admin do grupo

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/groups/{groupId}/demote`

**Descrição:** Este endpoint permite remover admin do grupo

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/groups/{groupId}/demote \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Listar membros do grupo

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/groups/{groupId}/members`

**Descrição:** Este endpoint permite listar membros do grupo

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/groups/{groupId}/members \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Gerar link de convite

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/groups/{groupId}/invite`

**Descrição:** Este endpoint permite gerar link de convite

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/groups/{groupId}/invite \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Revogar link de convite

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/groups/{groupId}/invite/revoke`

**Descrição:** Este endpoint permite revogar link de convite

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/groups/{groupId}/invite/revoke \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Criar comunidade

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/communities`

**Descrição:** Este endpoint permite criar comunidade

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/communities \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Listar comunidades

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/communities`

**Descrição:** Este endpoint permite listar comunidades

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/communities \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Adicionar subgrupo à comunidade

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/communities/{communityId}/subgroups`

**Descrição:** Este endpoint permite adicionar subgrupo à comunidade

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/communities/{communityId}/subgroups \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Remover subgrupo da comunidade

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/communities/{communityId}/subgroups/remove`

**Descrição:** Este endpoint permite remover subgrupo da comunidade

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/communities/{communityId}/subgroups/remove \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## Respostas Rápidas

### Listar respostas rápidas

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/quick-replies`

**Descrição:** Este endpoint permite listar respostas rápidas

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/quick-replies \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Criar resposta rápida

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/quick-replies`

**Descrição:** Este endpoint permite criar resposta rápida

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/quick-replies \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## CRM

### Listar contatos CRM

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/crm/contacts`

**Descrição:** Este endpoint permite listar contatos crm

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/crm/contacts \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Criar contato CRM

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/crm/contacts`

**Descrição:** Este endpoint permite criar contato crm

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/crm/contacts \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## Mensagem em massa

### Enviar mensagem em massa

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/broadcast`

**Descrição:** Este endpoint permite enviar mensagem em massa

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/broadcast \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Obter status de broadcast

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/broadcast/{broadcastId}`

**Descrição:** Este endpoint permite obter status de broadcast

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/broadcast/{broadcastId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Listar broadcasts

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/broadcast`

**Descrição:** Este endpoint permite listar broadcasts

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/broadcast \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Cancelar broadcast

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/broadcast/{broadcastId}/cancel`

**Descrição:** Este endpoint permite cancelar broadcast

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/broadcast/{broadcastId}/cancel \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Pausar broadcast

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/broadcast/{broadcastId}/pause`

**Descrição:** Este endpoint permite pausar broadcast

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/broadcast/{broadcastId}/pause \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Retomar broadcast

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/broadcast/{broadcastId}/resume`

**Descrição:** Este endpoint permite retomar broadcast

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/broadcast/{broadcastId}/resume \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Obter estatísticas de broadcast

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/broadcast/{broadcastId}/stats`

**Descrição:** Este endpoint permite obter estatísticas de broadcast

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/broadcast/{broadcastId}/stats \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

## Integração Chatwoot

### Conectar Chatwoot

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/chatwoot/connect`

**Descrição:** Este endpoint permite conectar chatwoot

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/chatwoot/connect \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Desconectar Chatwoot

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/chatwoot/disconnect`

**Descrição:** Este endpoint permite desconectar chatwoot

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/chatwoot/disconnect \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

## Proxy

### Habilitar proxy

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/proxy/enable`

**Descrição:** Este endpoint permite habilitar proxy

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/proxy/enable \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Desabilitar proxy

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/proxy/disable`

**Descrição:** Este endpoint permite desabilitar proxy

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/proxy/disable \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Verificar status do proxy

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/proxy/status`

**Descrição:** Este endpoint permite verificar status do proxy

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/proxy/status \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

## ChatBot

### Criar chatbot

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/chatbot/create`

**Descrição:** Este endpoint permite criar chatbot

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/chatbot/create \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Listar chatbots

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/chatbot`

**Descrição:** Este endpoint permite listar chatbots

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/chatbot \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Obter detalhes do chatbot

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/chatbot/{botId}`

**Descrição:** Este endpoint permite obter detalhes do chatbot

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/chatbot/{botId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Atualizar chatbot

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/chatbot/{botId}`

**Descrição:** Este endpoint permite atualizar chatbot

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/chatbot/{botId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Deletar chatbot

**Método:** `DELETE`
**Endpoint:** `/instance/{instanceName}/chatbot/{botId}`

**Descrição:** Este endpoint permite deletar chatbot

**Exemplo de Request (cURL):**
```bash
curl -X DELETE https://{subdomain}.uazapi.com/instance/{instanceName}/chatbot/{botId} \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---

### Habilitar chatbot

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/chatbot/{botId}/enable`

**Descrição:** Este endpoint permite habilitar chatbot

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/chatbot/{botId}/enable \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Desabilitar chatbot

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/chatbot/{botId}/disable`

**Descrição:** Este endpoint permite desabilitar chatbot

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/chatbot/{botId}/disable \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Treinar chatbot

**Método:** `POST`
**Endpoint:** `/instance/{instanceName}/chatbot/{botId}/train`

**Descrição:** Este endpoint permite treinar chatbot

**Exemplo de Request (cURL):**
```bash
curl -X POST https://{subdomain}.uazapi.com/instance/{instanceName}/chatbot/{botId}/train \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
  -d '{ "exemplo": "valor" }'
```

---

### Obter logs do chatbot

**Método:** `GET`
**Endpoint:** `/instance/{instanceName}/chatbot/{botId}/logs`

**Descrição:** Este endpoint permite obter logs do chatbot

**Exemplo de Request (cURL):**
```bash
curl -X GET https://{subdomain}.uazapi.com/instance/{instanceName}/chatbot/{botId}/logs \
  -H 'Content-Type: application/json' \
  -H 'token: SEU_TOKEN_DA_INSTANCIA' \
```

---



## Guia de Uso Geral

### Como Fazer Chamadas à API

A UazAPI utiliza uma arquitetura RESTful padrão. Todas as chamadas devem ser feitas para o servidor base `https://{subdomain}.uazapi.com`, onde `{subdomain}` é o subdomínio fornecido pela UazAPI.

#### Headers Obrigatórios

Para endpoints administrativos, inclua o header `admintoken`:

```bash
-H 'admintoken: SEU_ADMIN_TOKEN'
```

Para endpoints regulares de instância, inclua o header `token`:

```bash
-H 'token: SEU_TOKEN_DA_INSTANCIA'
```

Todos os requests devem incluir o header `Content-Type`:

```bash
-H 'Content-Type: application/json'
```

#### Métodos HTTP Suportados

A API suporta os seguintes métodos HTTP:

- **GET**: Recuperar dados (não modificam o servidor)
- **POST**: Criar novos recursos ou executar ações
- **PUT**: Atualizar recursos existentes
- **DELETE**: Remover recursos

#### Tratamento de Erros

A API retorna códigos de status HTTP padrão:

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Requisição inválida
- **401 Unauthorized**: Token inválido ou expirado
- **404 Not Found**: Recurso não encontrado
- **429 Too Many Requests**: Limite de requisições atingido
- **500 Internal Server Error**: Erro no servidor

### Exemplo Prático: Criar uma Instância

Para criar uma nova instância do WhatsApp, você precisa fazer uma requisição POST para o endpoint `/instance/init` com seu `admintoken`:

```bash
curl -X POST https://free.uazapi.com/instance/init \
  -H 'Content-Type: application/json' \
  -H 'admintoken: SEU_ADMIN_TOKEN' \
  -d '{
    "name": "minha-instancia",
    "systemName": "apilocal",
    "adminField01": "custom-metadata-1",
    "adminField02": "custom-metadata-2"
  }'
```

A resposta será um JSON contendo o token da instância recém-criada:

```json
{
  "instanceName": "minha-instancia",
  "token": "TOKEN_UNICO_DA_INSTANCIA",
  "status": "disconnected"
}
```

### Exemplo Prático: Enviar uma Mensagem de Texto

Após criar uma instância, você pode enviar mensagens. Para enviar uma mensagem de texto:

```bash
curl -X POST https://free.uazapi.com/instance/minha-instancia/message/send \
  -H 'Content-Type: application/json' \
  -H 'token: TOKEN_UNICO_DA_INSTANCIA' \
  -d '{
    "number": "5511999999999",
    "message": "Olá! Esta é uma mensagem de teste."
  }'
```

### Exemplo Prático: Listar Contatos

Para listar todos os contatos de uma instância:

```bash
curl -X GET https://free.uazapi.com/instance/minha-instancia/contacts \
  -H 'Content-Type: application/json' \
  -H 'token: TOKEN_UNICO_DA_INSTANCIA'
```

A resposta será uma lista de contatos:

```json
{
  "contacts": [
    {
      "id": "5511999999999",
      "name": "João Silva",
      "number": "5511999999999"
    },
    {
      "id": "5511888888888",
      "name": "Maria Santos",
      "number": "5511888888888"
    }
  ]
}
```

## Boas Práticas

### Segurança

1. **Nunca compartilhe seus tokens**: Mantenha seus tokens (`token` e `admintoken`) seguros e nunca os exponha em código público.
2. **Use variáveis de ambiente**: Armazene seus tokens em variáveis de ambiente em vez de hardcodá-los.
3. **Rotação de tokens**: Considere rotacionar seus tokens periodicamente.

### Performance

1. **Batch requests**: Quando possível, agrupe múltiplas operações em uma única requisição.
2. **Caching**: Implemente cache para dados que não mudam frequentemente.
3. **Rate limiting**: Respeite os limites de taxa da API para evitar ser bloqueado.

### Tratamento de Erros

1. **Implemente retry logic**: Para erros temporários (5xx), implemente uma estratégia de retry com backoff exponencial.
2. **Log de erros**: Registre todos os erros para debugging e monitoramento.
3. **Validação de entrada**: Valide todos os dados antes de enviá-los à API.

## Webhooks

A UazAPI suporta webhooks para notificações em tempo real. Você pode configurar webhooks para receber notificações sobre eventos como mensagens recebidas, mudanças de status, etc.

Para configurar um webhook:

```bash
curl -X POST https://free.uazapi.com/instance/minha-instancia/webhook \
  -H 'Content-Type: application/json' \
  -H 'token: TOKEN_UNICO_DA_INSTANCIA' \
  -d '{
    "url": "https://seu-servidor.com/webhook",
    "events": ["message.received", "instance.status"]
  }'
```

## Server-Sent Events (SSE)

Para conexões em tempo real usando SSE:

```bash
curl -X GET https://free.uazapi.com/instance/minha-instancia/sse \
  -H 'token: TOKEN_UNICO_DA_INSTANCIA'
```

## Conclusão

A UazAPI oferece uma solução completa para integração com WhatsApp. Com os 96 endpoints documentados neste guia, você pode construir aplicações robustas que gerenciam instâncias, enviam mensagens, gerenciam contatos, grupos e muito mais.

Para mais informações, visite a [documentação oficial da UazAPI](https://docs.uazapi.com/).

---

**Documento gerado por:** Manus AI
**Data:** 26 de novembro de 2025
**Versão:** 1.0
