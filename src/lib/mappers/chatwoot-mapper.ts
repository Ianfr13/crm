import { ChatConversation, ChatMessage, MessageStatus } from '@/types/chat';

// Interfaces do Chatwoot
export interface ChatwootContact {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    thumbnail: string;
}

export interface ChatwootConversation {
    id: number;
    inbox_id: number;
    status: 'open' | 'resolved' | 'pending' | 'snoozed';
    unread_count: number;
    contact: ChatwootContact;
    last_non_activity_message: {
        id: number;
        content: string;
        created_at: number;
        message_type: number; // 0 incoming, 1 outgoing, 2 activity
        status?: string;
    } | null;
    timestamp: number;
    additional_attributes?: any;
    channel?: string; // Custom mapping if available
}

export interface ChatwootMessage {
    id: number;
    content: string;
    message_type: number; // 0: incoming, 1: outgoing, 2: activity
    created_at: number;
    status: string; // sent, delivered, read, failed
    sender?: {
        id: number;
        name: string;
        thumbnail?: string;
    };
    conversation_id: number;
    attachments?: any[];
}

export function mapChatwootConversationToLocal(cw: ChatwootConversation): ChatConversation {
    // Timestamp geralmente vem em segundos no Chatwoot API
    const lastMsg = cw.last_non_activity_message;
    const timestamp = lastMsg ? lastMsg.created_at * 1000 : cw.timestamp * 1000;
    
    let channelName = 'whatsapp';
    // Tentar inferir canal se disponível nos atributos
    // Mas por padrão assumimos whatsapp ou generic
    
    return {
        id: String(cw.id),
        name: cw.contact.name || cw.contact.phone_number || cw.contact.email || 'Sem Nome',
        channel: channelName, 
        lastMessageText: lastMsg ? lastMsg.content : '',
        lastMessageStatus: lastMsg ? mapChatwootStatus(lastMsg.status) : 'sent', 
        lastMessageSender: lastMsg?.message_type === 1 ? 'me' : 'other',
        timestamp: timestamp,
        timeLabel: new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        unreadCount: cw.unread_count,
        image: cw.contact.thumbnail,
        isGroup: false, // Chatwoot tickets são individuais por padrão (exceto canais específicos)
        pinned: false,
        muted: false,
        favorite: false,
        online: false, // Chatwoot não expõe presença realtime fácil na lista
        raw: cw
    };
}

export function mapChatwootMessageToLocal(cw: ChatwootMessage): ChatMessage {
    const timestamp = cw.created_at * 1000;
    
    // Chatwoot message_type: 0 (incoming), 1 (outgoing), 2 (activity)
    // Se for 2 (activity), tratamos como sistema/outro ou ignoramos na UI dependendo da lógica
    // Aqui mapeamos para 'other' se não for 1
    
    let sender: 'me' | 'other' = 'other';
    if (cw.message_type === 1) sender = 'me';
    
    return {
        id: String(cw.id),
        chatId: String(cw.conversation_id),
        sender,
        senderName: cw.sender?.name,
        text: cw.content,
        status: mapChatwootStatus(cw.status),
        timestamp,
        timeLabel: new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        type: cw.attachments && cw.attachments.length > 0 ? 'image' : 'text', // Simplificado
        raw: cw
    };
}

function mapChatwootStatus(status?: string): MessageStatus {
    if (!status) return 'sent';
    const s = status.toLowerCase();
    if (s === 'read') return 'read';
    if (s === 'delivered') return 'delivered';
    if (s === 'failed') return 'failed';
    if (s === 'sent') return 'sent';
    return 'sent';
}
