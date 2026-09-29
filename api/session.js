// Vercel Serverless Function: api/session.js
// Generates an ephemeral session token for OpenAI Realtime API WebRTC

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: 'OPENAI_API_KEY not configured on server. Please add OPENAI_API_KEY to Vercel Environment Variables.'
        });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                modalities: ["audio", "text"],
                voice: "verse",
                instructions: "You are KrishiBot, a friendly and knowledgeable AI voice assistant for BharatFarm, an Indian agricultural platform. You help farmers and buyers with crop planning, market prices, weather guidance, and farming best practices. Keep your responses very concise and conversational.",
                input_audio_transcription: { model: "gpt-live-transcribe" },
                turn_detection: {
                    type: "server_vad",
                    threshold: 0.5,
                    prefix_padding_ms: 300,
                    silence_duration_ms: 500
                }
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`OpenAI API Error: ${response.status} ${err}`);
        }

        const data = await response.json();

        // Return the full session object which contains client_secret.value
        return res.status(200).json(data);
    } catch (error) {
        console.error('Session Token Error:', error);
        return res.status(500).json({ error: 'Failed to generate real-time session token' });
    }
}
