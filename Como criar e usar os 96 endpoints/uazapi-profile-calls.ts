/**
 * Edge Function: Perfil e Chamadas
 * Endpoints: 4 (get_profile, update_profile, list_calls, reject_call)
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

    // ==================== PERFIL ====================

    // GET PROFILE
    if (method === 'GET' && action === 'get_profile') {
      const result = await auth.uazapi.getProfile(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // UPDATE PROFILE
    if (method === 'POST' && action === 'update_profile') {
      const profile = await req.json();
      const result = await auth.uazapi.updateProfile(auth.instanceName, profile);
      return successResponse(result, result.success ? 200 : 400);
    }

    // ==================== CHAMADAS ====================

    // LIST CALLS
    if (method === 'GET' && action === 'list_calls') {
      const result = await auth.uazapi.listCalls(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // REJECT CALL
    if (method === 'POST' && action === 'reject_call') {
      const { call_id } = await req.json();
      const result = await auth.uazapi.rejectCall(auth.instanceName, call_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
