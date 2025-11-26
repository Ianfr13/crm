/**
 * Edge Function: Respostas Rápidas e CRM
 * Endpoints: 4 (list_quick_replies, create_quick_reply, list_crm_contacts, create_crm_contact)
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

    // ==================== RESPOSTAS RÁPIDAS ====================

    // LIST QUICK REPLIES
    if (method === 'GET' && action === 'list_quick_replies') {
      const result = await auth.uazapi.listQuickReplies(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // CREATE QUICK REPLY
    if (method === 'POST' && action === 'create_quick_reply') {
      const { trigger, response } = await req.json();
      const result = await auth.uazapi.createQuickReply(auth.instanceName, trigger, response);
      return successResponse(result, result.success ? 200 : 400);
    }

    // ==================== CRM ====================

    // LIST CRM CONTACTS
    if (method === 'GET' && action === 'list_crm_contacts') {
      const result = await auth.uazapi.listCrmContacts(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // CREATE CRM CONTACT
    if (method === 'POST' && action === 'create_crm_contact') {
      const contact = await req.json();
      const result = await auth.uazapi.createCrmContact(auth.instanceName, contact);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
