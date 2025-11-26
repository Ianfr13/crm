/**
 * Edge Function: Integração Chatwoot
 * Endpoints: 2 (connect, disconnect)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getAuthContext, corsHeaders, errorResponse, successResponse, corsResponse } from "./shared-utils.ts";

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

    // CONNECT CHATWOOT
    if (method === 'POST' && action === 'connect_chatwoot') {
      const config = await req.json();
      const result = await auth.uazapi.connectChatwoot(auth.instanceName, config);
      return successResponse(result, result.success ? 200 : 400);
    }

    // DISCONNECT CHATWOOT
    if (method === 'POST' && action === 'disconnect_chatwoot') {
      const result = await auth.uazapi.disconnectChatwoot(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
