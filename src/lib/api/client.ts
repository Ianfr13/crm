import { createClient } from '@/lib/supabase/client'

/**
 * Cliente centralizado para chamar as Edge Functions
 * Todas as operações de dados passam por aqui
 */

const supabase = createClient()

export const apiClient = {
  /**
   * CONTACTS - Gerenciamento de contatos
   */
  async getContacts() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('contacts', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    if (response.error) throw response.error
    return response.data
  },

  async createContact(contact: { name: string; email?: string; phone?: string; tags?: string[] }) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: contact,
    })

    if (response.error) throw response.error
    return response.data
  },

  async updateContact(id: string, updates: any) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('contacts', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { id, ...updates },
    })

    if (response.error) throw response.error
    return response.data
  },

  async deleteContact(id: string) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('contacts', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { id },
    })

    if (response.error) throw response.error
    return response.data
  },

  /**
   * CONVERSATIONS - Gerenciamento de conversas
   */
  async getConversations() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('conversations', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    if (response.error) throw response.error
    return response.data
  },

  async getConversation(id: string) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('conversations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { id },
    })

    if (response.error) throw response.error
    return response.data
  },

  async updateConversation(id: string, updates: any) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('conversations', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { id, ...updates },
    })

    if (response.error) throw response.error
    return response.data
  },

  /**
   * MESSAGES - Gerenciamento de mensagens
   */
  async getMessages(conversationId: string) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { conversation_id: conversationId },
    })

    if (response.error) throw response.error
    return response.data
  },

  async sendMessage(conversationId: string, content: string, mediaUrl?: string) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: {
        conversation_id: conversationId,
        content,
        media_url: mediaUrl,
      },
    })

    if (response.error) throw response.error
    return response.data
  },

  /**
   * UAZAPI INTEGRATION - Gerenciamento de integração WhatsApp
   */
  async createUazapiInstance(instanceName?: string) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('uazapi-integration', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { action: 'create_instance', instance_name: instanceName },
    })

    if (response.error) throw response.error
    return response.data
  },

  async getUazapiInstanceStatus() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('uazapi-integration', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { action: 'get_instance_status' },
    })

    if (response.error) throw response.error
    return response.data
  },

  async getUazapiQRCode() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('uazapi-integration', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { action: 'get_instance_status' },
    })

    if (response.error) throw response.error
    return response.data?.qr_code
  },

  async disconnectUazapiInstance() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')

    const response = await supabase.functions.invoke('uazapi-integration', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { action: 'disconnect_instance' },
    })

    if (response.error) throw response.error
    return response.data
  },
}
