/**
 * Edge Function: Bloqueios e Etiquetas
 * Endpoints: 5 (list_blocked, unblock, list_labels, create_label, add_label)
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

    // ==================== BLOQUEIOS ====================

    // LIST BLOCKED CONTACTS
    if (method === 'GET' && action === 'list_blocked_contacts') {
      const result = await auth.uazapi.listBlockedContacts(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // UNBLOCK CONTACT
    if (method === 'POST' && action === 'unblock_contact') {
      const { contact_id } = await req.json();
      const result = await auth.uazapi.unblockContact(auth.instanceName, contact_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // ==================== ETIQUETAS ====================

    // LIST LABELS
    if (method === 'GET' && action === 'list_labels') {
      const result = await auth.uazapi.listLabels(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // CREATE LABEL
    if (method === 'POST' && action === 'create_label') {
      const { label, color } = await req.json();
      const result = await auth.uazapi.createLabel(auth.instanceName, label, color);
      return successResponse(result, result.success ? 200 : 400);
    }

    // ADD LABEL TO MESSAGE
    if (method === 'POST' && action === 'add_label_to_message') {
      const { label_id, message_id } = await req.json();
      const result = await auth.uazapi.addLabelToMessage(auth.instanceName, label_id, message_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
