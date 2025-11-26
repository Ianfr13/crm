/**
 * UazAPI Client - Completo com todos os 96 endpoints
 * Versão 2.0 - WhatsApp API
 */

interface UazapiClientConfig {
  baseUrl: string;
  instanceToken?: string;
  adminToken?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class UazapiClient {
  private baseUrl: string;
  private instanceToken?: string;
  private adminToken?: string;

  constructor(config: UazapiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.instanceToken = config.instanceToken;
    this.adminToken = config.adminToken;
  }

  private async request<T = any>(
    method: string,
    path: string,
    body?: any,
    useAdminToken: boolean = false
  ): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (useAdminToken && this.adminToken) {
        headers['admintoken'] = this.adminToken;
      } else if (!useAdminToken && this.instanceToken) {
        headers['token'] = this.instanceToken;
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${path}`, options);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          data,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ==================== ADMINISTRAÇÃO ====================

  async createInstance(name: string, systemName?: string, adminField01?: string, adminField02?: string): Promise<ApiResponse> {
    return this.request('POST', '/instance/init', {
      name,
      systemName: systemName || 'uazapiGO',
      adminField01,
      adminField02,
    }, true);
  }

  async listInstances(): Promise<ApiResponse> {
    return this.request('GET', '/instance/list', undefined, true);
  }

  async updateAdminFields(instanceName: string, adminField01?: string, adminField02?: string): Promise<ApiResponse> {
    return this.request('POST', '/instance/update', {
      instanceName,
      adminField01,
      adminField02,
    }, true);
  }

  async getGlobalWebhook(): Promise<ApiResponse> {
    return this.request('GET', '/webhook/global', undefined, true);
  }

  async configureGlobalWebhook(url: string, events: string[]): Promise<ApiResponse> {
    return this.request('POST', '/webhook/global', {
      url,
      events,
    }, true);
  }

  // ==================== INSTANCIA ====================

  async connectInstance(instanceName: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/connect`);
  }

