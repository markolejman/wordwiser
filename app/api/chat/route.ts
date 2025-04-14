import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, language } = await req.json(); // ← get the language

  console.log("Language:", language); // ← log the language

  const updatedMessages = [
    ...messages,
    {
      role: "system",
      content: `Ordet som användaren ger som input ska du förklara. Ge alla definitioner på ordet på det språket som användaren vill ha det i - enkla och koncisa uppdelade i sektioner och numrerade. Returnera i språket av ${language}. Till varje definition, ge ett exempelmening på hur man kan använda den ordet till den definitionen. Få även med härledningen till ordet om det finns tillgängligt - etymologi till ordet - varifrån kommer ordet. Det viktigaste av allt är att du returnerar allt i otroligt enkel språk - inga svåra ord och till och med en tio åring ska kunna förstå språket.
På slutet, uppmana användaren att göra egna meningar med alla olika definitoner.
Om det finns något annat intressant som är unikt med ordet, ge det också.
Allting ska ges med väldigt enkla ord - ingen jargong och håll det så kort du kan.
If there is a proper emoji for that word, add it to the end just for fun.`,
    },
  ];

  const result = streamText({
    model: openai("gpt-4-turbo"),
    messages: updatedMessages,
  });

  return result.toDataStreamResponse();
}
