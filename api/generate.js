export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key Vercel ENV mein nahi mili. Please check.' });
  }

  try {
    // ✅ Sabse stable model use kar rahe hain
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze this prompt: "${prompt}". Return ONLY a raw JSON object with keys: "siteName", "bio", "themeType", "hasYoutube", "hasDiscord".` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();

    // Agar Google API koi error deta hai (jaise galat key ya limit)
    if (!response.ok) {
      console.error("Google API Error:", data);
      return res.status(response.status).json({ error: data.error?.message || "Google API Error" });
    }

    // Agar sab theek hai
    res.status(200).json(data);
    
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
}
