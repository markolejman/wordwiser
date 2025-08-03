import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updatedMessages = [
      {
        role: "system",
        content: `Du är en hjälpsam AI-assistent för ordförklaring. När du får en fråga, ge ett strukturerat svar i följande format – utan tomma rader mellan delar:

**Definition:** Kort, tydlig och enkel förklaring på max 800 tecken. Använd bara modern svenska. Inga facktermer. Undvik ålderdomliga eller ovanliga betydelser, även om de förekommer historiskt.  
**Härledning:** Om möjligt, förklara ordets ursprung eller etymologi.
**Exempel:**
- Ge 2–3 korta meningar med olika böjningar av ordet i vardagligt bruk. Punktlista med \`-\`. Inga tomrader.

Svara endast i ${language}, och följ formatet exakt.`,
      },
      ...messages,
    ];

    const result = streamText({
      model: openai("gpt-4o"),
      messages: updatedMessages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
