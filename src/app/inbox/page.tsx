'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uazapiClient } from '@/lib/api/uazapi-client'
import { contactService } from '@/lib/services/contact-service'
import { messageService } from '@/lib/services/message-service'
import { ConversationList } from '@/components/features/inbox/conversation-list'
import { ChatArea } from '@/components/features/inbox/chat-area'
import { Loader2 } from 'lucide-react'
import { ConnectInstance } from '@/components/features/inbox/connect-instance'
import { CreateGroupDialog } from '@/components/features/inbox/create-group-dialog'
import { NewChatDialog } from '@/components/features/inbox/new-chat-dialog'

function InboxContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [instanceStatus, setInstanceStatus] = useState<string>('checking')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    searchParams.get('conversation_id')
  )
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)

  useEffect(() => {
    checkAuth()
    checkInstanceStatus()
  }, [])

  useEffect(() => {
    if (instanceStatus === 'open') {
      loadConversations()
    }
  }, [instanceStatus])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
    }
  }

  const checkInstanceStatus = async () => {
    try {
      const res = await uazapiClient.instance.getInstanceStatus()
      if (res.success) {
        const statusData = res.data.status || res.data.instance?.status || (res.data.connected ? 'open' : 'closed')
        const statusString = typeof statusData === 'object' ? (statusData.status || 'unknown') : statusData
        setInstanceStatus(statusString === 'connected' ? 'open' : statusString)
      } else {
        setInstanceStatus('unknown')
      }
    } catch (error) {
      console.error('Error checking instance status:', error)
      setInstanceStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const loadConversations = async () => {
    try {
      setLoading(true)
      const res = await uazapiClient.chats.listChats()
      
      // Ensure contacts are cached for name resolution
      const contactsCache = await contactService.getContacts()

      let chatsData = []
      if (res.success) {
        if (Array.isArray(res.data)) {
          chatsData = res.data
        } else if (res.data && Array.isArray(res.data.chats)) {
          chatsData = res.data.chats
        }
      }

      if (chatsData.length > 0) {
        const chats = chatsData.map((chat: any) => {
          // Try to find a valid JID (contains @)
          // Priority: wa_chatid > id (if has @) > id
          let jid = chat.wa_chatid || chat.id
          
          // If we still don't have a valid JID structure, try to construct one if we have a phone
          if (jid && !jid.includes('@') && !jid.startsWith('r')) {
             // Assume it's a phone number? Unlikely case but possible fallback
          }

          // Ensure we have a string
          jid = jid || ''

          const phone = jid.includes('@') ? jid.split('@')[0] : jid
          
          // Resolve contact name from cache if missing or same as phone
          let contactName = chat.name || chat.wa_contactName || chat.wa_name || chat.pushName || phone
          let avatarUrl = chat.profilePictureUrl || chat.image || chat.imagePreview || null

          if (contactName === phone || !contactName || contactName === 'Desconhecido') {
             const cachedContact = contactService.getContactByPhone(contactsCache, phone)
             if (cachedContact) {
                contactName = cachedContact.name
                if (!avatarUrl) avatarUrl = cachedContact.profilePicUrl
             }
          }

          // Safely parse timestamp
          let lastMessageAt = new Date(0).toISOString() // Default to epoch if no timestamp
          if (chat.wa_lastMsgTimestamp) {
            const ts = Number(chat.wa_lastMsgTimestamp)
            if (ts > 0) {
                if (ts > 1000000000000) { // Already in ms
                    lastMessageAt = new Date(ts).toISOString()
                } else { // In seconds
                    lastMessageAt = new Date(ts * 1000).toISOString()
                }
            }
          }

          let lastMessageContent = ''
          if (chat.wa_lastMessageTextVote) {
             lastMessageContent = chat.wa_lastMessageTextVote
          } else if (chat.wa_lastMessageType) {
            const typeMap: Record<string, string> = {
                'image': '📷 Imagem',
                'video': '🎥 Vídeo',
                'audio': '🎵 Áudio',
                'document': '📄 Documento',
                'sticker': '👾 Sticker',
                'location': '📍 Localização',
                'contact': '👤 Contato'
            }
            lastMessageContent = typeMap[chat.wa_lastMessageType] || 'Mensagem'
          }

          return {
            id: jid,
            contact: {
              name: contactName,
              phone: phone,
              avatar_url: avatarUrl
            },
            channel: 'whatsapp',
            status: 'open',
            unread_count: chat.wa_unreadCount || 0,
            is_pinned: chat.wa_isPinned || false,
            last_message_at: lastMessageAt,
            last_message_content: lastMessageContent
          }
        })
      // Sort by is_pinned desc, then last_message_at desc
      chats.sort((a: any, b: any) => {
        if (a.is_pinned !== b.is_pinned) {
            return a.is_pinned ? -1 : 1
        }
        return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      })
      setConversations(chats)
      } else {
        setConversations([])
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      setLoading(true)
      await loadConversations()
    } catch (error) {
      console.error('Erro ao sincronizar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (conversationId: string) => {
    try {
      setConversations(
        conversations.map(c =>
          c.id === conversationId ? { ...c, unread_count: 0 } : c
        )
      )
    } catch (error) {
      console.error('Erro ao marcar como lido:', error)
    }
  }

  const [messages, setMessages] = useState<any[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  const loadMessages = async (chatId: string) => {
    try {
      setLoadingMessages(true)

      // Find the conversation to get the phone number
      const conversation = conversations.find(c => c.id === chatId)
      if (!conversation) {
        console.error('Conversation not found:', chatId)
        return
      }

      // Use the chat ID directly as JID
      const jid = chatId

      console.log('Fetching messages for JID:', jid)
      const mappedMessages = await messageService.getMessages(jid)
      
      setMessages(mappedMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }

  const subscribeToMessages = (chatId: string) => {
    const subscription = supabase
      .channel(`messages:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${chatId}`
      }, async (payload) => {
        const newMessageRaw = payload.new
        const newMessage: any = {
          id: newMessageRaw.id || Date.now().toString(),
          content: newMessageRaw.content,
          sender_type: newMessageRaw.sender_type, // Assuming this matches
          created_at: newMessageRaw.created_at || new Date().toISOString(),
          status: 'pending'
        }
        
        // Add to cache immediately
        await messageService.saveMessage(chatId, newMessage)

        setMessages(prev => [...prev, newMessage])
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  // Real-time conversation updates
  useEffect(() => {
    const subscription = supabase
      .channel('conversations_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations'
      }, () => {
        // Reload conversations on any change
        loadConversations()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId)
      const unsubscribe = subscribeToMessages(selectedConversationId)
      return () => {
        unsubscribe()
      }
    } else {
      setMessages([])
    }
  }, [selectedConversationId])

  const handleSendMessage = async (text: string) => {
    if (!selectedConversation) return

    try {
      const contact = selectedConversation.contact
      if (contact?.phone) {
        await uazapiClient.messages.sendText(contact.phone, text)
      }

      const newMessage: any = {
        id: Date.now().toString(),
        content: text,
        sender_type: 'user',
        created_at: new Date().toISOString(),
        status: 'pending'
      }

      setMessages(prev => [...prev, newMessage])
      await messageService.saveMessage(selectedConversation.id, newMessage)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      throw error
    }
  }

  const handleUpdateStatus = async (conversationId: string, status: string) => {
    try {
      setConversations(
        conversations.map(c =>
          c.id === conversationId ? { ...c, status } : c
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const selectedConversation = conversations.find(c => c.id === selectedConversationId)

  if (loading && instanceStatus === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (instanceStatus !== 'open') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-md mx-auto">
          <ConnectInstance onConnected={() => setInstanceStatus('open')} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 h-full flex flex-col">
        {/* Header */}
        <div className="mb-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Inbox
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gerencie suas conversas
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsNewChatOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Nova Conversa
            </button>
            <button
              onClick={() => setIsCreateGroupOpen(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Novo Grupo
            </button>
            <button
              onClick={async () => {
                try {
                  setLoading(true)
                  await uazapiClient.webhooks.configureWebhook(
                    'https://vglhaxrdsvqbwvyywexd.supabase.co/functions/v1/uazapi-webhooks',
                    ['messages', 'messages_update', 'connection']
                  )
                  alert('Webhook configurado com sucesso!')
                } catch (error) {
                  console.error('Erro ao configurar webhook:', error)
                  alert('Erro ao configurar webhook')
                } finally {
                  setLoading(false)
                }
              }}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Configurar Webhook
            </button>
            <button
              onClick={handleSync}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Sincronizar
            </button>
            <button
              onClick={async () => {
                try {
                  setLoading(true)
                  await uazapiClient.instance.disconnectInstance('CRMInstance') // TODO: Get dynamic instance name
                  setInstanceStatus('closed')
                  window.location.reload()
                } catch (error) {
                  console.error('Error disconnecting:', error)
                } finally {
                  setLoading(false)
                }
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Desconectar
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          {/* Conversation List */}
          <div className="lg:col-span-1 h-full min-h-0">
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversationId}
              onSelect={setSelectedConversationId}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 h-full min-h-0">
            {selectedConversation ? (
              <ChatArea
                conversation={selectedConversation}
                messages={messages}
                loading={loadingMessages}
                onStatusChange={handleUpdateStatus}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Selecione uma conversa para começar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateGroupDialog 
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onSuccess={() => {
            // Refresh conversations after group creation
            handleSync()
        }}
      />

      <NewChatDialog 
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onStartChat={(number) => {
            // Format JID
            const jid = `${number}@s.whatsapp.net`
            
            // Check if exists
            const existing = conversations.find(c => c.id === jid)
            if (existing) {
                setSelectedConversationId(existing.id)
            } else {
                // Optimistic create
                const newConv = {
                    id: jid,
                    contact: {
                        name: number,
                        phone: number,
                        avatar_url: null
                    },
                    channel: 'whatsapp',
                    status: 'open',
                    unread_count: 0,
                    last_message_at: new Date().toISOString(),
                    is_pinned: false
                }
                setConversations(prev => [newConv, ...prev])
                setSelectedConversationId(jid)
            }
        }}
      />
    </div>
  )
}

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
      <InboxContent />
    </Suspense>
  )
}
