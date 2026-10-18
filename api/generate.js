export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GROQ_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API Key missing. Check Vercel ENV.' });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b", // 👈 Naya active model
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
      console.error("Groq API Error:", data);
      return res.status(response.status).json({ error: data.error?.message || "Groq API Error" });
    }

    const aiText = data.choices[0].message.content;
    res.status(200).json({ result: aiText });
    
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
}
