/**
 * Edge Function: Contatos
 * Endpoints: 6 (list, get, create, update, delete, block)
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

    // LIST CONTACTS
    if (method === 'GET' && action === 'list_contacts') {
      const result = await auth.uazapi.listContacts(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET CONTACT
    if (method === 'GET' && action === 'get_contact') {
      const contact_id = url.searchParams.get('contact_id') || '';
      const result = await auth.uazapi.getContact(auth.instanceName, contact_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // CREATE CONTACT
    if (method === 'POST' && action === 'create_contact') {
      const contact = await req.json();
      const result = await auth.uazapi.createContact(auth.instanceName, contact);
      return successResponse(result, result.success ? 200 : 400);
    }

    // UPDATE CONTACT
    if (method === 'POST' && action === 'update_contact') {
      const { contact_id, ...contact } = await req.json();
      const result = await auth.uazapi.updateContact(auth.instanceName, contact_id, contact);
      return successResponse(result, result.success ? 200 : 400);
    }

    // DELETE CONTACT
    if (method === 'DELETE' && action === 'delete_contact') {
      const contact_id = url.searchParams.get('contact_id') || '';
      const result = await auth.uazapi.deleteContact(auth.instanceName, contact_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // BLOCK CONTACT
    if (method === 'POST' && action === 'block_contact') {
      const { contact_id } = await req.json();
      const result = await auth.uazapi.blockContact(auth.instanceName, contact_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
