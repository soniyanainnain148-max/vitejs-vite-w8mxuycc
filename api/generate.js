export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Yeh Vercel ENV se aayega

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key missing in Vercel settings' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze this prompt: "${prompt}". Return ONLY a raw JSON object (no markdown) with exact keys: "siteName" (string), "bio" (string), "themeType" ('neon', 'hacker', or 'white'), "hasYoutube" (boolean), "hasDiscord" (boolean).` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'AI generation failed' });
  }
}
