export interface UazapiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    details?: any;
}

// Admin
export interface CreateInstanceParams {
    instance_name?: string;
    system_name?: string;
    admin_field_01?: string;
    admin_field_02?: string;
}

// Instance
export interface ConnectInstanceResponse {
    qrcode?: string;
    code?: string;
}

export interface InstanceStatusResponse {
    status: string;
    qrcode?: string;
}

// Messages
export interface SendTextParams {
    number: string;
    message: string;
}

export interface SendMediaParams {
    number: string;
    url: string; // image_url, audio_url, etc.
    caption?: string; // for image/video
    filename?: string; // for document
    mediaType: 'image' | 'audio' | 'video' | 'document';
}

// Chats
export interface Chat {
    id: string;
    name: string;
    image?: string;
    last_message?: any;
    unread_count?: number;
}

// Contacts
export interface Contact {
    id: string;
    name: string;
    number: string;
    profile_picture?: string;
}
