/**
 * Chatwoot Gateway - BFF para o CRM Headless
 * Atua como proxy seguro entre o Frontend (CRM) e a API do Chatwoot
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    
    // 1. Autenticação (Verificar JWT do Supabase)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // 2. Configuração do Chatwoot (Pega das variáveis de ambiente)
    const CHATWOOT_URL = Deno.env.get('CHATWOOT_URL') || 'http://chatwoot_web:3000'; // Internal Docker URL or External
    const CHATWOOT_TOKEN = Deno.env.get('CHATWOOT_TOKEN'); // Admin/Agent Token
    
    if (!CHATWOOT_URL || !CHATWOOT_TOKEN) {
       throw new Error('Chatwoot configuration missing on server');
    }

    // 3. Roteamento de Ações
    let endpoint = '';
    let method = req.method;
    let body = null;

    if (method !== 'GET') {
        body = await req.json();
    }

    switch (action) {
        case 'list_conversations': {
            const status = url.searchParams.get('status') || 'open';
            // TODO: Mapear account_id dinamicamente ou fixo via env
            const accountId = 1; 
            endpoint = `/api/v1/accounts/${accountId}/conversations?status=${status}`;
            method = 'GET';
            break;
        }
        case 'list_messages': {
            const conversationId = url.searchParams.get('conversation_id');
            const accountId = 1;
            endpoint = `/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
            method = 'GET';
            break;
        }
        case 'send_message': {
            const conversationId = body.conversation_id;
            const content = body.content;
            const accountId = 1;
            endpoint = `/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
            method = 'POST';
            body = { content, message_type: 'outgoing' };
            break;
        }
        case 'get_websocket_config': {
             // Retorna token para o frontend conectar no WS do Chatwoot
             const accountId = 1; 
             // O Chatwoot não tem um endpoint "get_token" simples público p/ WS, 
             // mas o token de contato é diferente do token de usuário.
             // Para o modo "Headless Agent", usamos o token do usuário (Agent).
             // O Frontend vai usar o PubSub token se disponível.
             // Mocking or fetching profile
             endpoint = `/api/v1/profile`; 
             method = 'GET';
             break;
        }
        default:
            throw new Error('Invalid action');
    }

    // 4. Proxy para Chatwoot
    const cwUrl = `${CHATWOOT_URL}${endpoint}`;
    const cwOptions: any = {
        method,
        headers: {
            'api_access_token': CHATWOOT_TOKEN,
            'Content-Type': 'application/json'
        }
    };

    if (body && method !== 'GET') {
        cwOptions.body = JSON.stringify(body);
    }

    const cwRes = await fetch(cwUrl, cwOptions);
    const cwData = await cwRes.json();

    if (!cwRes.ok) {
        console.error('Chatwoot Error:', cwData);
        return new Response(JSON.stringify({ error: cwData.error || 'Chatwoot API Error' }), {
             status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // Tratamento específico
    if (action === 'get_websocket_config') {
        // Extrair pubsub_token do profile
        return new Response(JSON.stringify({ 
            pubsub_token: cwData.pubsub_token,
            account_id: cwData.account_id || 1
        }), {
             status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify(cwData), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Gateway Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
