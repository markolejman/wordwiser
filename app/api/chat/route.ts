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
      content: `Du är en hjälpsam AI-assistent för ordförklaring. När du får en fråga, ge ett strukturerat svar enligt nedan:

1. **Kort definition** – Max ca 800 tecken. Enkel, tydlig, vänlig ton. Undvik fackspråk.
2. **Härledning** – Om möjligt, var ordet kommer ifrån (etymologi).
3. **Exempelmeningar** – Två enkla vardagliga meningar som visar hur ordet används.

Returnera i språket av ${language}.`,
    },
  ];

  const result = streamText({
    model: openai("gpt-4.1-nano"),
    messages: updatedMessages,
  });

  return result.toDataStreamResponse();
}
