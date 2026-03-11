const SYSTEM_PROMPT = `You are an official AI assistant for PBRVITS college in Andhra Pradesh, India. Website: https://pbrvits.ac.in/
Help with: Admissions (EAMCET/JEE), B.Tech courses (CSE, ECE, EEE, ME, IT, AIML, Data Science, Cyber Security), M.Tech, MBA, MCA, fee structure, scholarships, facilities, placements, contact info (Kavali, Nellore district).
Be friendly, concise, use bullet points. For exact figures suggest visiting https://pbrvits.ac.in/`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  try {
    const geminiHistory = messages.slice(0, -1).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const payload = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        ...geminiHistory,
        { role: "user", parts: [{ text: messages[messages.length - 1].content }] }
      ],
      generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, try again.";
    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
}
