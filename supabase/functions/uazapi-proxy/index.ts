/**
 * Edge Function: Proxy
 * Endpoints: 3 (enable, disable, status)
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

    // ENABLE PROXY
    if (method === 'POST' && action === 'enable_proxy') {
      const { proxy_url } = await req.json();
      const result = await auth.uazapi.enableProxy(auth.instanceName, proxy_url);
      return successResponse(result, result.success ? 200 : 400);
    }

    // DISABLE PROXY
    if (method === 'POST' && action === 'disable_proxy') {
      const result = await auth.uazapi.disableProxy(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET PROXY STATUS
    if (method === 'GET' && action === 'get_proxy_status') {
      const result = await auth.uazapi.getProxyStatus(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
