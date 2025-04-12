import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Add additional content to the messages array
  const updatedMessages = [
    ...messages,
    { role: "system", content: "When the user gives a word, define the word and explain the word with no hard words - a ten year old should understand the word. Also give a ethymology of where the word comes from. Give also three examples of where you use the words in a example context. Return the text in the laungage as the word is inputted. If there is a proper emoji for that word, add it to the end." }
  ]

  const result = streamText({
    model: openai("gpt-4-turbo"),
    messages: updatedMessages,
  })

  return result.toDataStreamResponse()
}
