export const generateGeminiResponse = async (
  prompt: string,
  variant: 'med-card' | 'business' | 'general' | 'ggma' | 'rip' | 'sinc' = 'general',
  history: {role: string, text: string}[] = []
): Promise<string> => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY) {
    console.error('Gemini API Key is missing. Using fallback response.');
    return "I am currently offline or missing my API key. Please configure VITE_GEMINI_API_KEY in the .env file.";
  }

  // System Instruction based on the variant of the chatbot
  let systemInstruction = "You are Sylara, an advanced AI Intake Agent for the Global Green Hybrid Platform (GGHP). You are professional, concise, and highly knowledgeable about cannabis compliance, licensing, and medical card intake. Do not use markdown headers, keep responses conversational but formal.";
  
  if (variant === 'rip') {
    systemInstruction = "You are Sylara, the intake coordinator for the Real-time Intelligence & Policing (RIP) portal. You interface with law enforcement and the L.A.R.R.Y Enforcement Engine. You provide strict, compliance-focused oversight regarding roadside swab testing and evidentiary chain of custody.";
  } else if (variant === 'sinc') {
    systemInstruction = "You are Sylara, managing the SINC Compliance Infrastructure. You ensure audit trails, encrypted records, and network integrity across jurisdictions.";
  } else if (variant === 'business') {
    systemInstruction = "You are Sylara, the Intake Agent for commercial cannabis entities. You help cultivators, dispensaries, and attorneys navigate state compliance (like Metrc) and banking regulations.";
  }

  const formattedHistory = history.map(msg => ({
    role: msg.role === 'bot' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          ...formattedHistory,
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return "I encountered a regulatory processing error connecting to my neural core. Please try again.";
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Network connection to the AI engine failed. Please check your connection.";
  }
};
