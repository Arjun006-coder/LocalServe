import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

serve(async (req) => {
    const { message, context } = await req.json()

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are LocalServe AI, a helpful assistant for a platform connecting users with local service providers.
            
            Context: ${JSON.stringify(context)}
            User Query: ${message}
            
            Instructions:
            - Help users find the best providers.
            - Answer questions about services.
            - Be concise, friendly, and professional.
            - If referring to providers, use the data provided in context.`
                    }]
                }]
            })
        })

        const data = await response.json()
        const text = data.candidates[0].content.parts[0].text

        return new Response(JSON.stringify({ reply: text }), {
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
})
