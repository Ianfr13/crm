/**
 * Utilidades Compartilhadas para Edge Functions UazAPI
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { UazapiClient } from "./uazapi-client.ts";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export interface AuthContext {
  user: any;
  supabase: any;
  uazapi: UazapiClient;
  instanceName: string;
}

export async function getAuthContext(req: Request): Promise<AuthContext | null> {
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
      return null;
    }

    const base_url = Deno.env.get('UAZAPI_BASE_URL');
    const admin_token = Deno.env.get('UAZAPI_ADMIN_TOKEN');

    if (!base_url || !admin_token) {
      return null;
    }

    const url = new URL(req.url);
    const instanceName = url.searchParams.get('instance') || '';

    const { data: integration } = await supabase
      .from('integrations')
      .select('instance_token')
      .eq('user_id', user.id)
      .eq('provider', 'uazapi')
      .maybeSingle();

    const uazapi = new UazapiClient({
      baseUrl: base_url,
      instanceToken: integration?.instance_token,
      adminToken: admin_token
    });

    return {
      user,
      supabase,
      uazapi,
      instanceName
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export function errorResponse(message: string, status: number = 400) {
  return new Response(JSON.stringify({ error: message }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status
  });
}

export function successResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status
  });
}

export function corsResponse() {
  return new Response('ok', { headers: corsHeaders });
}
