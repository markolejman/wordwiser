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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-blue-50">
      <Card className="w-full h-[90vh] flex flex-col">
        <CardHeader className="border-b bg-blue-100">
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
              className="border rounded-md p-2 bg-white text-black"
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
              <Send className="h-4 w-4 mr-2" />
              Clear word
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}