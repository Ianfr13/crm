import { createClient } from '@/lib/supabase/client'
import { ChatwootConversation, ChatwootMessage } from '@/lib/mappers/chatwoot-mapper'

const supabase = createClient()

/**
 * Cliente para comunicar com o Chatwoot via Supabase Edge Function (Gateway)
 * Isso evita expor o Token de Admin do Chatwoot no Client Side
 */
async function invokeChatwoot(action: string, body: any = {}, method: 'POST' | 'GET' = 'POST') {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Não autenticado')

  // Nome da função proxy
  let url = `chatwoot-gateway?action=${action}`
  
  // Se for GET, converte body em query params
  if (method === 'GET') {
      // Remove undefined/null
      const cleanBody = Object.entries(body).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) acc[key] = String(value);
          return acc;
      }, {} as Record<string, string>);
      
      const params = new URLSearchParams(cleanBody).toString()
      if (params) url += `&${params}`
  }

  const response = await supabase.functions.invoke(url, {
    method,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: method !== 'GET' ? body : undefined,
  })

  if (response.error) {
    const msg = response.error.message || response.error.toString();
    console.error(`Chatwoot Gateway Error (${action}):`, msg);
    throw new Error(msg)
  }
  
  return response.data
}

export const chatwootClient = {
    async getConversations(status: string = 'open'): Promise<ChatwootConversation[]> {
        return invokeChatwoot('list_conversations', { status }, 'GET')
    },
    
    async getMessages(conversationId: string | number): Promise<ChatwootMessage[]> {
        return invokeChatwoot('list_messages', { conversation_id: conversationId }, 'GET')
    },
    
    async sendMessage(conversationId: string | number, content: string): Promise<ChatwootMessage> {
        return invokeChatwoot('send_message', { conversation_id: conversationId, content })
    },
    
    // Usado para pegar o pubsub_token para conectar no WebSocket
    async getWebsocketConfig(): Promise<{ pubsub_token: string, account_id: number }> {
        return invokeChatwoot('get_websocket_config', {}, 'GET')
    }
}
