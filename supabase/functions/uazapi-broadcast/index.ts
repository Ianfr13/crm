/**
 * Edge Function: Mensagem em Massa (Broadcast)
 * Endpoints: 7 (send, status, list, cancel, pause, resume, stats)
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

    // SEND BROADCAST
    if (method === 'POST' && action === 'send_broadcast') {
      const { message, recipients } = await req.json();
      const result = await auth.uazapi.sendBroadcast(auth.instanceName, message, recipients);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET BROADCAST STATUS
    if (method === 'GET' && action === 'get_broadcast_status') {
      const broadcast_id = url.searchParams.get('broadcast_id') || '';
      const result = await auth.uazapi.getBroadcastStatus(auth.instanceName, broadcast_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // LIST BROADCASTS
    if (method === 'GET' && action === 'list_broadcasts') {
      const result = await auth.uazapi.listBroadcasts(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // CANCEL BROADCAST
    if (method === 'POST' && action === 'cancel_broadcast') {
      const { broadcast_id } = await req.json();
      const result = await auth.uazapi.cancelBroadcast(auth.instanceName, broadcast_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // PAUSE BROADCAST
    if (method === 'POST' && action === 'pause_broadcast') {
      const { broadcast_id } = await req.json();
      const result = await auth.uazapi.pauseBroadcast(auth.instanceName, broadcast_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // RESUME BROADCAST
    if (method === 'POST' && action === 'resume_broadcast') {
      const { broadcast_id } = await req.json();
      const result = await auth.uazapi.resumeBroadcast(auth.instanceName, broadcast_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET BROADCAST STATS
    if (method === 'GET' && action === 'get_broadcast_stats') {
      const broadcast_id = url.searchParams.get('broadcast_id') || '';
      const result = await auth.uazapi.getBroadcastStats(auth.instanceName, broadcast_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
