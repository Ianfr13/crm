'use client'

import { useState } from 'react'
import { Search, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Conversation {
  id: string
  contact?: { name: string; phone?: string; email?: string }
  channel: string
  status: string
  unread_count: number
  last_message_at: string
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
  onMarkAsRead: (id: string) => void
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onMarkAsRead,
}: ConversationListProps) {
  const [search, setSearch] = useState('')
  const [filterChannel, setFilterChannel] = useState<string>('all')

  const filtered = conversations.filter(c => {
    const matchesSearch =
      c.contact?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact?.phone?.includes(search) ||
      c.contact?.email?.toLowerCase().includes(search.toLowerCase())

    const matchesChannel = filterChannel === 'all' || c.channel === filterChannel

    return matchesSearch && matchesChannel
  })

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, string> = {
      whatsapp: '💬',
      facebook: '👍',
      instagram: '📷',
      email: '📧',
      chat: '💭',
    }
    return icons[channel] || '💬'
  }

  const getChannelColor = (channel: string) => {
    const colors: Record<string, string> = {
      whatsapp: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      facebook: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      instagram: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
      email: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
      chat: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    }
    return colors[channel] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }

  const channels = ['all', ...new Set(conversations.map(c => c.channel))]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Channel Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {channels.map(channel => (
            <button
              key={channel}
              onClick={() => setFilterChannel(channel)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterChannel === channel
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {channel === 'all' ? 'Todos' : getChannelIcon(channel)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma conversa encontrada</p>
          </div>
        ) : (
          filtered.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => {
                onSelect(conversation.id)
                if (conversation.unread_count > 0) {
                  onMarkAsRead(conversation.id)
                }
              }}
              className={`w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedId === conversation.id
                  ? 'bg-blue-50 dark:bg-blue-900'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">
                  {getChannelIcon(conversation.channel)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`font-medium truncate ${
                      conversation.unread_count > 0
                        ? 'text-gray-900 dark:text-white font-semibold'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {conversation.contact?.name || 'Contato desconhecido'}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${getChannelColor(conversation.channel)}`}>
                      {conversation.channel}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {conversation.contact?.phone || conversation.contact?.email || 'Sem contato'}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(conversation.last_message_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>

                {conversation.unread_count > 0 && (
                  <div className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
