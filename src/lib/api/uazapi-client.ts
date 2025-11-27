import { createClient } from '@/lib/supabase/client'

/**
 * Cliente completo para chamar as 15 Edge Functions UazAPI
 * Com suporte aos 96 endpoints
 */

const supabase = createClient()

async function invokeFunction(functionName: string, action: string, body?: any, method: 'POST' | 'GET' | 'DELETE' = 'POST') {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Não autenticado')

  // Extract instance token from user metadata if available
  const uazapiToken = session.user.user_metadata?.uazapi_token;

  // Append action to the URL query parameters
  // For GET requests, we also need to append body params as query params if they exist
  let url = `${functionName}?action=${action}`
  let requestBody = body

  if (method === 'GET' && body) {
    const params = new URLSearchParams(body)
    url += `&${params.toString()}`
    requestBody = undefined
  }

  const headers: any = {
    Authorization: `Bearer ${session.access_token}`,
  };

  // If we have a stored instance token, pass it in the headers
  if (uazapiToken) {
      headers['token'] = uazapiToken;
  }

  const options: any = {
    method,
    headers,
  }

  if (method !== 'GET' && requestBody) {
    options.body = requestBody
  }

  const response = await supabase.functions.invoke(url, options)

  if (response.error) {
      const message = response.error.message || response.error.toString();
      // Create a clearer error object
      const err: any = new Error(message);
      err.originalError = response.error;
      throw err;
  }
  return response.data
}

