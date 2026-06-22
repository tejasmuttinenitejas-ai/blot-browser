import { GROQ_API_KEY, GROQ_MODEL } from './config';

export async function askBecky(messages) {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'PASTE_YOUR_GROQ_KEY_HERE') {
    return {
      error: true,
      text: 'No Groq API key set. Open config.js and paste your key from console.groq.com/keys',
    };
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are Becky, a helpful AI assistant built into the Blot mobile browser. Keep answers concise and useful.',
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      return { error: true, text: `Groq API error (${response.status}): ${errBody.slice(0, 200)}` };
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? 'No response.';
    return { error: false, text };
  } catch (e) {
    return { error: true, text: `Network error: ${e.message}` };
  }
}
