/**
 * Edge Function: Instância
 * Endpoints: 8 (connect, disconnect, status, update_name, delete, privacy, presence)
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

    // CONNECT INSTANCE
    if (method === 'POST' && action === 'connect_instance') {
      const result = await auth.uazapi.connectInstance(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // DISCONNECT INSTANCE
    if (method === 'POST' && action === 'disconnect_instance') {
      const result = await auth.uazapi.disconnectInstance(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET INSTANCE STATUS
    if (method === 'GET' && action === 'get_instance_status') {
      const result = await auth.uazapi.getInstanceStatus(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // UPDATE INSTANCE NAME
    if (method === 'POST' && action === 'update_instance_name') {
      const { new_name } = await req.json();
      const result = await auth.uazapi.updateInstanceName(auth.instanceName, new_name);
      return successResponse(result, result.success ? 200 : 400);
    }

    // DELETE INSTANCE
    if (method === 'DELETE' && action === 'delete_instance') {
      const result = await auth.uazapi.deleteInstance(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET PRIVACY SETTINGS
    if (method === 'GET' && action === 'get_privacy_settings') {
      const result = await auth.uazapi.getPrivacySettings(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // UPDATE PRIVACY SETTINGS
    if (method === 'POST' && action === 'update_privacy_settings') {
      const settings = await req.json();
      const result = await auth.uazapi.updatePrivacySettings(auth.instanceName, settings);
      return successResponse(result, result.success ? 200 : 400);
    }

    // UPDATE PRESENCE STATUS
    if (method === 'POST' && action === 'update_presence_status') {
      const { status } = await req.json();
      const result = await auth.uazapi.updatePresenceStatus(auth.instanceName, status);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
