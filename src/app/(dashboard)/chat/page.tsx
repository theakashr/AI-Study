"use client";

import { useState } from "react";
import { Send, User, Bot, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  sources?: string[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      content: "Hello! I am your AI Tutor. I've analyzed your uploaded PDF. Ask me any concept you find difficult!",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsLoading(true);

    // Mock API call to TutorAgent
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: "That's a great question! Based on chapter 4, the mitochondria is the powerhouse of the cell because it generates most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
          sources: ["Chapter 4, Page 42", "Chapter 4, Page 45"]
        }
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar - Conversation History */}
      <div className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <Link href="/dashboard" className="text-primary font-bold hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>
        <div className="p-4 font-semibold text-muted-foreground uppercase text-xs">Recent Chats</div>
        <div className="flex-1 overflow-y-auto px-2 space-y-2">
          {["Biology Midterm Notes", "History Chapter 2", "Physics Formulas"].map((chat, idx) => (
            <button key={idx} className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary/20 truncate text-sm">
              {chat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-4 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-bold text-lg">Biology Midterm Notes <span className="text-sm font-normal text-muted-foreground ml-2">PDF Context Active</span></h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-primary-foreground"}`}>
                {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`space-y-2 ${msg.role === "user" ? "text-right" : ""}`}>
                <div className={`px-4 py-3 rounded-2xl inline-block text-left ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm shadow-sm"}`}>
                  {msg.content}
                </div>
                {msg.sources && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {msg.sources.map((src, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-md">
                        <BookOpen size={12} /> {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-3xl mx-auto">
              <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 bg-accent text-primary-foreground">
                <Bot size={18} />
              </div>
              <div className="px-4 py-3 rounded-2xl inline-block bg-card border border-border rounded-tl-sm shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-border">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the material..."
              className="w-full pl-4 pr-12 py-3 border border-border rounded-xl bg-input focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition-all"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-2">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
