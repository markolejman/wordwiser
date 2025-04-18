"use client";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";

/**
 * ChatInterface component renders a chat-based interface for interacting with an AI-powered dictionary.
 *
 * @component
 *
 * @description
 * This component provides a user-friendly interface for querying word definitions in multiple languages.
 * It includes a chat-like UI where users can input words, select a language, and view responses from the AI.
 * The chat scrolls smoothly to the latest message, and the language selection dynamically updates the backend query.
 *
 * @returns {JSX.Element} The rendered ChatInterface component.
 *
 * @example
 * ```tsx
 * import ChatInterface from './path/to/ChatInterface';
 *
 * function App() {
 *   return <ChatInterface />;
 * }
 * ```
 *
 * @remarks
 * - The default language is set to Swedish ("svenska").
 * - The `useChat` hook is used to manage chat state and interactions.
 * - The `bottomRef` ensures smooth scrolling to the latest message.
 * - The component uses Tailwind CSS for styling.
 *
 * @dependencies
 * - `useState`, `useEffect`, `useRef` from React.
 * - `useChat` custom hook for managing chat logic.
 * - `ReactMarkdown` for rendering markdown content in messages.
 * - Tailwind CSS for styling.
 *
 * @internalComponents
 * - `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` for layout.
 * - `Input`, `Button` for user input and actions.
 * - `Send` icon for the submit button.
 *
 * @props None
 */
export default function ChatInterface() {
  // This sets the language to Swedish by default
  const [language, setLanguage] = useState("svenska");

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
  useChat({
    body: { language }, // ← explicitly pass language to backend
  });

  // This creates a smooth scroll to the bottom of the chat
  // when new messages are added
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Card className="w-screen h-screen flex flex-col">
        <CardHeader className="border-b bg-blue-50">
          <div className="flex items-center justify-center gap-4">
            <img
              src="/wisewords.png"
              alt="Word Wiser Logo"
              draggable="false"
              className="h-10"
            />
            <CardTitle className="text-xl">
              Word Wiser | AI Dictionary | {language.charAt(0).toUpperCase() + language.slice(1)}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-lg">Type a word to get started...</p>
            </div>
          ) : (
            messages.map((message: any) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-neutral-700 text-white"
                      : "bg-muted text-black"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type the word you want to know about..."
              disabled={isLoading}
              className="flex-grow"
            />
            <select
              className="border rounded-md p-0.5 bg-blue-50 text-black"
              disabled={isLoading}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="svenska">Svenska</option>
              <option value="english">English</option>
              <option value="suomi">Suomi</option>
            </select>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-100 text-black hover:bg-blue-50"
            >
              <Send className="h-4 w-4 mr-1" />
              Define
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}