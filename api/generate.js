export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenRouter API Key missing. Check Vercel ENV.' });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free", // 👈 Sabse stable free model
        messages: [
          { 
            role: "system", 
            content: "You are a website builder. Analyze the user prompt and return ONLY a raw JSON object (no markdown, no extra text) with these keys: 'siteName' (string), 'bio' (string), 'themeType' (string: 'neon', 'hacker', or 'white'), 'hasYoutube' (boolean), 'hasDiscord' (boolean)." 
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API Error:", data);
      return res.status(status?.response || 500).json({ error: data.error?.message || "OpenRouter API Error" });
    }

    const aiText = data.choices[0].message.content;
    res.status(200).json({ result: aiText });
    
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
}
