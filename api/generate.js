export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API Key missing. Check Vercel ENV.' });
  }

  try {
    // ✅ Google ka native endpoint aur latest stable model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze this prompt: "${prompt}". Return ONLY a raw JSON object (no markdown, no extra text) with these keys: 'siteName' (string), 'bio' (string), 'themeType' (string: 'neon', 'hacker', or 'white'), 'hasYoutube' (boolean), 'hasDiscord' (boolean).` }] }],
        generationConfig: { 
          responseMimeType: "application/json" // ✅ Yeh JSON output ko force karta hai
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return res.status(response.status).json({ error: data.error?.message || "Gemini API Error" });
    }

    // Native response format se text nikaalna
    const aiText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ result: aiText });
    
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
}
