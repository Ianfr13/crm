'use client'

import { useState, useEffect } from 'react'
import { Conversation, Message } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { InboxSidebar } from './inbox-sidebar'
import { ChatArea } from './chat-area'

export function InboxLayout() {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchConversations()

        // Realtime subscription for new conversations or updates
        const channel = supabase
            .channel('inbox-conversations')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => {
                console.log('Conversation update:', payload)
                fetchConversations() // Refresh list on update
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchConversations = async () => {
        const { data, error } = await supabase.functions.invoke('conversations', {
            method: 'GET'
        })
        if (data) {
            setConversations(data)
        }
    }

    return (
        <div className="flex h-full border-t border-gray-200 dark:border-gray-800">
            <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
                <InboxSidebar
                    conversations={conversations}
                    selectedId={selectedConversationId}
                    onSelect={setSelectedConversationId}
                />
            </div>
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
                {selectedConversationId ? (
                    <ChatArea conversationId={selectedConversationId} />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    )
}
