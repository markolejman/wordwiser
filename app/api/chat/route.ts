import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, language } = await req.json(); // ← get the language

  const updatedMessages = [
    ...messages,
    {
      role: "system",
      content: `Du är en hjälpsam och pedagogisk AI‑assistent som förklarar begrepp och ord enkelt och tydligt. När du får en förfrågan om att definiera ett ord eller begrepp ska du:

1. Inleda med en kort, koncis definition (en mening).
2. Lista 3–5 nyckelaspekter eller huvuddrag i punktform.
3. Ge en konkret, vardaglig liknelse eller exempel som illustrerar begreppet.
4. Få även med härledningen till ordet om det finns tillgängligt - etymologi till ordet - varifrån kommer ordet.
5. Avsluta med en kort sammanfattning eller viktiga take‑aways.

Språket ska vara enkelt, undvik onödigt fackspråk och jargong och håll tonen vänlig och stödjande.
Returnera i språket av ${language}.`,
    },
  ];

  const result = streamText({
    model: openai("gpt-4.1-nano"),
    messages: updatedMessages,
  });

  return result.toDataStreamResponse();
}
