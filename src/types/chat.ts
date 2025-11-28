export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface ChatConversation {
  id: string
  name: string
  channel: string
  lastMessageText: string
  lastMessageStatus?: MessageStatus | string | number | null
  lastMessageSender?: 'me' | 'other'
  timestamp: number
  timeLabel: string
  unreadCount: number
  pinned?: boolean
  muted?: boolean
  favorite?: boolean
  online?: boolean
  image?: string | null
  isGroup?: boolean
  raw?: any
}

export interface ChatMessage {
  id: string
  chatId: string
  sender: 'me' | 'other'
  senderId?: string
  senderName?: string | null
  text: string
  type?: string
  status?: MessageStatus | string | number | null
  timestamp: number
  timeLabel: string
  raw?: any
}
