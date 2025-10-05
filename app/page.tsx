"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import { AiOutlineSearch } from "react-icons/ai";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("swe");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ✅ iOS Safari height fix
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

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
          content: `Ett fel inträffade: ${errorMsg}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  function normalizeMarkdown(text: string): string {
    return text
      .replace(/\*\*Exempel:\*\:\s*\n+/g, "**Exempel:**\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return (
    <div
      className="flex flex-col w-screen"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }} // ✅ fixad höjd
    >
      {/* Header */}
      <header className="shrink-0 border-b bg-white z-10">
        <div className="flex items-center justify-center gap-4 p-4">
          <img
            src="/wisewords.png"
            alt="WordWiser Logo"
            draggable="false"
            className="h-10"
          />
          <h1 className="text-xl font-semibold">
            WordWiser | AI powered Dictionary | {language.toUpperCase()}
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center min-h-[150px] text-gray-500">
            <p className="text-lg text-center">
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
                className={`max-w-[70%] p-4 whitespace-pre-wrap break-words ${
                  msg.role === "user" ? "text-white" : "text-black"
                }`}
                style={
                  msg.role === "assistant"
                    ? {
                        background: "rgba(255, 255, 255, 0.75)",
                        backdropFilter: "blur(6px)",
                        borderRadius: "16px",
                        padding: "1rem",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                      }
                    : {
                        background: "linear-gradient(45deg, #595959, #6a6a6a)",
                        boxShadow:
                          "inset 10px 10px 30px #4d4d4d, inset -10px -10px 30px #757575",
                        borderRadius: "18px",
                      }
                }
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <span>{children}</span>,
                    ul: (props) => (
                      <ul
                        className="list-disc list-inside mt-0 mb-0"
                        {...props}
                      />
                    ),
                  }}
                >
                  {normalizeMarkdown(msg.content)}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted/70 backdrop-blur px-3 py-2 rounded-full flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-dot-bounce"></div>
              <div
                className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-dot-bounce"
                style={{ animationDelay: "0.12s" }}
              ></div>
              <div
                className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-dot-bounce"
                style={{ animationDelay: "0.24s" }}
              ></div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t p-4 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl w-full flex items-center gap-2"
        >
          <Input
            value={input}
            ref={inputRef}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            placeholder="Type a word and phrase..."
            disabled={isLoading}
            className="h-12 rounded-full shadow-sm focus-visible:ring-2 focus-visible:ring-sky-400"
          />
          <Select
            value={language}
            onValueChange={setLanguage}
            disabled={isLoading}
          >
            <SelectTrigger className="h-12 w-[92px] rounded-full bg-background/80">
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="swe">SWE</SelectItem>
              <SelectItem value="eng">ENG</SelectItem>
              <SelectItem value="fi">FI</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-600 hover:to-indigo-600"
          >
            <AiOutlineSearch size={22} />
          </Button>
        </form>
      </footer>
    </div>
  );
}
