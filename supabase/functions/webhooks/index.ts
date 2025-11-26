import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

// uazapi webhook payload interfaces
interface UazapiMessage {
    event: string
    instance: string
    data: {
        key: {
            remoteJid: string
            fromMe: boolean
            id: string
        }
        pushName?: string
        message?: {
            conversation?: string
            extendedTextMessage?: {
                text: string
            }
            imageMessage?: {
                url: string
                caption?: string
            }
            videoMessage?: {
                url: string
                caption?: string
            }
            documentMessage?: {
                url: string
                fileName?: string
                caption?: string
            }
        }
        messageTimestamp: number
    }
}

serve(async (req) => {
    const { method } = req
    const url = new URL(req.url)
    const provider = url.searchParams.get('provider') // 'meta', 'evolution', or 'uazapi'

    // Handle CORS
    if (method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use Service Role for webhooks to bypass RLS
        )

        // Meta (Facebook/Instagram) Verification
        if (provider === 'meta' && method === 'GET') {
            const mode = url.searchParams.get('hub.mode')
            const token = url.searchParams.get('hub.verify_token')
            const challenge = url.searchParams.get('hub.challenge')

            if (mode === 'subscribe' && token === Deno.env.get('META_VERIFY_TOKEN')) {
                return new Response(challenge, { status: 200 })
            }
            return new Response('Forbidden', { status: 403 })
        }

        // Handle Incoming Events (POST)
        if (method === 'POST') {
            const body = await req.json()
            console.log(`Received webhook from ${provider}:`, JSON.stringify(body, null, 2))

            if (provider === 'meta') {
                // Handle Meta Payload
                // ... logic to extract message and insert into 'messages' table
            } else if (provider === 'evolution') {
                // Handle Evolution Payload (mantém compatibilidade durante migração)
                // ... logic to extract message and insert into 'messages' table
            } else if (provider === 'uazapi') {
                // Handle uazapi Payload
                await handleUazapiWebhook(supabase, body)
            }

            return new Response(JSON.stringify({ received: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        return new Response('Method not allowed', { status: 405 })

    } catch (error) {
        console.error('Webhook Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

/**
 * Process uazapi webhook events
 */
async function handleUazapiWebhook(supabase: any, payload: UazapiMessage) {
    const { event, instance, data } = payload

    console.log(`Processing uazapi event: ${event}`)

    if (event === 'messages' || event === 'messages_update') {
        // Extract message information
        const phoneNumber = data.key.remoteJid.replace('@s.whatsapp.net', '')
        const fromMe = data.key.fromMe
        const messageId = data.key.id
        const timestamp = new Date(data.messageTimestamp * 1000)

        // Extract message text
        let messageText = ''
        let mediaUrl = ''
        let mediaType = ''

        if (data.message?.conversation) {
            messageText = data.message.conversation
        } else if (data.message?.extendedTextMessage?.text) {
            messageText = data.message.extendedTextMessage.text
        } else if (data.message?.imageMessage) {
            mediaUrl = data.message.imageMessage.url || ''
            messageText = data.message.imageMessage.caption || ''
            mediaType = 'image'
        } else if (data.message?.videoMessage) {
            mediaUrl = data.message.videoMessage.url || ''
            messageText = data.message.videoMessage.caption || ''
            mediaType = 'video'
        } else if (data.message?.documentMessage) {
            mediaUrl = data.message.documentMessage.url || ''
            messageText = data.message.documentMessage.caption || data.message.documentMessage.fileName || ''
            mediaType = 'document'
        }

        console.log(`Message from ${phoneNumber}: ${messageText}`)

        // Skip if message is from us (fromMe) to avoid duplicates
        if (fromMe) {
            console.log('Skipping message from ourselves')
            return
        }

        // 1. Find or create contact
        let { data: contact, error: contactError } = await supabase
            .from('contacts')
            .select('id')
            .eq('phone', phoneNumber)
            .maybeSingle()

        if (!contact) {
            console.log(`Creating new contact: ${phoneNumber}`)
            const { data: newContact, error: createError } = await supabase
                .from('contacts')
                .insert({
                    phone: phoneNumber,
                    name: data.pushName || phoneNumber,
                    source: 'whatsapp',
                })
                .select()
                .single()

            if (createError) {
                console.error('Error creating contact:', createError)
                throw createError
            }

            contact = newContact
        }

        // 2. Find or create conversation
        let { data: conversation, error: conversationError } = await supabase
            .from('conversations')
            .select('id')
            .eq('contact_id', contact.id)
            .eq('channel', 'whatsapp')
            .maybeSingle()

        if (!conversation) {
            console.log(`Creating new conversation for contact ${contact.id}`)
            const { data: newConversation, error: createConvError } = await supabase
                .from('conversations')
                .insert({
                    contact_id: contact.id,
                    channel: 'whatsapp',
                    status: 'active',
                })
                .select()
                .single()

            if (createConvError) {
                console.error('Error creating conversation:', createConvError)
                throw createConvError
            }

            conversation = newConversation
        }

        // 3. Insert message
        console.log(`Inserting message into conversation ${conversation.id}`)
        const { error: messageError } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversation.id,
                content: messageText,
                direction: 'inbound',
                status: 'delivered',
                external_id: messageId,
                timestamp: timestamp.toISOString(),
                metadata: mediaUrl ? { mediaUrl, mediaType } : null,
            })

        if (messageError) {
            console.error('Error inserting message:', messageError)
            throw messageError
        }

        console.log('Message processed successfully')
    } else if (event === 'connection') {
        console.log(`Connection event for instance ${instance}:`, data)
        // Handle connection status updates if needed
    } else {
        console.log(`Unhandled event type: ${event}`)
    }
}
