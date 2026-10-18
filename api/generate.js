export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key missing. Check Vercel Environment Variables.' });
  }

  try {
    // 👇 YAHAN MODEL AUR ENDPOINT UPDATE KAR DIYA HAI 👇
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze this prompt: "${prompt}". Return ONLY a raw JSON object with keys: "siteName", "bio", "themeType", "hasYoutube", "hasDiscord".` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google API Error:", data);
      return res.status(response.status).json({ error: data.error?.message || "Google API Error" });
    }

    res.status(200).json(data);
    
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
}
