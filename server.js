/**
 * BharatFarm Local Development Server
 * Run: node server.js
 * Opens at: http://localhost:5000
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT || 5000;
const DESIRED_PORT = parseInt(PORT, 10) || 5000;

// ── API Key (move to a .env file for production) ──────────────────────────────
// To use .env: npm install dotenv  →  add require('dotenv').config(); at top
const OPENROUTER_API_KEY = (process.env.OPENROUTER_API_KEY || "").trim();
if (OPENROUTER_API_KEY) {
    console.log('[Auth] API Key detected (starts with: ' + OPENROUTER_API_KEY.substring(0, 7) + '...)');
} else {
    console.warn('[Auth] WARNING: OPENROUTER_API_KEY is missing from environment variables!');
}

const fetch = require('node-fetch');
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "google/gemini-2.0-flash-lite-001"; // Highly compatible fast model

// Helper: call OpenRouter
async function callOpenAI(messages) {
    let lastErrorRaw = "";
    console.log(`[OpenRouter] Trying model: ${OPENROUTER_MODEL} with key: ${OPENROUTER_API_KEY.substring(0, 7)}...`);
    try {
        const r = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'X-Title': 'BharatFarm'
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: messages
            }),
            timeout: 30000
        });

        const raw = await r.text();
        console.log(`[OpenRouter] Status ${r.status}`);

        if (r.ok) {
            const data = JSON.parse(raw);
            return data.choices?.[0]?.message?.content || "I couldn't generate a response.";
        }

        lastErrorRaw = raw;
        console.error(`[OpenRouter] Error: Status ${r.status}`);
        console.error(`[OpenRouter] Error Body:`, raw);
    } catch (fetchErr) {
        console.error(`[OpenRouter] Network error:`, fetchErr);
        lastErrorRaw = fetchErr.message;
    }
    throw new Error(`OpenRouter failed. Last error: ${lastErrorRaw}`);
}

// ─────────────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {

    // ── CORS ──────────────────────────────────────────────────────────────────
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // ── POST /api/chat ─────────────────────────────────────────────────────────
    if (req.url === '/api/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const payload = JSON.parse(body);
                
                // Route 1: Generic Proxy Format (used by config.js, scanner)
                if (payload.messages && !payload.text) {
                    console.log(`\n[/api/chat] Proxying generic AI request with ${payload.messages.length} messages`);
                    const aiResponseText = await callOpenAI(payload.messages);
                    
                    // The frontend config.js expects an OpenRouter-style JSON response:
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        choices: [{
                            message: { content: aiResponseText }
                        }]
                    }));
                    return;
                }

                // Route 2: Legacy KrishiBot Format (used by older chat components)
                const { text, language = 'en', history = [] } = payload;
                console.log(`\n[/api/chat] Received: "${text}" (lang: ${language})`);

                const systemNote = `You are KrishiBot, a friendly AI for Indian farmers on BharatFarm. Respond in ${language}. Keep answers very short (2-3 sentences max) as they will be read aloud.`;

                const messages = history.slice(-6).map(msg => ({
                    role: msg.role === 'ai' ? 'assistant' : 'user',
                    content: msg.text
                }));

                messages.unshift({
                    role: 'system',
                    content: systemNote
                });

                messages.push({
                    role: 'user',
                    content: text
                });

                const aiResponse = await callOpenAI(messages);
                console.log(`[/api/chat] ✅ Responding: "${aiResponse.substring(0, 80)}..."`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ response: aiResponse }));

            } catch (e) {
                console.error('[/api/chat] ❌ Error:', e.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // ── POST /api/schemes ──────────────────────────────────────────────────────
    if (req.url === '/api/schemes' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const { landSize, state, crop } = JSON.parse(body);
                console.log(`\n[/api/schemes] State=${state}, Land=${landSize}ac, Crop=${crop}`);

                const prompt = `You are an expert on Indian government agricultural schemes and subsidies.
A farmer has the following profile:
- State: ${state}
- Land Size: ${landSize} acres
- Primary Crop: ${crop || 'General (not specified)'}

Return a JSON array of ALL government schemes (both Central and ${state} State-specific) this farmer is ELIGIBLE for.
Include BOTH central schemes available to all farmers AND specific schemes for ${state}.

For EACH scheme provide EXACTLY these fields:
{
  "id": "unique-slug",
  "name": "Full Official Scheme Name",
  "type": "Central" or "State" or "Central/State",
  "description": "2-3 sentences explaining what this scheme offers and its purpose.",
  "eligibility": {
    "minLandSize": 0,
    "maxLandSize": 9999,
    "states": ["All"] or ["${state}"],
    "crops": ["All"] or ["Rice","Wheat"]
  },
  "benefits": ["Benefit 1 with ₹ amount", "Benefit 2", "Benefit 3"],
  "link": "https://official.gov.in/portal/url",
  "applySteps": ["Step 1: Visit official portal", "Step 2: Register with Aadhaar", "Step 3: Submit land documents"]
}

${state === 'West Bengal' && landSize === 0 
? `CRITICAL WEST BENGAL REQUIREMENT: Since the land size is 0 (landless) or they are a sharecropper in West Bengal, you MUST RETURN EXACTLY AND ONLY the following two specific schemes:
1. Name: "Bhumihin Krishak Bandhu (Landless Farmer Scheme)", type: "State", Description: "Main scheme for landless farmers in West Bengal who work on others' land but own no agricultural land.", Benefits: ["₹4,000 per year (₹2000 Rabi, ₹2000 Kharif)"], Apply Steps: ["Through Duare Sarkar camps, BDO office, or Agriculture portal", "Need Aadhaar, Bank account, Self-declaration (no land)"].
2. Name: "Krishak Bandhu (for sharecroppers also)", type: "State", Description: "Financial assistance for registered sharecroppers (Bhagchasi). Useful if farmer doesn't own land but is a registered sharecropper.", Benefits: ["₹1,000 - ₹5,000 yearly", "₹2 lakh death benefit insurance"].
DO NOT INCLUDE PM-KISAN, PMFBY, OR ANY OTHER SCHEMES.` 
: `Always include these central schemes if eligible: PM-KISAN (pmkisan.gov.in), PMFBY (pmfby.gov.in), PM Krishi Sinchai Yojana (pmksy.gov.in), Kisan Credit Card (pmkisan.gov.in/KCC), Soil Health Card (soilhealth.dac.gov.in).\nAlso include major ${state}-specific schemes with their REAL official portal URLs.`}

Return ONLY the raw JSON array. No markdown, no code blocks, no explanation text.`;

                const aiResponseText = await callOpenAI([{ role: 'user', content: prompt }]);
                console.log(`[/api/schemes] AI response length: ${aiResponseText.length} chars`);

                // Strip markdown code fences and extract JSON
                let cleanText = aiResponseText
                    .replace(/```json/gi, '')
                    .replace(/```/g, '')
                    .trim();

                // Try to find a JSON array in the response
                const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
                if (!jsonMatch) {
                    console.error('[/api/schemes] No JSON array found. Raw (first 500 chars):', cleanText.substring(0, 500));
                    throw new Error('No JSON array in AI response');
                }

                let schemes;
                try {
                    schemes = JSON.parse(jsonMatch[0]);
                } catch (parseErr) {
                    console.error('[/api/schemes] JSON parse failed:', parseErr.message);
                    console.error('[/api/schemes] Extracted JSON (first 500):', jsonMatch[0].substring(0, 500));
                    throw new Error('Failed to parse AI JSON: ' + parseErr.message);
                }

                console.log(`[/api/schemes] ✅ Returning ${schemes.length} schemes`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, schemes }));
            } catch (e) {
                console.error('[/api/schemes] ❌ Error:', e.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
            }
        });
        return;
    }

    // ── POST /submit-payment ───────────────────────────────────────────────────

    if (req.url === '/submit-payment' && req.method === 'POST') {
        let body = '';
        const limitBytes = 10 * 1024 * 1024; // 10MB limit

        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > limitBytes) {
                req.destroy(); // Reject payload too large
            }
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { name, screenshot } = data;

                if (!screenshot || !screenshot.startsWith('data:image/')) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Invalid image format" }));
                    return;
                }

                // Ensure pending_payments directory exists
                const paymentsDir = path.join(__dirname, 'pending_payments');
                if (!fs.existsSync(paymentsDir)) {
                    fs.mkdirSync(paymentsDir, { recursive: true });
                }

                // Extract base64 data (remove data:image/png;base64, prefix)
                const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, "");
                const buffer = Buffer.from(base64Data, 'base64');

                // Construct filename
                const safeName = (name || "Unknown").replace(/[^a-z0-9]/gi, '_');
                const timestamp = Date.now();
                const filename = `${safeName}-${timestamp}.png`;
                const filepath = path.join(paymentsDir, filename);

                // Save file temporarily (or permanently if you want to keep logs)
                fs.writeFileSync(filepath, buffer);
                console.log(`[Payment] Saved proof for ${name} at ${filepath}`);

                // --- AI Verification ---
                console.log(`[Payment] Verifying screenshot with Gemini Vision...`);
                // Get the mime type from the data URL (e.g., image/jpeg or image/png)
                const mimeType = screenshot.match(/data:(image\/\w+);base64,/)?.[1] || 'image/png';

                const visionPrompt = `
You are a payment verification assistant. Analyze the uploaded screenshot of a UPI payment.
Check for the following criteria:
1. Is it a successful payment screenshot?
2. Is the amount exactly ₹49 (or 49.00)?
3. Is the recipient "Snehasis Chakraborty" or the UPI ID "9339791297@ptyes" or similar?

Respond strictly in JSON format with two keys:
- "success": boolean (true if all criteria match, false otherwise)
- "reason": string (If success is true, say "Payment verified successfully". If false, explain exactly why, e.g., "The amount is ₹20 instead of ₹49" or "The recipient does not match" or "This is not a valid payment screenshot").
Do not include any markdown formatting like \`\`\`json in your response. Just the raw JSON object.
`;

                const messages = [{
                    role: 'user',
                    content: [
                        { type: 'text', text: visionPrompt },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType};base64,${base64Data}`
                            }
                        }
                    ]
                }];

                // Use the existing callOpenAI helper
                const aiResponseText = await callOpenAI(messages);
                console.log(`[Payment] Gemini Response:`, aiResponseText);

                try {
                    // Try to parse the JSON. Gemini might wrap it in markdown.
                    const cleanJson = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
                    const verificationResult = JSON.parse(cleanJson);

                    if (verificationResult.success) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: verificationResult.reason }));
                    } else {
                        // Return 400 Bad Request with the reason so the frontend can display it
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: verificationResult.reason }));
                    }
                } catch (parseError) {
                    console.error("[Payment] Failed to parse Gemini JSON:", parseError);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Failed to verify the payment image." }));
                }

            } catch (e) {
                console.error('[Payment] Error:', e.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Internal server error" }));
            }
        });
        return;
    }

    // ── POST /api/analyze-leaf ─────────────────────────────────────────────────
    if (req.url === '/api/analyze-leaf' && req.method === 'POST') {
        let body = '';
        const limitBytes = 10 * 1024 * 1024; // 10MB limit

        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > limitBytes) {
                req.destroy(); // Reject payload too large
            }
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { mimeType, base64Image } = data;

                if (!base64Image) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: "No image data provided" }));
                    return;
                }

                console.log(`[Analyze] Analyzing leaf picture with Gemini Vision...`);

                const visionPrompt = `
You are an expert plant pathologist. Analyze the provided image.
First, determine if the image contains a plant leaf. If it does NOT contain a plant leaf (e.g., it's an animal, person, object, landscape, screenshot, etc.), return status "not_a_plant".
If it IS a plant leaf, identify any diseases, deficiencies, or pests present. If the leaf is healthy, state that it is healthy.

Respond strictly in JSON format matching this exact structure:
{
  "success": true,
  "disease": {
    "status": "healthy" | "diseased" | "not_a_plant",
    "name": "Name of the disease, 'Healthy Plant', or 'Not a Plant'",
    "description": "Short description of the issue, or explain what the image actually contains if not a plant.",
    "fertilizers": ["Fertilizer recommendation 1", "Fertilizer recommendation 2"],
    "treatments": ["Actionable tip 1", "Actionable tip 2"]
  }
}

IMPORTANT: If the image is NOT a plant leaf, you MUST set status to "not_a_plant", name to "Not a Plant", and leave fertilizers and treatments as empty arrays.

Do not include any markdown formatting like \`\`\`json in your response. Just return the raw JSON object.
`;

                const messages = [{
                    role: 'user',
                    content: [
                        { type: 'text', text: visionPrompt },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType || 'image/jpeg'};base64,${base64Image}`
                            }
                        }
                    ]
                }];

                const aiResponseText = await callOpenAI(messages);
                console.log(`[Analyze] Gemini Response:`, aiResponseText);

                try {
                    const cleanJson = aiResponseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
                    const analysisResult = JSON.parse(cleanJson);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(analysisResult));
                } catch (parseError) {
                    console.error("[Analyze] Failed to parse Gemini JSON:", parseError);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: "Failed to parse the analysis result." }));
                }

            } catch (e) {
                console.error('[Analyze] Error:', e.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: "Internal server error" }));
            }
        });
        return;
    }


    // ── GET /api/wiki ─────────────────────────────────────────────────────────
    if (req.url.startsWith('/api/wiki') && req.method === 'GET') {
        try {
            const dataPath = path.join(__dirname, 'data', 'agriculture_diseases.json');
            if (!fs.existsSync(dataPath)) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: "Dataset not found" }));
                return;
            }

            const rawData = fs.readFileSync(dataPath, 'utf-8');
            let diseases = JSON.parse(rawData);

            const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
            const query = parsedUrl.searchParams.get('q');
            const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

            // Route: /api/wiki/disease/:id
            if (pathParts[2] === 'disease' && pathParts[3]) {
                const diseaseId = pathParts[3];
                const found = diseases.find(d => d.id === diseaseId);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: found || null }));
                return;
            }

            // Route: /api/wiki/:crop
            if (pathParts[2] && pathParts[2] !== 'search') {
                const cropFilter = decodeURIComponent(pathParts[2]).toLowerCase();
                diseases = diseases.filter(d => d.crop.toLowerCase() === cropFilter);
            }

            // Route: /api/wiki/search?q=...
            if (query) {
                const searchQ = query.toLowerCase();
                diseases = diseases.filter(d => 
                    d.name_en.toLowerCase().includes(searchQ) || 
                    (d.name_bn && d.name_bn.toLowerCase().includes(searchQ)) ||
                    d.crop.toLowerCase().includes(searchQ) ||
                    d.description.toLowerCase().includes(searchQ)
                );
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, count: diseases.length, data: diseases }));
        } catch (e) {
            console.error('[/api/wiki] Error:', e.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
    }

    // ── GET /api/quizzes ──────────────────────────────────────────────────────
    if (req.url.startsWith('/api/quizzes') && req.method === 'GET') {
        try {
            const dataPath = path.join(__dirname, 'data', 'quizzes.json');
            if (fs.existsSync(dataPath)) {
                const rawData = fs.readFileSync(dataPath, 'utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, count: JSON.parse(rawData).length, data: JSON.parse(rawData) }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: "Dataset not found" }));
            }
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
    }

    // ── GET /api/leaderboard ──────────────────────────────────────────────────
    // Returns a list of top farmers sorted by XP (simulated data for demo)
    if (req.url.startsWith('/api/leaderboard') && req.method === 'GET') {
        try {
            // Simulated leaderboard data — in production this would come from a database
            const leaderboard = [
                { name: "Ramesh Kumar", xp: 1820, rank: 1 },
                { name: "Sunita Devi", xp: 1540, rank: 2 },
                { name: "Arjun Patel", xp: 1360, rank: 3 },
                { name: "Lakshmi Bai", xp: 1100, rank: 4 },
                { name: "Mahesh Singh", xp: 980, rank: 5 },
                { name: "Priya Sharma", xp: 840, rank: 6 },
                { name: "Vikram Yadav", xp: 720, rank: 7 },
                { name: "Anita Reddy", xp: 650, rank: 8 },
                { name: "Rajesh Verma", xp: 530, rank: 9 },
                { name: "Kavita Nair", xp: 410, rank: 10 }
            ];

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: leaderboard }));
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
    }

    // ── GET /api/achievements ──────────────────────────────────────────────────
    if (req.url.startsWith('/api/achievements') && req.method === 'GET') {
        try {
            const dataPath = path.join(__dirname, 'data', 'achievements.json');
            if (fs.existsSync(dataPath)) {
                const rawData = fs.readFileSync(dataPath, 'utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(rawData); // already JSON string
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: "Dataset not found" }));
            }
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
    }

    // ── Static file serving ────────────────────────────────────────────────────
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    filePath = filePath.split('?')[0]; // strip query params

    const ext = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(err.code === 'ENOENT' ? 404 : 500);
            res.end(err.code === 'ENOENT' ? '404 Not Found' : '500 Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

function onStarted(port) {
    console.log(`\n===========================================`);
    console.log(`🚀 BharatFarm Backend Server Running`);
    console.log(`👉 Open: http://localhost:${port}`);
    console.log(`🤖 KrishiBot API: POST http://localhost:${port}/api/chat`);
    console.log(`===========================================\n`);
}

// Try listening on a port, and if it's in use, increment until a free port is found.
const triedPorts = new Set();
function tryListen(port, maxAttempts = 20) {
    if (triedPorts.has(port)) {
        console.error(`Already attempted port ${port} — aborting to avoid loop.`);
        process.exit(1);
    }
    triedPorts.add(port);

    server.once('listening', () => {
        // Remove any pending 'error' listeners for cleanliness
        server.removeAllListeners('error');
        onStarted(port);
    });

    server.once('error', (err) => {
        server.removeAllListeners('listening');
        if (err && err.code === 'EADDRINUSE') {
            console.error(`Error: listen EADDRINUSE: address already in use ::${port}`);
            const next = port + 1;
            if (triedPorts.size >= maxAttempts) {
                console.error(`Reached max port attempts (${maxAttempts}). Exiting.`);
                process.exit(1);
            }
            console.log(`Trying fallback port ${next}...`);
            tryListen(next, maxAttempts);
            return;
        }
        console.error('Server error:', err);
        process.exit(1);
    });

    server.listen(port);
}

tryListen(DESIRED_PORT);

// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT, shutting down server...');
    try {
        server.close(() => process.exit(0));
    } catch (e) {
        process.exit(0);
    }
});
