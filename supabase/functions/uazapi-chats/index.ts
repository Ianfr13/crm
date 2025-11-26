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
      const result = await auth.uazapi.listChats(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
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
