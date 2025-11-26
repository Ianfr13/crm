/**
 * Edge Function: Ações na Mensagem e Buscar
 * Endpoints: 6 (react, edit, delete, forward, search, details)
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

    // REACT TO MESSAGE
    if (method === 'POST' && action === 'react_to_message') {
      const { message_id, emoji } = await req.json();
      const result = await auth.uazapi.reactToMessage(auth.instanceName, message_id, emoji);
      return successResponse(result, result.success ? 200 : 400);
    }

    // EDIT MESSAGE
    if (method === 'POST' && action === 'edit_message') {
      const { message_id, new_message } = await req.json();
      const result = await auth.uazapi.editMessage(auth.instanceName, message_id, new_message);
      return successResponse(result, result.success ? 200 : 400);
    }

    // DELETE MESSAGE
    if (method === 'POST' && action === 'delete_message') {
      const { message_id } = await req.json();
      const result = await auth.uazapi.deleteMessage(auth.instanceName, message_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // FORWARD MESSAGE
    if (method === 'POST' && action === 'forward_message') {
      const { message_id, target_number } = await req.json();
      const result = await auth.uazapi.forwardMessage(auth.instanceName, message_id, target_number);
      return successResponse(result, result.success ? 200 : 400);
    }

    // SEARCH MESSAGES
    if (method === 'GET' && action === 'search_messages') {
      const query = url.searchParams.get('query') || '';
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const result = await auth.uazapi.searchMessages(auth.instanceName, query, limit);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET MESSAGE DETAILS
    if (method === 'GET' && action === 'get_message_details') {
      const message_id = url.searchParams.get('message_id') || '';
      const result = await auth.uazapi.getMessageDetails(auth.instanceName, message_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
