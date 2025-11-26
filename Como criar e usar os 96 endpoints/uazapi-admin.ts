/**
 * Edge Function: Administração
 * Endpoints: 5 (create_instance, list_instances, update_admin_fields, get_global_webhook, configure_global_webhook)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, errorResponse, successResponse, corsResponse } from "./shared-utils.ts";
import { UazapiClient } from "./uazapi-client.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return corsResponse();
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization') || ''
          }
        }
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return errorResponse('Unauthorized', 401);
    }

    const base_url = Deno.env.get('UAZAPI_BASE_URL');
    const admin_token = Deno.env.get('UAZAPI_ADMIN_TOKEN');

    if (!base_url || !admin_token) {
      return errorResponse('UAZAPI_BASE_URL and UAZAPI_ADMIN_TOKEN must be configured', 500);
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const { method } = req;

    const uazapi = new UazapiClient({
      baseUrl: base_url,
      adminToken: admin_token
    });

    // CREATE INSTANCE
    if (method === 'POST' && action === 'create_instance') {
      const { instance_name, system_name, admin_field_01, admin_field_02 } = await req.json();
      const name = instance_name || `instance_${Math.random().toString(36).substring(7)}`;
      
      const createResult = await uazapi.createInstance(name, system_name, admin_field_01, admin_field_02);
      if (!createResult.success) {
        return errorResponse(createResult.error || 'Failed to create instance', 400);
      }

      const newInstanceToken = createResult.data.token;
      const newInstanceId = createResult.data.instance?.id;

      const { data: existingIntegration } = await supabase
        .from('integrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (existingIntegration) {
        await supabase.from('integrations').update({
          instance_token: newInstanceToken,
          active: true,
          updated_at: new Date().toISOString(),
          metadata: { instance_id: newInstanceId, instance_name: name }
        }).eq('id', existingIntegration.id);
      } else {
        await supabase.from('integrations').insert({
          user_id: user.id,
          provider: 'uazapi',
          instance_token: newInstanceToken,
          active: true,
          metadata: { instance_id: newInstanceId, instance_name: name }
        });
      }

      return successResponse({
        success: true,
        instance_token: newInstanceToken,
        instance_id: newInstanceId,
        data: createResult.data
      });
    }

    // LIST INSTANCES
    if (method === 'GET' && action === 'list_instances') {
      const result = await uazapi.listInstances();
      return successResponse(result, result.success ? 200 : 400);
    }

    // UPDATE ADMIN FIELDS
    if (method === 'POST' && action === 'update_admin_fields') {
      const { instance_name, admin_field_01, admin_field_02 } = await req.json();
      const result = await uazapi.updateAdminFields(instance_name, admin_field_01, admin_field_02);
      return successResponse(result, result.success ? 200 : 400);
    }

    // GET GLOBAL WEBHOOK
    if (method === 'GET' && action === 'get_global_webhook') {
      const result = await uazapi.getGlobalWebhook();
      return successResponse(result, result.success ? 200 : 400);
    }

    // CONFIGURE GLOBAL WEBHOOK
    if (method === 'POST' && action === 'configure_global_webhook') {
      const { url, events } = await req.json();
      const result = await uazapi.configureGlobalWebhook(url, events);
      return successResponse(result, result.success ? 200 : 400);
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 400);
  }
});
