/**
 * Utilidades Compartilhadas para Edge Functions UazAPI
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { UazapiClient } from "./uazapi-client.ts";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  // IMPORTANT: include custom headers used by the frontend (like 'token') to avoid CORS issues
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, token',
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

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const instanceNameParam = url.searchParams.get('instance');

    // Buscar instância na tabela instances (fonte da verdade)
    const { data: instance } = await serviceClient
      .from('instances')
      .select('token, name')
      .eq('user_id', user.id)
      .maybeSingle();

    const uazapi = new UazapiClient({
      baseUrl: base_url,
      instanceToken: instance?.token,
      adminToken: admin_token
    });

    // Use instance name from query param OR from instance table
    const finalInstanceName = instanceNameParam || instance?.name || '';

    return {
      user,
      supabase,
      uazapi,
      instanceName: finalInstanceName
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
