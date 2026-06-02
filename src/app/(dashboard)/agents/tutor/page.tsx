"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, Bot, User, FileText } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remarkGfm";
import { useAuth } from "@/lib/useAuth";
import { saveAgentData, updateAgentData } from "@/lib/db";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function TutorAgentPage() {
  const { user } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hello! I am your AI Tutor. I specialize in explaining difficult concepts using real-world analogies. What would you like to learn today?" }
  ]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsProcessing(true);

    try {
      const res = await fetch("/api/agents/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass the entire message history and the optional context
        body: JSON.stringify({ messages: newMessages, context }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to generate response");
      
      const newModelMessage: Message = { role: "model", content: data.reply };
      const updatedMessages = [...newMessages, newModelMessage];
      setMessages(updatedMessages);
      
      if (user) {
        try {
          if (!chatId) {
            const id = await saveAgentData("chats", user.uid, {
              messages: updatedMessages,
              context
            });
            setChatId(id);
          } else {
            await updateAgentData("chats", chatId, {
              messages: updatedMessages,
            });
          }
        } catch (e) {
          console.error("Failed to sync chat to database", e);
        }
      }
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto h-[85vh] flex flex-col">
      <div className="flex items-center gap-4 mb-2 shrink-0">
        <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
          <MessageSquare className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Tutor Agent</h1>
          <p className="text-gray-400 text-sm">Chat with an expert professor. Explanations with analogies and conceptual checks.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left Side: Context / Document Area (Pseudo-RAG) */}
        <div className="w-1/3 bg-[#161B29]/80 backdrop-blur-xl rounded-2xl border border-white/5 flex flex-col hidden lg:flex">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-white text-sm">Study Material Context</h3>
          </div>
          <div className="p-4 flex-1">
            <textarea 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Paste lecture notes, textbook chapters, or specific context here. The Tutor Agent will use this knowledge base to answer your questions..."
              className="w-full h-full bg-[#0B0F19] border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-purple-500 resize-none custom-scrollbar"
            />
          </div>
        </div>

        {/* Right Side: Chat UI */}
        <div className="flex-1 bg-[#161B29]/80 backdrop-blur-xl rounded-2xl border border-white/5 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-50 pointer-events-none" />
          
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6 relative z-10">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-purple-600 text-white shadow-lg' : 'bg-[#0B0F19] border border-white/10 text-gray-200'}`}>
                   {msg.role === 'user' ? (
                     <p className="whitespace-pre-wrap">{msg.content}</p>
                   ) : (
                     <div className="prose prose-invert prose-purple max-w-none text-sm">
                       <ReactMarkdown remarkPlugins={[remarkGfm]}>
                         {msg.content}
                       </ReactMarkdown>
                     </div>
                   )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-purple-400" />
                </div>
                <div className="bg-[#0B0F19] border border-white/10 rounded-2xl p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-[#0B0F19] border-t border-white/5 relative z-10">
            <form onSubmit={handleSend} className="flex items-end gap-2">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Ask your tutor a question..."
                className="flex-1 bg-[#121622] border border-white/10 rounded-xl p-3 max-h-32 text-sm text-white focus:outline-none focus:border-purple-500 resize-none custom-scrollbar"
                rows={1}
              />
              <button 
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="p-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white rounded-xl transition-colors shadow-lg disabled:shadow-none shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
