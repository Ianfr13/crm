/**
 * Edge Function: Chats
 * Endpoints: 6 (list, get, archive, unarchive, mute, unmute)
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

    // LIST CHATS
    if (method === 'GET' && action === 'list_chats') {
      console.log(`[UazapiChats] Listing chats for instance: ${auth.instanceName}`);
      const result = await auth.uazapi.listChats(auth.instanceName);
      console.log(`[UazapiChats] List chats result:`, JSON.stringify(result));
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET MESSAGES
    if (method === 'POST' && action === 'get_messages') {
      const { chatId, limit } = await req.json();
      console.log(`[UazapiChats] Getting messages for chat: ${chatId}, instance: ${auth.instanceName}`);
      const result = await auth.uazapi.getMessages(auth.instanceName, chatId, limit);
      console.log(`[UazapiChats] Get messages result:`, JSON.stringify(result));
      return successResponse(result, result.success ? 200 : 400);
    }

    // SYNC CHATS
    if (method === 'POST' && action === 'sync_chats') {
      console.log(`[UazapiChats] Syncing chats for instance: ${auth.instanceName}`);
      const result = await auth.uazapi.listChats(auth.instanceName);

      if (result.success && Array.isArray(result.data)) {
        const chats = result.data;
        const supabase = auth.supabase;

        for (const chat of chats) {
          // 1. Upsert Contact
          const phone = chat.id.split('@')[0];
          const name = chat.name || chat.wa_name || chat.wa_contactName || phone;

          const { data: contact, error: contactError } = await supabase
            .from('contacts')
            .upsert({
              name: name,
              phone: phone,
              owner_id: auth.user.id
            }, { onConflict: 'phone' })
            .select()
            .single();

          if (contactError) {
            console.error('Error syncing contact:', contactError);
            continue;
          }

          // 2. Upsert Conversation
          const { error: convError } = await supabase
            .from('conversations')
            .upsert({
              contact_id: contact.id,
              user_id: auth.user.id,
              channel: 'whatsapp',
              status: 'open',
              unread_count: chat.wa_unreadCount || 0,
              last_message_at: chat.wa_lastMsgTimestamp ? new Date(chat.wa_lastMsgTimestamp * 1000).toISOString() : new Date().toISOString(),
              metadata: chat
            }, { onConflict: 'contact_id' }); // Assuming unique constraint on contact_id per user? Or just contact_id.

          if (convError) {
            console.error('Error syncing conversation:', convError);
          }
        }
      }

      return successResponse({ success: true, message: 'Sync started' }, 200);
    }

    // GET CHAT
    if (method === 'GET' && action === 'get_chat') {
      const chat_id = url.searchParams.get('chat_id') || '';
      const result = await auth.uazapi.getChat(auth.instanceName, chat_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // ARCHIVE CHAT
    if (method === 'POST' && action === 'archive_chat') {
      const { chat_id } = await req.json();
      const result = await auth.uazapi.archiveChat(auth.instanceName, chat_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // UNARCHIVE CHAT
    if (method === 'POST' && action === 'unarchive_chat') {
      const { chat_id } = await req.json();
      const result = await auth.uazapi.unarchiveChat(auth.instanceName, chat_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // MUTE CHAT
    if (method === 'POST' && action === 'mute_chat') {
      const { chat_id, duration } = await req.json();
      const result = await auth.uazapi.muteChat(auth.instanceName, chat_id, duration);
      return successResponse(result, result.success ? 200 : 400);
    }

    // UNMUTE CHAT
    if (method === 'POST' && action === 'unmute_chat') {
      const { chat_id } = await req.json();
      const result = await auth.uazapi.unmuteChat(auth.instanceName, chat_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
