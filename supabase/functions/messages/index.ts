import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
import { UazapiClient } from "../_shared/uazapi-client.ts"

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { method } = req
        const url = new URL(req.url)
        const conversationId = url.searchParams.get('conversation_id')

        if (method === 'GET') {
            if (!conversationId) {
                return new Response(JSON.stringify({ error: 'Conversation ID is required' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400,
                })
            }

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true })

            if (error) throw error

            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        if (method === 'POST') {
            const body = await req.json()
            const { conversation_id, content, sender_type, sender_id, attachments, media_url } = body

            if (!conversation_id || !content) {
                return new Response(JSON.stringify({ error: 'Conversation ID and Content are required' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400,
                })
            }

            // Get authenticated user
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            if (authError || !user) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 401,
                })
            }

            // Get conversation details to find contact
            const { data: conversation, error: convError } = await supabase
                .from('conversations')
                .select('contact_id, channel')
                .eq('id', conversation_id)
                .single()

            if (convError || !conversation) {
                throw new Error('Conversation not found')
            }

            // Get contact phone number
            const { data: contact, error: contactError } = await supabase
                .from('contacts')
                .select('phone')
                .eq('id', conversation.contact_id)
                .single()

            if (contactError || !contact) {
                throw new Error('Contact not found')
            }

            // Get user's active integration
            const { data: integration, error: integrationError } = await supabase
                .from('integrations')
                .select('provider, base_url, instance_token, admin_token')
                .eq('user_id', user.id)
                .eq('active', true)
                .maybeSingle()

            let externalMessageId = null

            // Send message via integration if available
            if (integration && integration.provider === 'uazapi') {
                console.log('Sending message via uazapi to:', contact.phone)

                const uazapi = new UazapiClient({
                    baseUrl: integration.base_url || 'https://free.uazapi.com',
                    instanceToken: integration.instance_token,
                    adminToken: integration.admin_token,
                })

                let sendResult
                if (media_url) {
                    sendResult = await uazapi.sendMedia({
                        number: contact.phone,
                        mediaUrl: media_url,
                        caption: content,
                    })
                } else {
                    sendResult = await uazapi.sendText({
                        number: contact.phone,
                        text: content,
                    })
                }

                if (!sendResult.success) {
                    console.error('Failed to send via uazapi:', sendResult.error)
                    throw new Error(`Failed to send message: ${sendResult.error}`)
                }

                externalMessageId = sendResult.data?.id || sendResult.data?.key?.id
                console.log('Message sent successfully via uazapi, ID:', externalMessageId)
            } else {
                console.log('No active uazapi integration found, saving message without sending')
            }

            // 1. Insert Message
            const { data: message, error: messageError } = await supabase
                .from('messages')
                .insert({
                    conversation_id,
                    content,
                    sender_type: sender_type || 'user',
                    sender_id,
                    direction: 'outbound',
                    status: externalMessageId ? 'sent' : 'pending',
                    external_id: externalMessageId,
                    attachments: attachments || [],
                    metadata: media_url ? { mediaUrl: media_url } : null,
                })
                .select()
                .single()

            if (messageError) throw messageError

            // 2. Update Conversation (last_message_at)
            await supabase
                .from('conversations')
                .update({ last_message_at: new Date().toISOString() })
                .eq('id', conversation_id)

            return new Response(JSON.stringify(message), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 201,
            })
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 405,
        })

    } catch (error) {
        console.error('Messages function error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
