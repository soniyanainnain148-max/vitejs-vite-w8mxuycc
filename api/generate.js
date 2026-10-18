export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key missing. Check Vercel Environment Variables.' });
  }

  // 👇 RETRY LOGIC (Server busy hone par 3 baar koshish karega) 👇
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Analyze this prompt: "${prompt}". Return ONLY a raw JSON object with keys: "siteName", "bio", "themeType", "hasYoutube", "hasDiscord".` }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Agar 503 (High Demand) ya 429 (Rate Limit) error hai, toh retry karo
        if (response.status === 503 || response.status === 429) {
          lastError = data.error?.message || "Server busy";
          if (attempt < maxRetries) {
            // 1 sec, 2 sec, 4 sec ka wait badhate hue retry karega
            const waitTime = Math.pow(2, attempt - 1) * 1000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue; 
          }
        }
        console.error("Google API Error:", data);
        return res.status(response.status).json({ error: data.error?.message || "Google API Error" });
      }

      // Agar response successful hai, toh seedha return kar do
      return res.status(200).json(data);
      
    } catch (error) {
      lastError = error.message;
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
    }
  }

  // Agar 3 baar koshish ke baad bhi fail ho jaye
  console.error("Max retries reached. Last error:", lastError);
  return res.status(503).json({ error: "AI server is currently busy. Please try again in a few seconds." });
}
