import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { method } = req
        const url = new URL(req.url)
        const contactId = url.searchParams.get('contact_id')

        if (method === 'GET') {
            let query = supabase
                .from('conversations')
                .select('*, contact:contacts(*)')
                .order('last_message_at', { ascending: false })

            if (contactId) {
                query = query.eq('contact_id', contactId)
            }

            const { data, error } = await query

            if (error) throw error

            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        if (method === 'POST') {
            const body = await req.json()
            const { contact_id, channel, status } = body

            if (!contact_id) {
                return new Response(JSON.stringify({ error: 'Contact ID is required' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400,
                })
            }

            const { data, error } = await supabase
                .from('conversations')
                .insert({ contact_id, channel: channel || 'chat', status: status || 'open' })
                .select()
                .single()

            if (error) throw error

            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 201,
            })
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 405,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
