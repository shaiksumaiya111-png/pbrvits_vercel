export default async function handler(req, res) {
  // Allow requests from the frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  const SYSTEM_PROMPT = `You are an official AI assistant for PBRVITS (P.B.R. Visvodaya Institute of Technology and Science), a reputed engineering college in Andhra Pradesh, India. Website: https://pbrvits.ac.in/

Help students, parents, and visitors with:
- Admissions: eligibility, process, dates, EAMCET/JEE, documents
- Courses: B.Tech (CSE, ECE, EEE, ME, CE, IT, AIDS, AIML, Data Science, Cyber Security), M.Tech, MBA, MCA
- Fee structure and scholarships (AP state, EBC, SC/ST, OBC)
- Facilities: labs, library, hostels, sports, cafeteria, Wi-Fi
- Placements: recruiters, packages, internships
- Faculty, departments, NAAC/NBA accreditation, JNTUK affiliation
- Events, clubs, contact info (Kavali, SPSR Nellore district, AP)

Guidelines:
- Be friendly, concise, and professional.
- For specific figures (fees, packages), give realistic estimates and suggest visiting https://pbrvits.ac.in/ for confirmation.
- Keep answers under 200 words unless detail is needed.
- Use bullet points for readability.`;

  try {
    // Convert chat history to Gemini format
    const geminiHistory = messages.slice(0, -1).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    const payload = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        ...geminiHistory,
        { role: "user", parts: [{ text: lastMessage }] }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7
      }
    };

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not generate a response.";
    res.status(200).json({ reply });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
