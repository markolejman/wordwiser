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

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-blue-50">
      <Card className="w-full h-[90vh] flex flex-col">
        <CardHeader className="border-b bg-blue-100">
          <div className="flex items-center justify-center gap-4">
            <img src="/wisewords.png" alt="Word Wiser Logo" draggable="false" className="h-12" />
            <CardTitle className="text-xl">
              Word Wiser | AI Dictionary
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-lg">Type a word to get started...</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-userbubble text-userbubble-foreground"
                      : "bg-muted text-black"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
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
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-userbubble text-userbubble-foreground hover:bg-slate-300"
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
