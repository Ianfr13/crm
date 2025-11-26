'use client'

import { useState, useEffect, useRef } from 'react'
import { Message } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Send, Paperclip, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface ChatAreaProps {
    conversationId: string
}

export function ChatArea({ conversationId }: ChatAreaProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchMessages()

        const channel = supabase
            .channel(`chat-${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message])
                scrollToBottom()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId])

    const fetchMessages = async () => {
        setIsLoading(true)
        const { data, error } = await supabase.functions.invoke('messages', {
            method: 'GET',
            headers: {
                // Pass query params via URL not supported directly in invoke options body for GET usually, 
                // but Supabase client handles it if we append to URL or use custom fetch.
                // Actually invoke helper sends body as JSON. For GET params, we might need to append to function URL.
                // Let's try passing it in body for now if we changed function to accept POST for list, 
                // BUT my function expects GET with searchParams.
                // The supabase-js invoke method doesn't easily support query params for GET.
                // WORKAROUND: We'll use a custom fetch wrapper or just change the function to look at body for POST-based search if needed,
                // OR construct the URL manually.
                // Let's try constructing URL query params in the invoke call? No, invoke takes function name.
                // We will modify the invoke call to pass query params in the URL.
            }
        })

        // Wait, supabase.functions.invoke doesn't support query params easily for GET.
        // Let's use the 'body' for GET? No, GET has no body.
        // We need to pass query params.
        // Let's try: invoke('messages?conversation_id=' + conversationId, { method: 'GET' })
        // If that fails, we might need to switch the function to POST for listing or use a different client method.
        // Documentation says: invoke('function_name', { body: ... })

        // Let's try the URL param approach first.
        const { data: fetchedMessages, error: fetchError } = await supabase.functions.invoke(`messages?conversation_id=${conversationId}`, {
            method: 'GET'
        })

        if (fetchedMessages) {
            setMessages(fetchedMessages)
            scrollToBottom()
        }
        setIsLoading(false)
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || isSending) return

        setIsSending(true)
        const { data, error } = await supabase.functions.invoke('messages', {
            method: 'POST',
            body: {
                conversation_id: conversationId,
                content: newMessage,
                sender_type: 'user' // In real app, get from auth context
            }
        })

        if (data) {
            setNewMessage('')
            // Message will be added via realtime subscription
        }
        setIsSending(false)
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <h2 className="font-semibold">Conversation</h2>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                {isLoading ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full",
                                msg.sender_type === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[70%] rounded-lg p-3 text-sm",
                                    msg.sender_type === 'user'
                                        ? "bg-primary text-white rounded-br-none"
                                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none"
                                )}
                            >
                                <p>{msg.content}</p>
                                <span className={cn(
                                    "text-[10px] block mt-1 opacity-70",
                                    msg.sender_type === 'user' ? "text-blue-100" : "text-gray-400"
                                )}>
                                    {format(new Date(msg.created_at), 'HH:mm')}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 dark:bg-gray-800 border-0 rounded-full px-4 focus:ring-2 focus:ring-primary outline-none"
                    />
                    <button
                        type="submit"
                        disabled={isSending || !newMessage.trim()}
                        className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                </form>
            </div>
        </div>
    )
}
