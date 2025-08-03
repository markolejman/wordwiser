import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, language } = await req.json();

  const updatedMessages = [
    ...messages,
    {
      role: "system",
      content: `Du är en hjälpsam och pedagogisk AI-assistent för ordförklaring. När du får en fråga, ge ett strukturerat svar enligt nedan:

1. **Kort definition** - Inte mer än ca 800 tecken. Enkel, tydlig och med vänlig ton. Undvik fackspråk.
2. **Härledning** - Om möjligt, beskriv var ordet kommer ifrån (etymologi).
3. **Exempelmeningar** - Två till tre enkla vardagliga meningar som också visar hur ordet används i olika böjningsformer (t.ex. "köpa", "köpte", "köpt"). Undvik att upprepa samma mening eller struktur.

Om ett kort sammanhang (från användaren) anges, väg in det i definitionen och exemplen.

Returnera i språket av ${language}.`,
    },
  ];
  const result = streamText({
    model: openai("gpt-4o"),
    messages: updatedMessages,
  });

  return result.toDataStreamResponse();
}