export const uazapiClient = {
  // ==================== ADMINISTRAÇÃO ====================
  admin: {
    async createInstance(instanceName?: string, systemName?: string, adminField01?: string, adminField02?: string) {
      return invokeFunction('uazapi-admin', 'create_instance', {
        instance_name: instanceName,
        system_name: systemName,
        admin_field_01: adminField01,
        admin_field_02: adminField02,
      })
    },
    async listInstances() {
      return invokeFunction('uazapi-admin', 'list_instances', {}, 'GET')
    },
    async updateAdminFields(adminField01?: string, adminField02?: string) {
      return invokeFunction('uazapi-admin', 'update_admin_fields', {
        admin_field_01: adminField01,
        admin_field_02: adminField02,
      })
    },
    async getGlobalWebhook() {
      return invokeFunction('uazapi-admin', 'get_global_webhook', {}, 'GET')
    },
    async configureGlobalWebhook(url: string, events: string[]) {
      return invokeFunction('uazapi-admin', 'configure_global_webhook', {
        webhook_url: url,
        events,
      })
    },
  },

  // ==================== INSTÂNCIA ====================
  instance: {
    async connectInstance(phone?: string) {
      return invokeFunction('uazapi-instance', 'connect_instance', phone ? { phone } : undefined)
    },
    async disconnectInstance(instanceName?: string) {
      return invokeFunction('uazapi-instance', 'disconnect_instance')
    },
    async getInstanceStatus() {
      return invokeFunction('uazapi-instance', 'get_instance_status', {}, 'GET')
    },
    async updateInstanceName(name: string) {
      return invokeFunction('uazapi-instance', 'update_instance_name', { name })
    },
    async deleteInstance() {
      return invokeFunction('uazapi-instance', 'delete_instance', {}, 'DELETE')
    },
    async getPrivacySettings() {
      return invokeFunction('uazapi-instance', 'get_privacy_settings', {}, 'GET')
    },
    async updatePrivacySettings(settings: any) {
      return invokeFunction('uazapi-instance', 'update_privacy_settings', settings)
    },
    async updatePresenceStatus(status: string) {
      return invokeFunction('uazapi-instance', 'update_presence_status', { status })
    },
    async updateChatbotSettings(settings: any) {
      return invokeFunction('uazapi-instance', 'update_chatbot_settings', settings)
    },
    async updateFieldsMap(fields: any) {
      return invokeFunction('uazapi-instance', 'update_fields_map', fields)
    },
  },

  // ==================== PERFIL E CHAMADAS ====================
  profile: {
    async getProfile() {
      return invokeFunction('uazapi-profile-calls', 'get_profile', {}, 'GET')
    },
    async updateProfile(name: string, status: string) {
      return invokeFunction('uazapi-profile-calls', 'update_profile', { name, status })
    },
    async listCalls() {
      return invokeFunction('uazapi-profile-calls', 'list_calls', {}, 'GET')
    },
    async rejectCall(callId: string) {
      return invokeFunction('uazapi-profile-calls', 'reject_call', { call_id: callId })
    },
  },

  // ==================== WEBHOOKS ====================
  webhooks: {
    async getWebhook() {
      return invokeFunction('uazapi-webhooks', 'get_webhook', {}, 'GET')
    },
    async configureWebhook(url: string, events: string[]) {
      return invokeFunction('uazapi-webhooks', 'configure_webhook', {
        webhook_url: url,
        events,
      })
    },
    async connectSSE() {
      return invokeFunction('uazapi-webhooks', 'connect_sse')
    },
  },

  // ==================== MENSAGENS ====================
  messages: {
    async sendText(number: string, message: string) {
      return invokeFunction('uazapi-messages', 'send_text', { number, message })
    },
    async sendImage(number: string, imageUrl: string, caption?: string) {
      return invokeFunction('uazapi-messages', 'send_image', {
        number,
        image_url: imageUrl,
        caption,
      })
    },
    async sendDocument(number: string, documentUrl: string, filename?: string) {
      return invokeFunction('uazapi-messages', 'send_document', {
        number,
        document_url: documentUrl,
        filename,
      })
    },
    async sendAudio(number: string, audioUrl: string) {
      return invokeFunction('uazapi-messages', 'send_audio', {
        number,
        audio_url: audioUrl,
      })
    },
    async sendVideo(number: string, videoUrl: string, caption?: string) {
      return invokeFunction('uazapi-messages', 'send_video', {
        number,
        video_url: videoUrl,
        caption,
      })
    },
    async sendLocation(number: string, latitude: number, longitude: number, label?: string) {
      return invokeFunction('uazapi-messages', 'send_location', {
        number,
        latitude,
        longitude,
        label,
      })
    },
    async sendContact(number: string, contact: any) {
      return invokeFunction('uazapi-messages', 'send_contact', { number, contact })
    },
    async sendList(number: string, title: string, items: any[]) {
      return invokeFunction('uazapi-messages', 'send_list', {
        number,
        title,
        items,
      })
    },
    async sendButtons(number: string, message: string, buttons: any[]) {
      return invokeFunction('uazapi-messages', 'send_buttons', {
        number,
        message,
        buttons,
      })
    },
    async sendTemplate(number: string, templateName: string, parameters?: any[]) {
      return invokeFunction('uazapi-messages', 'send_template', {
        number,
        template_name: templateName,
        parameters,
      })
    },
    async sendPoll(number: string, question: string, options: string[]) {
      return invokeFunction('uazapi-messages', 'send_poll', {
        number,
        question,
        options,
      })
    },
  },

  // ==================== AÇÕES NA MENSAGEM ====================
  messageActions: {
    async reactToMessage(messageId: string, emoji: string) {
      return invokeFunction('uazapi-message-actions', 'react_to_message', {
        message_id: messageId,
        emoji,
      })
    },
    async editMessage(messageId: string, newText: string) {
      return invokeFunction('uazapi-message-actions', 'edit_message', {
        message_id: messageId,
        new_text: newText,
      })
    },
    async deleteMessage(messageId: string) {
      return invokeFunction('uazapi-message-actions', 'delete_message', {
        message_id: messageId,
      })
    },
    async forwardMessage(messageId: string, targetNumber: string) {
      return invokeFunction('uazapi-message-actions', 'forward_message', {
        message_id: messageId,
        target_number: targetNumber,
      })
    },
    async searchMessages(query: string) {
      return invokeFunction('uazapi-message-actions', 'search_messages', { query })
    },
    async getMessageDetails(messageId: string) {
      return invokeFunction('uazapi-message-actions', 'get_message_details', {
        message_id: messageId,
      })
    },
  },

  // ==================== CHATS ====================
  chats: {
    async listChats(limit?: number, offset?: number) {
      return invokeFunction('uazapi-chats', 'list_chats', { limit, offset }, 'GET')
    },
    async getMessages(chatId: string, limit: number = 50) {
      return invokeFunction('uazapi-chats', 'get_messages', { chatId, limit }, 'POST')
    },
    async syncChats() {
      return invokeFunction('uazapi-chats', 'sync_chats', {}, 'POST')
    },
    async getChat(chatId: string) {
      return invokeFunction('uazapi-chats', 'get_chat', { chat_id: chatId }, 'GET')
    },
    async archiveChat(chatId: string) {
      return invokeFunction('uazapi-chats', 'archive_chat', { chat_id: chatId })
    },
    async unarchiveChat(chatId: string) {
      return invokeFunction('uazapi-chats', 'unarchive_chat', { chat_id: chatId })
    },
    async muteChat(chatId: string, duration?: number) {
      return invokeFunction('uazapi-chats', 'mute_chat', {
        chat_id: chatId,
        duration,
      })
    },
    async unmuteChat(chatId: string) {
      return invokeFunction('uazapi-chats', 'unmute_chat', { chat_id: chatId })
    },
  },

  // ==================== CONTATOS ====================
  contacts: {
    async listContacts(limit?: number, offset?: number) {
      return invokeFunction('uazapi-contacts', 'list_contacts', { limit, offset }, 'GET')
    },
    async getContact(number: string) {
      return invokeFunction('uazapi-contacts', 'get_contact', { number }, 'GET')
    },
    async createContact(name: string, number: string) {
      return invokeFunction('uazapi-contacts', 'create_contact', { name, number })
    },
    async updateContact(number: string, name: string) {
      return invokeFunction('uazapi-contacts', 'update_contact', { number, name })
    },
    async deleteContact(number: string) {
      return invokeFunction('uazapi-contacts', 'delete_contact', { number }, 'DELETE')
    },
    async blockContact(number: string) {
      return invokeFunction('uazapi-contacts', 'block_contact', { number })
    },
  },

  // ==================== BLOQUEIOS E ETIQUETAS ====================
  blocksLabels: {
    async listBlockedContacts() {
      return invokeFunction('uazapi-blocks-labels', 'list_blocked_contacts', {}, 'GET')
    },
    async unblockContact(number: string) {
      return invokeFunction('uazapi-blocks-labels', 'unblock_contact', { number })
    },
    async listLabels() {
      return invokeFunction('uazapi-blocks-labels', 'list_labels', {}, 'GET')
    },
    async createLabel(name: string, color?: string) {
      return invokeFunction('uazapi-blocks-labels', 'create_label', {
        name,
        color,
      })
    },
    async addLabelToMessage(messageId: string, labelId: string) {
      return invokeFunction('uazapi-blocks-labels', 'add_label_to_message', {
        message_id: messageId,
        label_id: labelId,
      })
    },
  },

  // ==================== GRUPOS ====================
  groups: {
    async listGroups() {
      return invokeFunction('uazapi-groups', 'list_groups', {}, 'GET')
    },
    async getGroup(groupId: string) {
      return invokeFunction('uazapi-groups', 'get_group', { group_id: groupId }, 'GET')
    },
    async createGroup(name: string, members: string[]) {
      return invokeFunction('uazapi-groups', 'create_group', { subject: name, participants: members })
    },
    async updateGroup(groupId: string, updates: { name?: string, description?: string }) {
      const payload: any = { group_id: groupId, ...updates };
      // Map 'name' to 'subject' as typically required by WhatsApp APIs
      if (updates.name) {
          payload.subject = updates.name;
      }
      return invokeFunction('uazapi-groups', 'update_group', payload)
    },
    async updateGroupPicture(groupId: string, imageUrl: string) {
      return invokeFunction('uazapi-groups', 'update_group_picture', {
        group_id: groupId,
        image_url: imageUrl
      })
    },
    async deleteGroup(groupId: string) {
      return invokeFunction('uazapi-groups', 'delete_group', { group_id: groupId }, 'DELETE')
    },
    async leaveGroup(groupId: string) {
      return invokeFunction('uazapi-groups', 'leave_group', { group_id: groupId })
    },
    async addGroupMember(groupId: string, number: string) {
      return invokeFunction('uazapi-groups', 'add_group_member', {
        group_id: groupId,
        number,
      })
    },
    async removeGroupMember(groupId: string, number: string) {
      return invokeFunction('uazapi-groups', 'remove_group_member', {
        group_id: groupId,
        number,
      })
    },
    async promoteGroupMember(groupId: string, number: string) {
      return invokeFunction('uazapi-groups', 'promote_group_member', {
        group_id: groupId,
        number,
      })
    },
    async demoteGroupMember(groupId: string, number: string) {
      return invokeFunction('uazapi-groups', 'demote_group_member', {
        group_id: groupId,
        number,
      })
    },
    async listGroupMembers(groupId: string) {
      return invokeFunction('uazapi-groups', 'list_group_members', {
        group_id: groupId,
      }, 'GET')
    },
    async getGroupInviteLink(groupId: string) {
      return invokeFunction('uazapi-groups', 'get_group_invite_link', {
        group_id: groupId,
      }, 'GET')
    },
    async revokeGroupInviteLink(groupId: string) {
      return invokeFunction('uazapi-groups', 'revoke_group_invite_link', {
        group_id: groupId,
      })
    },
    async createCommunity(name: string) {
      return invokeFunction('uazapi-groups', 'create_community', { name })
    },
    async listCommunities() {
      return invokeFunction('uazapi-groups', 'list_communities', {}, 'GET')
    },
    async addSubgroupToCommunity(communityId: string, groupId: string) {
      return invokeFunction('uazapi-groups', 'add_subgroup_to_community', {
        community_id: communityId,
        group_id: groupId,
      })
    },
    async removeSubgroupFromCommunity(communityId: string, groupId: string) {
      return invokeFunction('uazapi-groups', 'remove_subgroup_from_community', {
        community_id: communityId,
        group_id: groupId,
      })
    },
  },

  // ==================== RESPOSTAS RÁPIDAS E CRM ====================
  quickCrm: {
    async listQuickReplies() {
      return invokeFunction('uazapi-quick-crm', 'list_quick_replies', {}, 'GET')
    },
    async createQuickReply(title: string, message: string) {
      return invokeFunction('uazapi-quick-crm', 'create_quick_reply', {
        title,
        message,
      })
    },
    async listCrmContacts() {
      return invokeFunction('uazapi-quick-crm', 'list_crm_contacts', {}, 'GET')
    },
    async createCrmContact(name: string, number: string, email?: string) {
      return invokeFunction('uazapi-quick-crm', 'create_crm_contact', {
        name,
        number,
        email,
      })
    },
  },

  // ==================== MENSAGEM EM MASSA ====================
  broadcast: {
    async sendBroadcast(recipients: string[], message: string) {
      return invokeFunction('uazapi-broadcast', 'send_broadcast', {
        recipients,
        message,
      })
    },
    async getBroadcastStatus(broadcastId: string) {
      return invokeFunction('uazapi-broadcast', 'get_broadcast_status', {
        broadcast_id: broadcastId,
      }, 'GET')
    },
    async listBroadcasts() {
      return invokeFunction('uazapi-broadcast', 'list_broadcasts', {}, 'GET')
    },
    async cancelBroadcast(broadcastId: string) {
      return invokeFunction('uazapi-broadcast', 'cancel_broadcast', {
        broadcast_id: broadcastId,
      })
    },
    async pauseBroadcast(broadcastId: string) {
      return invokeFunction('uazapi-broadcast', 'pause_broadcast', {
        broadcast_id: broadcastId,
      })
    },
    async resumeBroadcast(broadcastId: string) {
      return invokeFunction('uazapi-broadcast', 'resume_broadcast', {
        broadcast_id: broadcastId,
      })
    },
    async getBroadcastStats(broadcastId: string) {
      return invokeFunction('uazapi-broadcast', 'get_broadcast_stats', {
        broadcast_id: broadcastId,
      }, 'GET')
    },
  },

  // ==================== CHATWOOT ====================
  chatwoot: {
    async connectChatwoot(url: string, apiKey: string) {
      return invokeFunction('uazapi-chatwoot', 'connect_chatwoot', {
        url,
        api_key: apiKey,
      })
    },
    async disconnectChatwoot() {
      return invokeFunction('uazapi-chatwoot', 'disconnect_chatwoot')
    },
  },

  // ==================== PROXY ====================
  proxy: {
    async enableProxy(proxyUrl: string) {
      return invokeFunction('uazapi-proxy', 'enable_proxy', { proxy_url: proxyUrl })
    },
    async disableProxy() {
      return invokeFunction('uazapi-proxy', 'disable_proxy')
    },
    async getProxyStatus() {
      return invokeFunction('uazapi-proxy', 'get_proxy_status', {}, 'GET')
    },
  },

  // ==================== CHATBOT ====================
  chatbot: {
    async createChatbot(name: string, description?: string) {
      return invokeFunction('uazapi-chatbot', 'create_chatbot', {
        name,
        description,
      })
    },
    async listChatbots() {
      return invokeFunction('uazapi-chatbot', 'list_chatbots', {}, 'GET')
    },
    async getChatbotDetails(chatbotId: string) {
      return invokeFunction('uazapi-chatbot', 'get_chatbot_details', {
        chatbot_id: chatbotId,
      }, 'GET')
    },
    async updateChatbot(chatbotId: string, updates: any) {
      return invokeFunction('uazapi-chatbot', 'update_chatbot', {
        chatbot_id: chatbotId,
        ...updates,
      })
    },
    async deleteChatbot(chatbotId: string) {
      return invokeFunction('uazapi-chatbot', 'delete_chatbot', {
        chatbot_id: chatbotId,
      }, 'DELETE')
    },
    async enableChatbot(chatbotId: string) {
      return invokeFunction('uazapi-chatbot', 'enable_chatbot', {
        chatbot_id: chatbotId,
      })
    },
    async disableChatbot(chatbotId: string) {
      return invokeFunction('uazapi-chatbot', 'disable_chatbot', {
        chatbot_id: chatbotId,
      })
    },
    async trainChatbot(chatbotId: string, trainingData: any[]) {
      return invokeFunction('uazapi-chatbot', 'train_chatbot', {
        chatbot_id: chatbotId,
        training_data: trainingData,
      })
    },
    async getChatbotLogs(chatbotId: string) {
      return invokeFunction('uazapi-chatbot', 'get_chatbot_logs', {
        chatbot_id: chatbotId,
      }, 'GET')
    },
  },
}
