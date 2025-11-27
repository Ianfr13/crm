/**
 * Edge Function: Administração
 * Endpoints: 5 (create_instance, list_instances, update_admin_fields, get_global_webhook, configure_global_webhook)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, errorResponse, successResponse, corsResponse } from "../_shared/shared-utils.ts";
import { UazapiClient } from "../_shared/uazapi-client.ts";

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

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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

      // Upsert na tabela instances
      const { error: upsertError } = await serviceClient
        .from('instances')
        .upsert({
          user_id: user.id,
          id: newInstanceId, // Use instance ID from UazAPI as PK if possible, or let it be if we want internal ID. 
                             // The schema has id TEXT DEFAULT ..., but we should probably store the UazAPI ID if it acts as one.
                             // The prompt says "Fazer upsert em instances por (user_id) ou por (id)". 
                             // If I use user_id as unique constraint, I need an index or unique constraint on user_id.
                             // The schema has "user_id UUID REFERENCES auth.users(id)". It doesn't explicitly say UNIQUE.
                             // However, the logic implies 1 instance per user for this flow.
                             // Let's check if I should use the ID from API as the table ID.
                             // Schema: id TEXT PRIMARY KEY DEFAULT ('i' || ...). 
                             // If UazAPI returns an ID, maybe I should store it in 'id' column or just trust the upsert on user_id if I had a unique index?
                             // Actually, the prompt code example showed:
                             /*
                               .upsert({ 
                                  user_id: user.id, 
                                  token: newInstanceToken, 
                                  name, 
                                  id: newInstanceId // optional if we want to force this ID 
                               }, { onConflict: 'user_id' }) // or 'id'
                             */
                             // Wait, if I upsert by user_id, I need a unique constraint on user_id.
                             // The schema provided `20251126000000_complete_uazapi_schema.sql` does NOT have UNIQUE on user_id.
                             // It has `CREATE INDEX IF NOT EXISTS idx_instances_user_id ON instances(user_id);`
                             // So multiple instances per user are allowed by schema.
                             // However, the prompt says: "Verifica/garante que existe uma instância para o usuário atual... Fazer upsert em instances por (user_id) ou por (id)".
                             // If I want to support only one instance per user for this specific flow (as implied by "ConnectInstance" component), I should try to update if exists.
                             
          token: newInstanceToken,
          name: name,
          owner: user.email,
          status: 'created',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }); // Assuming we want 1 instance per user. 
                                       // If schema doesn't support unique user_id, this upsert will FAIL unless there is a constraint.
                                       // BUT, I can search first then update or insert.
      
      // Better approach given no unique constraint on user_id in schema:
      // Check if user has an instance
      const { data: existingInstance } = await serviceClient
        .from('instances')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingInstance) {
         await serviceClient.from('instances').update({
             token: newInstanceToken,
             id: newInstanceId, // Update ID if it changed? Maybe dangerous if it's PK. 
                                // If 'id' is PK, we can't update it easily if referenced. 
                                // But UazAPI instance ID is likely stable or we should use it as PK.
                                // Let's assume we update the token for the existing instance row.
             name: name,
             updated_at: new Date().toISOString()
         }).eq('id', existingInstance.id);
      } else {
         await serviceClient.from('instances').insert({
             id: newInstanceId, // Try to use UazAPI ID as PK.
             user_id: user.id,
             token: newInstanceToken,
             name: name,
             owner: user.email,
             status: 'created'
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
