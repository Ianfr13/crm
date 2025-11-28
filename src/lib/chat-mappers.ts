import { ChatConversation, ChatMessage, MessageStatus } from '@/types/chat'

export const normalizeTimestamp = (ts: any): number => {
  if (!ts) return 0

  if (ts instanceof Date) return ts.getTime()

  const num = Number(ts)
  if (!isNaN(num) && num > 0) {
    if (num < 100000000000) {
      return num * 1000
    }
    return num
  }

  const date = new Date(ts)
  if (!isNaN(date.getTime())) return date.getTime()

  return 0
}

export function mapUazStatusToInternal(status: any): MessageStatus {
  const s = String(status ?? '').toUpperCase()

  if (['READ', 'SEEN', 'PLAYED', '3', '4'].includes(s)) return 'read'
  if (['DELIVERED', 'RECEIVED', '2'].includes(s)) return 'delivered'
  if (['SENT', '1'].includes(s)) return 'sent'
  if (['FAILED', 'ERROR'].includes(s)) return 'failed'

  return 'pending'
}

export function mapUazChatToConversation(chat: any): ChatConversation {
  const timestamp = normalizeTimestamp(chat?.wa_lastMsgTimestamp || chat?.last_message?.timestamp)

  let lastContent: any = chat?.wa_lastMessageTextVote
  if (!lastContent && chat?.last_message?.content) {
    const c = chat.last_message.content
    if (typeof c === 'string') {
      lastContent = c
    } else if (c && typeof c === 'object') {
      lastContent =
        c.text ||
        c.caption ||
        c.message?.conversation ||
        c.extendedTextMessage?.text ||
        'Conteúdo de mídia'
    }
  } else if (!lastContent && chat?.last_message?.message) {
    const m = chat.last_message.message
    if (m) {
      lastContent =
        m.conversation ||
        m.extendedTextMessage?.text ||
        m.imageMessage?.caption ||
        'Conteúdo de mídia'
    }
  }

  const safeName = String(
    chat?.name ||
      chat?.wa_name ||
      chat?.wa_contactName ||
      chat?.number ||
      (chat?.id ? chat.id.split('@')[0] : 'Desconhecido') ||
      'Desconhecido',
  )

  const lastMsgStatusRaw = chat?.last_message?.status || chat?.wa_lastMessageStatus || 'SENT'
  const lastMsgStatus = mapUazStatusToInternal(lastMsgStatusRaw)
  const lastMsgSender = chat?.last_message?.key?.fromMe || chat?.wa_lastMessageFromMe ? 'me' : 'other'

  return {
    id: chat?.wa_chatid || chat?.id,
    name: safeName,
    lastMessageText: typeof lastContent === 'string' ? lastContent : '...',
    lastMessageStatus: lastMsgStatus,
    lastMessageSender: lastMsgSender,
    timestamp,
    timeLabel: timestamp
      ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '',
    unreadCount: chat?.wa_unreadCount || chat?.unread_count || 0,
    pinned: chat?.pinned ?? false,
    muted: chat?.muted ?? false,
    favorite: chat?.favorite ?? false,
    online: true,
    channel: 'whatsapp',
    image: chat?.imagePreview || chat?.image || null,
    isGroup: typeof (chat?.wa_chatid || chat?.id) === 'string'
      ? String(chat.wa_chatid || chat.id).endsWith('@g.us')
      : false,
    raw: chat,
  }
}

export function mapUazMessageToChatMessage(m: any, chatId: string): ChatMessage {
  let content: any = m?.text

  if (!content) {
    if (m?.content && typeof m.content === 'object') {
      content =
        m.content.text ||
        m.content.caption ||
        (typeof m.content.message === 'string' ? m.content.message : '')
    }

    if (!content && typeof m?.content === 'string') {
      content = m.content
    } else if (!content && m?.body) {
      content = m.body
    } else if (!content && m?.message) {
      if (m.message.conversation) content = m.message.conversation
      else if (m.message.extendedTextMessage?.text) content = m.message.extendedTextMessage.text
      else if (m.message.imageMessage?.caption) content = m.message.imageMessage.caption
      else if (m.message.documentMessage?.caption) content = m.message.documentMessage.caption
      else if (m.message.videoMessage?.caption) content = m.message.videoMessage.caption
    }
  }

  if (!content) {
    const type = m?.messageType || m?.type
    if (typeof type === 'string') {
      if (type === 'ImageMessage' || type === 'image') content = '📷 Imagem'
      else if (type === 'AudioMessage' || type === 'audio') content = '🎤 Áudio'
      else if (type === 'VideoMessage' || type === 'video') content = '🎥 Vídeo'
      else if (type === 'DocumentMessage' || type === 'document') content = '📄 Documento'
      else if (type === 'StickerMessage' || type === 'sticker') content = '👾 Figurinha'
      else if (type === 'ContactMessage') content = '👤 Contato'
      else if (type === 'LocationMessage') content = '📍 Localização'
      else content = 'Mensagem'
    } else {
      content = 'Mensagem'
    }
  }

  let finalContent = String(content || '')
  if (content && typeof content === 'object') {
    finalContent = (content as any).text || (content as any).caption || 'Conteúdo de mídia'
  }

  const timestamp = normalizeTimestamp(m?.messageTimestamp || m?.timestamp)

  return {
    id: m?.id || m?.key?.id || String(timestamp || Date.now()),
    chatId,
    sender: m?.fromMe || m?.key?.fromMe ? 'me' : 'other',
    senderId: m?.participant || m?.key?.participant || m?.key?.remoteJid || '',
    senderName: m?.pushName || m?.notifyName || m?.verifiedName || null,
    text: String(finalContent),
    type: m?.messageType || m?.type,
    status: m?.status != null ? mapUazStatusToInternal(m.status) : undefined,
    timestamp,
    timeLabel: timestamp
      ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '',
    raw: m,
  }
}
