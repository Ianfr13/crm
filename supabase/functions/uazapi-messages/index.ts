/**
 * Edge Function: Enviar Mensagens
 * Endpoints: 11 (text, image, document, audio, video, location, contact, list, buttons, template, poll)
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

    if (method !== 'POST') {
      return errorResponse('Method not allowed', 405);
    }

    // SEND TEXT
    if (action === 'send_text') {
      const { number, message } = await req.json();
      const result = await auth.uazapi.sendText(auth.instanceName, number, message);
      return successResponse(result, result.success ? 200 : 400);
    }

    // SEND IMAGE
    if (action === 'send_image') {
      const { number, image_url, caption } = await req.json();
      const result = await auth.uazapi.sendImage(auth.instanceName, number, image_url, caption);
      return successResponse(result, result.success ? 200 : 400);
    }

    // SEND DOCUMENT
    if (action === 'send_document') {
      const { number, document_url, filename } = await req.json();
      const result = await auth.uazapi.sendDocument(auth.instanceName, number, document_url, filename);
      return successResponse(result, result.success ? 200 : 400);
    }

    // SEND AUDIO
    if (action === 'send_audio') {
      const { number, audio_url } = await req.json();
      const result = await auth.uazapi.sendAudio(auth.instanceName, number, audio_url);
      return successResponse(result, result.success ? 200 : 400);
    }

    // SEND VIDEO
    if (action === 'send_video') {
      const { number, video_url, caption } = await req.json();
      const result = await auth.uazapi.sendVideo(auth.instanceName, number, video_url, caption);
      return successResponse(result, result.success ? 200 : 400);
    }

    // SEND LOCATION
    if (action === 'send_location') {
      const { number, latitude, longitude, label } = await req.json();
      const result = await auth.uazapi.sendLocation(auth.instanceName, number, latitude, longitude, label);
      return successResponse(result, result.success ? 200 : 400);
    }

    // SEND CONTACT
    if (action === 'send_contact') {
      const { number, contact } = await req.json();
      const result = await auth.uazapi.sendContact(auth.instanceName, number, contact);
      return successResponse(result, result.success ? 200 : 400);
    }

    // SEND LIST
    if (action === 'send_list') {
      const { number, list } = await req.json();
      const result = await auth.uazapi.sendList(auth.instanceName, number, list);
      return successResponse(result, result.success ? 200 : 400);
    }

    // SEND BUTTONS
    if (action === 'send_buttons') {
      const { number, message, buttons } = await req.json();
      const result = await auth.uazapi.sendButtons(auth.instanceName, number, message, buttons);
      return successResponse(result, result.success ? 200 : 400);
    }

    // SEND TEMPLATE
    if (action === 'send_template') {
      const { number, template_id, parameters } = await req.json();
      const result = await auth.uazapi.sendTemplate(auth.instanceName, number, template_id, parameters);
      return successResponse(result, result.success ? 200 : 400);
    }

    // SEND POLL
    if (action === 'send_poll') {
      const { number, question, options } = await req.json();
      const result = await auth.uazapi.sendPoll(auth.instanceName, number, question, options);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
