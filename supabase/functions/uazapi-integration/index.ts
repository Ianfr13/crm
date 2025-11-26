import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { UazapiClient } from "../_shared/uazapi-client.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization')
          }
        }
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: 'Unauthorized'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 401
      });
    }

    const { method } = req;
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const instanceName = url.searchParams.get('instance');

    const base_url = Deno.env.get('UAZAPI_BASE_URL');
    const admin_token = Deno.env.get('UAZAPI_ADMIN_TOKEN');

    if (!base_url || !admin_token) {
      return new Response(JSON.stringify({
        error: 'UAZAPI_BASE_URL and UAZAPI_ADMIN_TOKEN must be configured in Supabase Secrets'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      });
    }

    // ==================== ADMINISTRAÇÃO ====================

    if (method === 'POST' && action === 'create_instance') {
      const { instance_name, system_name, admin_field_01, admin_field_02 } = await req.json();
      const uazapi = new UazapiClient({
        baseUrl: base_url,
        adminToken: admin_token
      });

      const name = instance_name || `instance_${Math.random().toString(36).substring(7)}`;
      const createResult = await uazapi.createInstance(name, system_name, admin_field_01, admin_field_02);

      if (!createResult.success) {
        return new Response(JSON.stringify(createResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const newInstanceToken = createResult.data.token;
      const newInstanceId = createResult.data.instance?.id;

      // Update integration in database
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
          metadata: {
            instance_id: newInstanceId,
            instance_name: name
          }
        }).eq('id', existingIntegration.id);
      } else {
        await supabase.from('integrations').insert({
          user_id: user.id,
          provider: 'uazapi',
          instance_token: newInstanceToken,
          active: true,
          metadata: {
            instance_id: newInstanceId,
            instance_name: name
          }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        instance_token: newInstanceToken,
        instance_id: newInstanceId,
        data: createResult.data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    if (method === 'GET' && action === 'list_instances') {
      const uazapi = new UazapiClient({
        baseUrl: base_url,
        adminToken: admin_token
      });

      const result = await uazapi.listInstances();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'update_admin_fields') {
      const { instance_name, admin_field_01, admin_field_02 } = await req.json();
      const uazapi = new UazapiClient({
        baseUrl: base_url,
        adminToken: admin_token
      });

      const result = await uazapi.updateAdminFields(instance_name, admin_field_01, admin_field_02);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_global_webhook') {
      const uazapi = new UazapiClient({
        baseUrl: base_url,
        adminToken: admin_token
      });

      const result = await uazapi.getGlobalWebhook();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'configure_global_webhook') {
      const { url, events } = await req.json();
      const uazapi = new UazapiClient({
        baseUrl: base_url,
        adminToken: admin_token
      });

      const result = await uazapi.configureGlobalWebhook(url, events);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== INSTANCIA ====================

    if (method === 'POST' && action === 'connect_instance') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.connectInstance(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'disconnect_instance') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.disconnectInstance(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_instance_status') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getInstanceStatus(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'update_instance_name') {
      const { new_name } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.updateInstanceName(instanceName || '', new_name);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'DELETE' && action === 'delete_instance') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.deleteInstance(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_privacy_settings') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getPrivacySettings(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'update_privacy_settings') {
      const settings = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.updatePrivacySettings(instanceName || '', settings);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'update_presence_status') {
      const { status } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.updatePresenceStatus(instanceName || '', status);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== PERFIL ====================

    if (method === 'GET' && action === 'get_profile') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getProfile(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'update_profile') {
      const profile = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.updateProfile(instanceName || '', profile);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== CHAMADAS ====================

    if (method === 'GET' && action === 'list_calls') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listCalls(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'reject_call') {
      const { call_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.rejectCall(instanceName || '', call_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== WEBHOOKS E SSE ====================

    if (method === 'GET' && action === 'get_webhook') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getWebhook(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'configure_webhook') {
      const { url, events } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.configureWebhook(instanceName || '', url, events);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'connect_sse') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.connectSSE(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== ENVIAR MENSAGEM ====================

    if (method === 'POST' && action === 'send_text') {
      const { number, message } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendText(instanceName || '', number, message);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'send_image') {
      const { number, image_url, caption } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendImage(instanceName || '', number, image_url, caption);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'send_document') {
      const { number, document_url, filename } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendDocument(instanceName || '', number, document_url, filename);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'send_audio') {
      const { number, audio_url } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendAudio(instanceName || '', number, audio_url);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'send_video') {
      const { number, video_url, caption } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendVideo(instanceName || '', number, video_url, caption);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'send_location') {
      const { number, latitude, longitude, label } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendLocation(instanceName || '', number, latitude, longitude, label);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'send_contact') {
      const { number, contact } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendContact(instanceName || '', number, contact);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'send_list') {
      const { number, list } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendList(instanceName || '', number, list);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'send_buttons') {
      const { number, message, buttons } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendButtons(instanceName || '', number, message, buttons);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'send_template') {
      const { number, template_id, parameters } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendTemplate(instanceName || '', number, template_id, parameters);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'send_poll') {
      const { number, question, options } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendPoll(instanceName || '', number, question, options);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== AÇÕES NA MENSAGEM E BUSCAR ====================

    if (method === 'POST' && action === 'react_to_message') {
      const { message_id, emoji } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.reactToMessage(instanceName || '', message_id, emoji);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'edit_message') {
      const { message_id, new_message } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.editMessage(instanceName || '', message_id, new_message);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'delete_message') {
      const { message_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.deleteMessage(instanceName || '', message_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'forward_message') {
      const { message_id, target_number } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.forwardMessage(instanceName || '', message_id, target_number);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'search_messages') {
      const query = url.searchParams.get('query') || '';
      const limit = url.searchParams.get('limit') || '50';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.searchMessages(instanceName || '', query, parseInt(limit));
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_message_details') {
      const message_id = url.searchParams.get('message_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getMessageDetails(instanceName || '', message_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== CHATS ====================

    if (method === 'GET' && action === 'list_chats') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listChats(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_chat') {
      const chat_id = url.searchParams.get('chat_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getChat(instanceName || '', chat_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'archive_chat') {
      const { chat_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.archiveChat(instanceName || '', chat_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'unarchive_chat') {
      const { chat_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.unarchiveChat(instanceName || '', chat_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'mute_chat') {
      const { chat_id, duration } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.muteChat(instanceName || '', chat_id, duration);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'unmute_chat') {
      const { chat_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.unmuteChat(instanceName || '', chat_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== CONTATOS ====================

    if (method === 'GET' && action === 'list_contacts') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listContacts(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_contact') {
      const contact_id = url.searchParams.get('contact_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getContact(instanceName || '', contact_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'create_contact') {
      const contact = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.createContact(instanceName || '', contact);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'update_contact') {
      const { contact_id, ...contact } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.updateContact(instanceName || '', contact_id, contact);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'DELETE' && action === 'delete_contact') {
      const contact_id = url.searchParams.get('contact_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.deleteContact(instanceName || '', contact_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'block_contact') {
      const { contact_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.blockContact(instanceName || '', contact_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== BLOQUEIOS ====================

    if (method === 'GET' && action === 'list_blocked_contacts') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listBlockedContacts(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'unblock_contact') {
      const { contact_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.unblockContact(instanceName || '', contact_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== ETIQUETAS ====================

    if (method === 'GET' && action === 'list_labels') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listLabels(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'create_label') {
      const { label, color } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.createLabel(instanceName || '', label, color);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'add_label_to_message') {
      const { label_id, message_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.addLabelToMessage(instanceName || '', label_id, message_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== GRUPOS E COMUNIDADES ====================

    if (method === 'GET' && action === 'list_groups') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listGroups(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_group') {
      const group_id = url.searchParams.get('group_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getGroup(instanceName || '', group_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'create_group') {
      const { subject, participants } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.createGroup(instanceName || '', subject, participants);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'update_group') {
      const { group_id, ...updates } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.updateGroup(instanceName || '', group_id, updates);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'DELETE' && action === 'delete_group') {
      const group_id = url.searchParams.get('group_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.deleteGroup(instanceName || '', group_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'leave_group') {
      const { group_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.leaveGroup(instanceName || '', group_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'add_group_member') {
      const { group_id, number } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.addGroupMember(instanceName || '', group_id, number);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'remove_group_member') {
      const { group_id, number } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.removeGroupMember(instanceName || '', group_id, number);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'promote_group_member') {
      const { group_id, number } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.promoteGroupMember(instanceName || '', group_id, number);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'demote_group_member') {
      const { group_id, number } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.demoteGroupMember(instanceName || '', group_id, number);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'list_group_members') {
      const group_id = url.searchParams.get('group_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listGroupMembers(instanceName || '', group_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_group_invite_link') {
      const group_id = url.searchParams.get('group_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getGroupInviteLink(instanceName || '', group_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'revoke_group_invite_link') {
      const { group_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.revokeGroupInviteLink(instanceName || '', group_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'create_community') {
      const { subject, description } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.createCommunity(instanceName || '', subject, description);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'list_communities') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listCommunities(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'add_subgroup_to_community') {
      const { community_id, group_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.addSubgroupToCommunity(instanceName || '', community_id, group_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'remove_subgroup_from_community') {
      const { community_id, group_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.removeSubgroupFromCommunity(instanceName || '', community_id, group_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== RESPOSTAS RÁPIDAS ====================

    if (method === 'GET' && action === 'list_quick_replies') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listQuickReplies(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'create_quick_reply') {
      const { trigger, response } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.createQuickReply(instanceName || '', trigger, response);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== CRM ====================

    if (method === 'GET' && action === 'list_crm_contacts') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listCrmContacts(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'create_crm_contact') {
      const contact = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.createCrmContact(instanceName || '', contact);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== MENSAGEM EM MASSA ====================

    if (method === 'POST' && action === 'send_broadcast') {
      const { message, recipients } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.sendBroadcast(instanceName || '', message, recipients);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_broadcast_status') {
      const broadcast_id = url.searchParams.get('broadcast_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getBroadcastStatus(instanceName || '', broadcast_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'list_broadcasts') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listBroadcasts(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'cancel_broadcast') {
      const { broadcast_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.cancelBroadcast(instanceName || '', broadcast_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'pause_broadcast') {
      const { broadcast_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.pauseBroadcast(instanceName || '', broadcast_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'resume_broadcast') {
      const { broadcast_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.resumeBroadcast(instanceName || '', broadcast_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_broadcast_stats') {
      const broadcast_id = url.searchParams.get('broadcast_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getBroadcastStats(instanceName || '', broadcast_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== INTEGRAÇÃO CHATWOOT ====================

    if (method === 'POST' && action === 'connect_chatwoot') {
      const config = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.connectChatwoot(instanceName || '', config);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'disconnect_chatwoot') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.disconnectChatwoot(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== PROXY ====================

    if (method === 'POST' && action === 'enable_proxy') {
      const { proxy_url } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.enableProxy(instanceName || '', proxy_url);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'disable_proxy') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.disableProxy(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_proxy_status') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getProxyStatus(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== CHATBOT ====================

    if (method === 'POST' && action === 'create_chatbot') {
      const config = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.createChatbot(instanceName || '', config);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'list_chatbots') {
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.listChatbots(instanceName || '');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_chatbot_details') {
      const bot_id = url.searchParams.get('bot_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getChatbotDetails(instanceName || '', bot_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'update_chatbot') {
      const { bot_id, ...updates } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.updateChatbot(instanceName || '', bot_id, updates);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'DELETE' && action === 'delete_chatbot') {
      const bot_id = url.searchParams.get('bot_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.deleteChatbot(instanceName || '', bot_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'enable_chatbot') {
      const { bot_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.enableChatbot(instanceName || '', bot_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'disable_chatbot') {
      const { bot_id } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.disableChatbot(instanceName || '', bot_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'POST' && action === 'train_chatbot') {
      const { bot_id, training_data } = await req.json();
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.trainChatbot(instanceName || '', bot_id, training_data);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    if (method === 'GET' && action === 'get_chatbot_logs') {
      const bot_id = url.searchParams.get('bot_id') || '';
      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration?.instance_token) {
        return new Response(JSON.stringify({ error: 'No uazapi instance found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        instanceToken: integration.instance_token
      });

      const result = await uazapi.getChatbotLogs(instanceName || '', bot_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      });
    }

    // ==================== GET USER INTEGRATION ====================

    if (method === 'GET') {
      const { data, error } = await supabase
        .from('integrations')
        .select('id, instance_token, active, metadata, created_at, updated_at')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    return new Response(JSON.stringify({
      error: 'Invalid action or method'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  } catch (error) {
    console.error('uazapi-integration error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});
