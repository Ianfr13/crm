/**
 * Edge Function: Webhooks e SSE
 * Endpoints: 3 (get_webhook, configure_webhook, connect_sse)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getAuthContext, corsHeaders, errorResponse, successResponse, corsResponse } from "../_shared/shared-utils.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return corsResponse();
  }

  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const { method } = req;

    // GET WEBHOOK
    if (method === 'GET' && action === 'get_webhook') {
      const result = await auth.uazapi.getWebhook(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // CONFIGURE WEBHOOK
    if (method === 'POST' && action === 'configure_webhook') {
      const { url: webhookUrl, events } = await req.json();
      const result = await auth.uazapi.configureWebhook(auth.instanceName, webhookUrl, events);
      return successResponse(result, result.success ? 200 : 400);
    }

    // CONNECT SSE
    if (method === 'GET' && action === 'connect_sse') {
      const result = await auth.uazapi.connectSSE(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // HANDLE WEBHOOK EVENTS (No action param or action='webhook')
    if (method === 'POST' && (!action || action === 'webhook')) {
      const payload = await req.json();
      console.log('Webhook received:', JSON.stringify(payload));

      const { type, data } = payload;
      const supabase = auth.supabase;

      if (type === 'message') {
        // Handle new message
        const messageData = data;
        const isFromMe = messageData.fromMe || messageData.key?.fromMe || false;
        const remoteJid = isFromMe ? messageData.to : messageData.from;
        const phone = remoteJid.split('@')[0];
        const content = messageData.text || messageData.content || messageData.message?.conversation || messageData.message?.extendedTextMessage?.text || '';

        // 1. Upsert Contact
        const { data: contact, error: contactError } = await supabase
          .from('contacts')
          .upsert({
            name: messageData.pushName || phone,
            phone: phone,
            owner_id: auth.user.id // This might be tricky if webhook doesn't have user context. 
            // Ideally, the webhook URL should include a user/instance ID or we lookup by instance.
            // For now, assuming single user/instance for simplicity or auth handles it.
          }, { onConflict: 'phone' })
          .select()
          .single();

        if (contactError) {
          console.error('Error upserting contact:', contactError);
        } else {
          // 2. Upsert Conversation
          const { data: conversation, error: convError } = await supabase
            .from('conversations')
            .upsert({
              contact_id: contact.id,
              user_id: auth.user.id,
              channel: 'whatsapp',
              status: 'open',
              last_message_at: new Date(messageData.timestamp * 1000).toISOString(),
              unread_count: isFromMe ? 0 : undefined // Increment if not from me? Need logic.
            }, { onConflict: 'contact_id' })
            .select()
            .single();

          if (convError) {
            console.error('Error upserting conversation:', convError);
          } else {
            // 3. Insert Message
            const { error: msgError } = await supabase
              .from('messages')
              .insert({
                conversation_id: conversation.id,
                content: content,
                sender_type: isFromMe ? 'user' : 'contact',
                created_at: new Date(messageData.timestamp * 1000).toISOString(),
                metadata: messageData
              });

            if (msgError) console.error('Error inserting message:', msgError);
          }
        }
      }

      return successResponse({ received: true }, 200);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
