import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// ─── Multi-language system prompts ───────────────────────────────────────
function getSystemPrompt(lang: string): string {
  const langInstruction: Record<string, string> = {
    en: `IMPORTANT: Respond ONLY in English. Be concise — under 100 words.`,
    hi: `आप एक AI यात्रा सहायक हैं। IMPORTANT: Respond ONLY in Hindi (Devanagari script). Use simple, conversational Hindi. Be concise — under 100 words.`,
    kn: `ನೀವು ಒಬ್ಬ AI ಪ್ರಯಾಣ ಸಹಾಯಕರಾಗಿದ್ದೀರಿ. IMPORTANT: Respond ONLY in Kannada. Use simple, everyday Kannada. Be concise — under 100 words.`,
    ta: `நீங்கள் ஒரு AI பயண உதவியாளர். IMPORTANT: Respond ONLY in Tamil. Use simple, conversational Tamil. Be concise — under 100 words.`,
    ml: `നിങ്ങൾ ഒരു AI ട്രാവൽ അസിസ്റ്റന്റ് ആണ്. IMPORTANT: Respond ONLY in Malayalam. Use simple, conversational Malayalam. Be concise — under 100 words.`,
  };

  return `You are RRM Holidays AI travel assistant for South India. Based in Mysuru, covering Karnataka, Kerala, Tamil Nadu, Goa, Andhra Pradesh, Telangana.

STRICT RULES:
- DO NOT show any prices or per-km rates
- DO NOT create travel packages with fixed costs
- DO NOT suggest fixed itineraries with cost
- ONLY describe tourist places and their highlights
- ALWAYS promote customized vehicle service
- ALWAYS guide users to WhatsApp for quotation: +91 91085 97154

Vehicle fleet:
- Sedan (Toyota Etios / Maruti Swift Dzire): 4 seater
- MUV (Toyota Innova): 7 seater
- Premium MUV (Innova Crysta): 7 seater
- Tempo Traveller (12 seater)
- Mini Bus (21 seater)
- Bus (25/33 seater)
- Luxury Coach (50 seater)

All vehicles come with experienced driver-guides. For quotation, customers must contact via WhatsApp: +91 91085 97154 or Instagram: @__yogaraju__

${langInstruction[lang] || langInstruction.en}

Be friendly and helpful. When users ask about a destination, describe the top tourist places with short highlights. Explain that we provide customized vehicles. Always direct to WhatsApp for booking. Keep responses under 100 words.`;
}

// ─── Language detection ──────────────────────────────────────────────────
function detectLanguage(text: string): string {
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  const hindiKw = ['kitna', 'kitne', 'kaise', 'kahaan', 'hai', 'hoga', 'chahiye'];
  if (hindiKw.filter(k => text.toLowerCase().includes(k)).length >= 2) return 'hi';
  return 'en';
}

// ─── WhatsApp formatting ────────────────────────────────────────────────
function toWhatsAppFormat(text: string): string {
  let formatted = text.replace(/\*\*(.+?)\*\*/g, '*$1*');
  formatted = formatted.replace(/^#{1,6}\s/gm, '');
  return formatted;
}

// ─── POST handler ────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { messages, language, mode } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastUserMsg = messages.filter((m: { role: string }) => m.role === 'user').pop();
    const userText = lastUserMsg?.content || '';
    const lang = language || detectLanguage(userText);

    let reply: string | null = null;

    // Try AI API first
    try {
      const zai = await ZAI.create();
      const systemPrompt = getSystemPrompt(lang);
      const chatMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.slice(-10).map((msg: { role: string; content: string }) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        })),
      ];

      const completion = await zai.chat.completions.create({
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 250,
      });

      reply = completion.choices[0]?.message?.content?.trim();
    } catch (aiError) {
      console.log('AI API unavailable, using fallback');
    }

    // Fallback
    if (!reply) {
      const fallbacks: Record<string, Record<string, string>> = {
        en: {
          default: "I can help with trips, vehicles, destinations! 🚗 For custom quotations, WhatsApp us at **+91 91085 97154**.",
        },
        hi: { default: "मैं ट्रिप, वाहन, डेस्टिनेशन में मदद कर सकता हूं! 🚗 WhatsApp करें: **+91 91085 97154**" },
        kn: { default: "ಪ್ರವಾಸ, ವಾಹನ, ಸ್ಥಳಗಳ ಬಗ್ಗೆ ಸಹಾಯ ಮಾಡಬಹುದು! 🚗 WhatsApp: **+91 91085 97154**" },
        ta: { default: "பயணம், வாகனம் பற்றி உதவ முடியும்! 🚗 WhatsApp: **+91 91085 97154**" },
        ml: { default: "ട്രിപ്പ്, വാഹനം വഴി സഹായിക്കാം! 🚗 WhatsApp: **+91 91085 97154**" },
      };
      reply = (fallbacks[lang] || fallbacks.en).default;
    }

    if (mode === 'whatsapp') {
      reply = toWhatsAppFormat(reply);
    }

    return NextResponse.json({ reply, detectedLanguage: lang });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { reply: "I'm sorry, something went wrong. Please WhatsApp us at **+91 91085 97154**.", detectedLanguage: 'en' },
      { status: 200 }
    );
  }
}
