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
        data: createResult.data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    if (method === 'POST' && action === 'get_instance_status') {
      const uazapi = new UazapiClient({
        baseUrl: base_url,
        adminToken: admin_token
      });

      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token, metadata')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration) {
        return new Response(JSON.stringify({
          connected: false,
          status: 'not_connected'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      }

      const statusResult = await uazapi.getInstanceStatus(integration.instance_token);

      if (!statusResult.success) {
        return new Response(JSON.stringify({
          connected: false,
          status: 'error',
          error: statusResult.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      }

      const instance = statusResult.data.instance;
      const qr_code = statusResult.data.qr_code || null;

      return new Response(JSON.stringify({
        success: true,
        data: {
          connected: instance?.connected || false,
          status: instance?.status || 'disconnected',
          qr_code: qr_code,
          instance_id: instance?.id,
          instance_name: integration.metadata?.instance_name
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    if (method === 'POST' && action === 'disconnect_instance') {
      const uazapi = new UazapiClient({
        baseUrl: base_url,
        adminToken: admin_token
      });

      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration) {
        return new Response(JSON.stringify({
          error: 'No integration found'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        });
      }

      const disconnectResult = await uazapi.disconnectInstance(integration.instance_token);

      if (!disconnectResult.success) {
        return new Response(JSON.stringify(disconnectResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      await supabase.from('integrations').update({
        active: false,
        updated_at: new Date().toISOString()
      }).eq('user_id', user.id).eq('provider', 'uazapi');

      return new Response(JSON.stringify({
        success: true,
        data: disconnectResult.data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // ==================== WEBHOOKS ====================

    if (method === 'POST' && action === 'webhook_message_received') {
      const { instance_id, message } = await req.json();

      const { data: integration } = await supabase
        .from('integrations')
        .select('user_id, metadata')
        .eq('provider', 'uazapi')
        .contains('metadata', { instance_id })
        .maybeSingle();

      if (!integration) {
        return new Response(JSON.stringify({
          error: 'Integration not found'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        });
      }

      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('channel', 'whatsapp')
        .eq('external_id', message.from)
        .maybeSingle();

      const conversationId = conversation?.id || (await supabase
        .from('conversations')
        .insert({
          user_id: integration.user_id,
          channel: 'whatsapp',
          external_id: message.from,
          status: 'open'
        })
        .select('id')
        .single()).data?.id;

      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender: 'contact',
        content: message.text,
        media_url: message.media_url || null,
        external_id: message.id,
        channel: 'whatsapp'
      });

      return new Response(JSON.stringify({
        success: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    if (method === 'POST' && action === 'send_message') {
      const { conversation_id, content, media_url } = await req.json();

      const { data: conversation } = await supabase
        .from('conversations')
        .select('external_id, channel')
        .eq('id', conversation_id)
        .single();

      if (!conversation) {
        return new Response(JSON.stringify({
          error: 'Conversation not found'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        });
      }

      const { data: integration } = await supabase
        .from('integrations')
        .select('instance_token')
        .eq('user_id', user.id)
        .eq('provider', 'uazapi')
        .maybeSingle();

      if (!integration) {
        return new Response(JSON.stringify({
          error: 'No integration found'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        });
      }

      const uazapi = new UazapiClient({
        baseUrl: base_url,
        adminToken: admin_token
      });

      const sendResult = await uazapi.sendMessage(
        integration.instance_token,
        conversation.external_id,
        content,
        media_url
      );

      if (!sendResult.success) {
        return new Response(JSON.stringify(sendResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      await supabase.from('messages').insert({
        conversation_id,
        sender: 'user',
        content,
        media_url: media_url || null,
        external_id: sendResult.data.message_id,
        channel: conversation.channel
      });

      return new Response(JSON.stringify({
        success: true,
        data: sendResult.data
      }), {
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
