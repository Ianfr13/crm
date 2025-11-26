export type Contact = {
    id: string
    created_at: string
    name: string
    email: string | null
    phone: string | null
    tags: string[] | null
    pipeline_stage: string | null
    owner_id: string | null
    metadata: Record<string, any> | null
}

export type Conversation = {
    id: string
    created_at: string
    contact_id: string
    channel: 'whatsapp' | 'facebook' | 'instagram' | 'email' | 'chat'
    status: 'open' | 'closed' | 'snoozed'
    assigned_to: string | null
    last_message_at: string
    unread_count: number
    contact?: Contact
}

export type Message = {
    id: string
    created_at: string
    conversation_id: string
    sender_type: 'user' | 'contact' | 'agent' | 'system'
    sender_id: string | null
    content: string | null
    attachments: any[] | null
    read_at: string | null
}
