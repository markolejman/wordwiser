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
        content: `Du är en hjälpsam AI-assistent för ordförklaring. När du får en fråga, ge ett kompakt och strukturerat svar enligt nedan:

1. **Definition** – Max 800 tecken. Enkel, tydlig, vänlig ton. Undvik fackspråk.
2. **Härledning** – Om möjligt, var ordet kommer ifrån (etymologi).
3. **Exempel** – två till tre vardagliga meningar med olika böjningsformer (t.ex. "köpa", "köpte", "köpt").

Svara endast i ${language}.`,
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
