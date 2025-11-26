import { uazapiClient } from '@/lib/api/uazapi-client'

export interface Message {
  id: string
  content: string
  sender_type: 'user' | 'contact' | 'system' | 'agent'
  created_at: string
  status?: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  attachments?: any[]
}

const CACHE_PREFIX = 'uazapi_messages_'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

interface CacheData {
  timestamp: number
  data: Message[]
}

export const messageService = {
  async getMessages(chatId: string, forceRefresh = false): Promise<Message[]> {
    const cacheKey = `${CACHE_PREFIX}${chatId}`
    
    // 1. Try Cache
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const { timestamp, data } = JSON.parse(cached) as CacheData
          if (Date.now() - timestamp < CACHE_TTL) {
            console.log('Returning cached messages for', chatId)
            // Trigger async refresh
            this.syncMessages(chatId).then(() => console.log('Background refresh done'))
            return data
          }
        } catch (e) {
          console.error('Error parsing message cache', e)
        }
      }
    }

    // 2. Fetch API
    return this.syncMessages(chatId)
  },

  async syncMessages(chatId: string): Promise<Message[]> {
    try {
      const res = await uazapiClient.chats.getMessages(chatId)
      let rawMessages: any[] = []
      
      if (res.success || Array.isArray(res)) {
         // Handle various response structures
         const data = res.success ? res.data : res
         
         if (Array.isArray(data)) {
            rawMessages = data
         } else if (data && typeof data === 'object') {
            if (Array.isArray(data.messages)) rawMessages = data.messages
            else if (Array.isArray(data.data)) rawMessages = data.data
         }
      }

      const mappedMessages: Message[] = rawMessages.map((msg: any) => {
        const content = msg.text || 
                       msg.message?.conversation || 
                       msg.message?.extendedTextMessage?.text || 
                       msg.message?.imageMessage?.caption || 
                       msg.message?.videoMessage?.caption ||
                       (msg.message?.imageMessage ? '📷 Imagem' : '') ||
                       (msg.message?.videoMessage ? '🎥 Vídeo' : '') ||
                       (msg.message?.audioMessage ? '🎵 Áudio' : '') ||
                       (msg.message?.documentMessage ? '📄 Documento' : '') ||
                       (msg.message?.stickerMessage ? '👾 Sticker' : '') ||
                       (typeof msg.content === 'string' ? msg.content : '') ||
                       ''

        const isFromMe = msg.key?.fromMe ?? msg.fromMe ?? false
        
        let createdAt = new Date().toISOString()
        if (msg.messageTimestamp) {
            const ts = Number(msg.messageTimestamp)
            if (ts.toString().length <= 10) {
                createdAt = new Date(ts * 1000).toISOString()
            } else {
                createdAt = new Date(ts).toISOString()
            }
        }

        return {
          id: msg.key?.id || msg.id || Date.now().toString(),
          content,
          sender_type: isFromMe ? 'user' : 'contact',
          created_at: createdAt,
          status: msg.status || (isFromMe ? 'sent' : 'read') // Default status guess
        }
      })

      // Sort
      mappedMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

      // Save to cache
      localStorage.setItem(`${CACHE_PREFIX}${chatId}`, JSON.stringify({
        timestamp: Date.now(),
        data: mappedMessages
      }))

      return mappedMessages
    } catch (error) {
      console.error('Error syncing messages:', error)
      return []
    }
  },

  async saveMessage(chatId: string, message: Message) {
    const cacheKey = `${CACHE_PREFIX}${chatId}`
    const cached = localStorage.getItem(cacheKey)
    let messages: Message[] = []
    
    if (cached) {
        try {
            const { data } = JSON.parse(cached)
            messages = data
        } catch {}
    }

    messages.push(message)
    
    localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: messages
    }))
  }
}
