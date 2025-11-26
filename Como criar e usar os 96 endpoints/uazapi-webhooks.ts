/**
 * Edge Function: Webhooks e SSE
 * Endpoints: 3 (get_webhook, configure_webhook, connect_sse)
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

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
