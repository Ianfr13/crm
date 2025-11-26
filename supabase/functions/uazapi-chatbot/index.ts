/**
 * Edge Function: ChatBot
 * Endpoints: 9 (create, list, details, update, delete, enable, disable, train, logs)
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

    // CREATE CHATBOT
    if (method === 'POST' && action === 'create_chatbot') {
      const config = await req.json();
      const result = await auth.uazapi.createChatbot(auth.instanceName, config);
      return successResponse(result, result.success ? 200 : 400);
    }

    // LIST CHATBOTS
    if (method === 'GET' && action === 'list_chatbots') {
      const result = await auth.uazapi.listChatbots(auth.instanceName);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET CHATBOT DETAILS
    if (method === 'GET' && action === 'get_chatbot_details') {
      const bot_id = url.searchParams.get('bot_id') || '';
      const result = await auth.uazapi.getChatbotDetails(auth.instanceName, bot_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // UPDATE CHATBOT
    if (method === 'POST' && action === 'update_chatbot') {
      const { bot_id, ...updates } = await req.json();
      const result = await auth.uazapi.updateChatbot(auth.instanceName, bot_id, updates);
      return successResponse(result, result.success ? 200 : 400);
    }

    // DELETE CHATBOT
    if (method === 'DELETE' && action === 'delete_chatbot') {
      const bot_id = url.searchParams.get('bot_id') || '';
      const result = await auth.uazapi.deleteChatbot(auth.instanceName, bot_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // ENABLE CHATBOT
    if (method === 'POST' && action === 'enable_chatbot') {
      const { bot_id } = await req.json();
      const result = await auth.uazapi.enableChatbot(auth.instanceName, bot_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // DISABLE CHATBOT
    if (method === 'POST' && action === 'disable_chatbot') {
      const { bot_id } = await req.json();
      const result = await auth.uazapi.disableChatbot(auth.instanceName, bot_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    // TRAIN CHATBOT
    if (method === 'POST' && action === 'train_chatbot') {
      const { bot_id, training_data } = await req.json();
      const result = await auth.uazapi.trainChatbot(auth.instanceName, bot_id, training_data);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET CHATBOT LOGS
    if (method === 'GET' && action === 'get_chatbot_logs') {
      const bot_id = url.searchParams.get('bot_id') || '';
      const result = await auth.uazapi.getChatbotLogs(auth.instanceName, bot_id);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