  async disconnectInstance(instanceName: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/disconnect`);
  }

  async getInstanceStatus(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/status`);
  }

  async updateInstanceName(instanceName: string, newName: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/name`, { newName });
  }

  async deleteInstance(instanceName: string): Promise<ApiResponse> {
    return this.request('DELETE', `/instance/${instanceName}`);
  }

  async getPrivacySettings(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/privacy`);
  }

  async updatePrivacySettings(instanceName: string, settings: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/privacy`, settings);
  }

  async updatePresenceStatus(instanceName: string, status: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/presence`, { status });
  }

  // ==================== PERFIL ====================

  async getProfile(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/profile`);
  }

  async updateProfile(instanceName: string, profile: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/profile`, profile);
  }

  // ==================== CHAMADAS ====================

  async listCalls(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/calls`);
  }

  async rejectCall(instanceName: string, callId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/calls/${callId}/reject`);
  }

  // ==================== WEBHOOKS E SSE ====================

  async getWebhook(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/webhook`);
  }

  async configureWebhook(instanceName: string, url: string, events: string[]): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/webhook`, { url, events });
  }

  async connectSSE(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/sse`);
  }

  // ==================== ENVIAR MENSAGEM ====================

  async sendText(instanceName: string, number: string, message: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/send`, {
      number,
      message,
    });
  }

  async sendImage(instanceName: string, number: string, imageUrl: string, caption?: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/send-image`, {
      number,
      imageUrl,
      caption,
    });
  }

  async sendDocument(instanceName: string, number: string, documentUrl: string, filename?: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/send-document`, {
      number,
      documentUrl,
      filename,
    });
  }

  async sendAudio(instanceName: string, number: string, audioUrl: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/send-audio`, {
      number,
      audioUrl,
    });
  }

  async sendVideo(instanceName: string, number: string, videoUrl: string, caption?: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/send-video`, {
      number,
      videoUrl,
      caption,
    });
  }

  async sendLocation(instanceName: string, number: string, latitude: number, longitude: number, label?: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/send-location`, {
      number,
      latitude,
      longitude,
      label,
    });
  }

  async sendContact(instanceName: string, number: string, contact: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/send-contact`, {
      number,
      contact,
    });
  }

  async sendList(instanceName: string, number: string, list: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/send-list`, {
      number,
      list,
    });
  }

  async sendButtons(instanceName: string, number: string, message: string, buttons: any[]): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/send-buttons`, {
      number,
      message,
      buttons,
    });
  }

  async sendTemplate(instanceName: string, number: string, templateId: string, parameters?: any[]): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/send-template`, {
      number,
      templateId,
      parameters,
    });
  }

  async sendPoll(instanceName: string, number: string, question: string, options: string[]): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/send-poll`, {
      number,
      question,
      options,
    });
  }

  // ==================== AÇÕES NA MENSAGEM E BUSCAR ====================

  async reactToMessage(instanceName: string, messageId: string, emoji: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/${messageId}/react`, { emoji });
  }

  async editMessage(instanceName: string, messageId: string, newMessage: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/${messageId}/edit`, { newMessage });
  }

  async deleteMessage(instanceName: string, messageId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/${messageId}/delete`);
  }

  async forwardMessage(instanceName: string, messageId: string, targetNumber: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/message/${messageId}/forward`, { targetNumber });
  }

  async searchMessages(instanceName: string, query: string, limit?: number): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/message/search?query=${query}&limit=${limit || 50}`);
  }

  async getMessageDetails(instanceName: string, messageId: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/message/${messageId}`);
  }

  // ==================== CHATS ====================

  async listChats(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/chats`);
  }

  async getChat(instanceName: string, chatId: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/chats/${chatId}`);
  }

  async archiveChat(instanceName: string, chatId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/chats/${chatId}/archive`);
  }

  async unarchiveChat(instanceName: string, chatId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/chats/${chatId}/unarchive`);
  }

  async muteChat(instanceName: string, chatId: string, duration?: number): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/chats/${chatId}/mute`, { duration });
  }

  async unmuteChat(instanceName: string, chatId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/chats/${chatId}/unmute`);
  }

  // ==================== CONTATOS ====================

  async listContacts(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/contacts`);
  }

  async getContact(instanceName: string, contactId: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/contacts/${contactId}`);
  }

  async createContact(instanceName: string, contact: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/contacts`, contact);
  }

  async updateContact(instanceName: string, contactId: string, contact: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/contacts/${contactId}`, contact);
  }

  async deleteContact(instanceName: string, contactId: string): Promise<ApiResponse> {
    return this.request('DELETE', `/instance/${instanceName}/contacts/${contactId}`);
  }

  async blockContact(instanceName: string, contactId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/contacts/${contactId}/block`);
  }

  // ==================== BLOQUEIOS ====================

  async listBlockedContacts(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/blocked`);
  }

  async unblockContact(instanceName: string, contactId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/blocked/${contactId}/unblock`);
  }

  // ==================== ETIQUETAS ====================

  async listLabels(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/labels`);
  }

  async createLabel(instanceName: string, label: string, color?: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/labels`, { label, color });
  }

  async addLabelToMessage(instanceName: string, labelId: string, messageId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/labels/${labelId}/add`, { messageId });
  }

  // ==================== GRUPOS E COMUNIDADES ====================

  async listGroups(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/groups`);
  }

  async getGroup(instanceName: string, groupId: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/groups/${groupId}`);
  }

  async createGroup(instanceName: string, subject: string, participants: string[]): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/groups`, { subject, participants });
  }

  async updateGroup(instanceName: string, groupId: string, updates: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/groups/${groupId}`, updates);
  }

  async deleteGroup(instanceName: string, groupId: string): Promise<ApiResponse> {
    return this.request('DELETE', `/instance/${instanceName}/groups/${groupId}`);
  }

  async leaveGroup(instanceName: string, groupId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/groups/${groupId}/leave`);
  }

  async addGroupMember(instanceName: string, groupId: string, number: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/groups/${groupId}/add`, { number });
  }

  async removeGroupMember(instanceName: string, groupId: string, number: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/groups/${groupId}/remove`, { number });
  }

  async promoteGroupMember(instanceName: string, groupId: string, number: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/groups/${groupId}/promote`, { number });
  }

  async demoteGroupMember(instanceName: string, groupId: string, number: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/groups/${groupId}/demote`, { number });
  }

  async listGroupMembers(instanceName: string, groupId: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/groups/${groupId}/members`);
  }

  async getGroupInviteLink(instanceName: string, groupId: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/groups/${groupId}/invite`);
  }

  async revokeGroupInviteLink(instanceName: string, groupId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/groups/${groupId}/invite/revoke`);
  }

  async createCommunity(instanceName: string, subject: string, description?: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/communities`, { subject, description });
  }

  async listCommunities(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/communities`);
  }

  async addSubgroupToCommunity(instanceName: string, communityId: string, groupId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/communities/${communityId}/subgroups`, { groupId });
  }

  async removeSubgroupFromCommunity(instanceName: string, communityId: string, groupId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/communities/${communityId}/subgroups/remove`, { groupId });
  }

  // ==================== RESPOSTAS RÁPIDAS ====================

  async listQuickReplies(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/quick-replies`);
  }

  async createQuickReply(instanceName: string, trigger: string, response: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/quick-replies`, { trigger, response });
  }

  // ==================== CRM ====================

  async listCrmContacts(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/crm/contacts`);
  }

  async createCrmContact(instanceName: string, contact: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/crm/contacts`, contact);
  }

  // ==================== MENSAGEM EM MASSA ====================

  async sendBroadcast(instanceName: string, message: string, recipients: string[]): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/broadcast`, { message, recipients });
  }

  async getBroadcastStatus(instanceName: string, broadcastId: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/broadcast/${broadcastId}`);
  }

  async listBroadcasts(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/broadcast`);
  }

  async cancelBroadcast(instanceName: string, broadcastId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/broadcast/${broadcastId}/cancel`);
  }

  async pauseBroadcast(instanceName: string, broadcastId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/broadcast/${broadcastId}/pause`);
  }

  async resumeBroadcast(instanceName: string, broadcastId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/broadcast/${broadcastId}/resume`);
  }

  async getBroadcastStats(instanceName: string, broadcastId: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/broadcast/${broadcastId}/stats`);
  }

  // ==================== INTEGRAÇÃO CHATWOOT ====================

  async connectChatwoot(instanceName: string, config: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/chatwoot/connect`, config);
  }

  async disconnectChatwoot(instanceName: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/chatwoot/disconnect`);
  }

  // ==================== PROXY ====================

  async enableProxy(instanceName: string, proxyUrl: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/proxy/enable`, { proxyUrl });
  }

  async disableProxy(instanceName: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/proxy/disable`);
  }

  async getProxyStatus(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/proxy/status`);
  }

  // ==================== CHATBOT ====================

  async createChatbot(instanceName: string, config: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/chatbot/create`, config);
  }

  async listChatbots(instanceName: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/chatbot`);
  }

  async getChatbotDetails(instanceName: string, botId: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/chatbot/${botId}`);
  }

  async updateChatbot(instanceName: string, botId: string, updates: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/chatbot/${botId}`, updates);
  }

  async deleteChatbot(instanceName: string, botId: string): Promise<ApiResponse> {
    return this.request('DELETE', `/instance/${instanceName}/chatbot/${botId}`);
  }

  async enableChatbot(instanceName: string, botId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/chatbot/${botId}/enable`);
  }

  async disableChatbot(instanceName: string, botId: string): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/chatbot/${botId}/disable`);
  }

  async trainChatbot(instanceName: string, botId: string, trainingData: any): Promise<ApiResponse> {
    return this.request('POST', `/instance/${instanceName}/chatbot/${botId}/train`, trainingData);
  }

  async getChatbotLogs(instanceName: string, botId: string): Promise<ApiResponse> {
    return this.request('GET', `/instance/${instanceName}/chatbot/${botId}/logs`);
  }

  // ==================== HELPER METHODS ====================

  setInstanceToken(token: string): void {
    this.instanceToken = token;
  }

  setAdminToken(token: string): void {
    this.adminToken = token;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
