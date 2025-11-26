import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts"
import { sha256 } from "https://deno.land/x/hmac@v2.0.1/mod.ts"

serve(async (req) => {
    try {
        const payload = await req.json()
        // Payload from Database Webhook contains { type: 'INSERT', table: 'messages', record: { ... }, schema: 'public' }
        const { record } = payload

        if (!record) {
            return new Response('No record found', { status: 400 })
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Fetch active agents
        const { data: agents, error } = await supabase
            .from('agent_registrations')
            .select('*')
            .eq('is_active', true)

        if (error) throw error

        const eventPayload = {
            event: 'message.created',
            data: record,
            timestamp: new Date().toISOString()
        }

        const promises = agents.map(async (agent) => {
            try {
                // Sign payload
                const signature = hmac(sha256, agent.secret_key, JSON.stringify(eventPayload), "utf8", "hex")

                // Send webhook
                const response = await fetch(agent.webhook_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Hub-Signature-256': `sha256=${signature}`
                    },
                    body: JSON.stringify(eventPayload)
                })

                console.log(`Sent event to agent ${agent.name}: ${response.status}`)
            } catch (err) {
                console.error(`Failed to send event to agent ${agent.name}:`, err)
            }
        })

        await Promise.all(promises)

        return new Response('Events dispatched', { status: 200 })

    } catch (error) {
        console.error('Dispatch Error:', error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
})
