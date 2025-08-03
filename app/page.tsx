"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AiOutlineSearch } from "react-icons/ai";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("svenska");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `🚨 Ett fel inträffade: ${errorMsg}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen pt-safe-t">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="sticky top-0 z-10 border-b bg-blue-50">
          <div className="flex items-center justify-center gap-4">
            <img
              src="/wisewords.png"
              alt="Word Wiser Logo"
              draggable="false"
              className="h-10"
            />
            <CardTitle className="text-xl">
              Word Wiser | AI Dictionary |{" "}
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-lg">
                Type a word, and for a more accurate definition, include a short
                sentence or phrase where the word is used.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 whitespace-pre-wrap break-words ${
                    msg.role === "user"
                      ? "bg-neutral-700 text-white"
                      : "bg-muted text-black"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted px-3 py-2 rounded-lg flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              ref={inputRef}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a word and phrase where the word is used..."
              disabled={isLoading}
              className="flex-grow"
            />
            <select
              className="border rounded-md p-0.5 bg-blue-50 text-black"
              disabled={isLoading}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="svenska">SWE</option>
              <option value="english">ENG</option>
              <option value="suomi">FI</option>
            </select>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-100 text-black hover:bg-blue-50"
            >
              <AiOutlineSearch size={35} color="black" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
