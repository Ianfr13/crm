'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uazapiClient } from '@/lib/api/uazapi-client'
import { ConversationList } from '@/components/features/inbox/conversation-list'
import { ChatArea } from '@/components/features/inbox/chat-area'
import { Loader2 } from 'lucide-react'

function InboxContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    searchParams.get('conversation_id')
  )

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    loadConversations()
    subscribeToConversations()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
    }
  }

  const loadConversations = async () => {
    try {
      setLoading(true)
      const data = await uazapiClient.chats.listChats()
      setConversations(data?.data || [])
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToConversations = () => {
    const subscription = supabase
      .channel('conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        loadConversations()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const handleMarkAsRead = async (conversationId: string) => {
    try {
      // Marcar como lido localmente
      setConversations(
        conversations.map(c =>
          c.id === conversationId ? { ...c, unread_count: 0 } : c
        )
      )
    } catch (error) {
      console.error('Erro ao marcar como lido:', error)
    }
  }

  const handleUpdateStatus = async (conversationId: string, status: string) => {
    try {
      // Atualizar status localmente
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inbox
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie todas as suas conversas em um único lugar
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-96">
          {/* Conversation List */}
          <div className="lg:col-span-1">
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversationId}
              onSelect={setSelectedConversationId}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <ChatArea
                conversation={selectedConversation}
                onStatusChange={handleUpdateStatus}
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
