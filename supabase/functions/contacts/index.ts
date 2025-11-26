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

        if (method === 'GET') {
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        if (method === 'POST') {
            const body = await req.json()
            const { name, email } = body

            if (!name) {
                return new Response(JSON.stringify({ error: 'Name is required' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400,
                })
            }

            const { data, error } = await supabase
                .from('contacts')
                .insert({ name, email })
                .select()
                .single()

            if (error) throw error

            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 201,
            })
        }

        if (method === 'PATCH') {
            const body = await req.json()
            const { id, ...updates } = body

            if (!id) {
                return new Response(JSON.stringify({ error: 'ID is required' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400,
                })
            }

            const { data, error } = await supabase
                .from('contacts')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 405,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
