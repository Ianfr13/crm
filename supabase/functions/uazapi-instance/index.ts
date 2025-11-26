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

    if (!auth.instanceName && req.method !== 'POST') {
      return errorResponse('Instance not found. Please create an instance first.', 400);
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const { method } = req;

    console.log(`Instance Function: ${method} ${action} - Instance: ${auth.instanceName}`);

    // CONNECT INSTANCE
    if (method === 'POST' && action === 'connect_instance') {
      let phone;
      try {
        const body = await req.json();
        phone = body.phone;
      } catch (e) {
        // Body might be empty or invalid JSON, ignore
      }
      const result = await auth.uazapi.connectInstance(auth.instanceName, phone);
      if (!result.success) return errorResponse(result.error || 'Failed to connect instance', 400);
      return successResponse(result);
    }

    // DISCONNECT INSTANCE
    if (method === 'POST' && action === 'disconnect_instance') {
      const result = await auth.uazapi.disconnectInstance(auth.instanceName);
      if (!result.success) return errorResponse(result.error || 'Failed to disconnect instance', 400);
      return successResponse(result);
    }

    // GET INSTANCE STATUS
    if (method === 'GET' && action === 'get_instance_status') {
      const result = await auth.uazapi.getInstanceStatus(auth.instanceName);
      // Return success even if result.success is false, to let frontend handle the "disconnected" state gracefully
      // or if it's a real error, the frontend client will throw if we return errorResponse.
      // For status check, a 400 might be too harsh if it's just "not connected".
      // But let's stick to returning the result object.
      return successResponse(result);
    }

    // UPDATE INSTANCE NAME
    if (method === 'POST' && action === 'update_instance_name') {
      const { name } = await req.json();
      const result = await auth.uazapi.updateInstanceName(auth.instanceName, name);
      if (!result.success) return errorResponse(result.error || 'Failed to update instance name', 400);
      return successResponse(result);
    }

    // DELETE INSTANCE
    if (method === 'DELETE' && action === 'delete_instance') {
      const result = await auth.uazapi.deleteInstance(auth.instanceName);
      if (!result.success) return errorResponse(result.error || 'Failed to delete instance', 400);
      return successResponse(result);
    }

    // GET PRIVACY SETTINGS
    if (method === 'GET' && action === 'get_privacy_settings') {
      const result = await auth.uazapi.getPrivacySettings(auth.instanceName);
      if (!result.success) return errorResponse(result.error || 'Failed to get privacy settings', 400);
      return successResponse(result);
    }

    // UPDATE PRIVACY SETTINGS
    if (method === 'POST' && action === 'update_privacy_settings') {
      const settings = await req.json();
      const result = await auth.uazapi.updatePrivacySettings(auth.instanceName, settings);
      if (!result.success) return errorResponse(result.error || 'Failed to update privacy settings', 400);
      return successResponse(result);
    }

    // UPDATE PRESENCE STATUS
    if (method === 'POST' && action === 'update_presence_status') {
      const { status } = await req.json();
      const result = await auth.uazapi.updatePresenceStatus(auth.instanceName, status);
      if (!result.success) return errorResponse(result.error || 'Failed to update presence status', 400);
      return successResponse(result);
    }

    // UPDATE CHATBOT SETTINGS
    if (method === 'POST' && action === 'update_chatbot_settings') {
      const settings = await req.json();
      const result = await auth.uazapi.updateChatbotSettings(auth.instanceName, settings);
      if (!result.success) return errorResponse(result.error || 'Failed to update chatbot settings', 400);
      return successResponse(result);
    }

    // UPDATE FIELDS MAP
    if (method === 'POST' && action === 'update_fields_map') {
      const fields = await req.json();
      const result = await auth.uazapi.updateFieldsMap(auth.instanceName, fields);
      if (!result.success) return errorResponse(result.error || 'Failed to update fields map', 400);
      return successResponse(result);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
