"use client";

import { useState } from "react";
import { Target, Loader2, PlayCircle, ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/useAuth";
import { saveAgentData } from "@/lib/db";
import { useCooldown } from "@/hooks/useCooldown";

interface Flashcard {
  front: string;
  back: string;
}

export default function FlashcardAgentPage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [status, setStatus] = useState<"empty" | "active">("empty");
  const { cooldown, startCooldown } = useCooldown();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setStatus("empty");
    try {
      const res = await fetch("/api/agents/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to generate flashcards");
      
      setFlashcards(data.flashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setStatus("active");
      
      if (user) {
        try {
          await saveAgentData("flashcards", user.uid, {
            topic,
            flashcards: data.flashcards
          });
        } catch(e) {
          console.error("Failed to save flashcards to database:", e);
        }
      }

      toast.success("Flashcards generated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
      startCooldown(15);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, flashcards.length - 1));
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }, 150);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden min-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30">
            <Target className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Flashcard Agent</h1>
            <p className="text-gray-400 text-sm">Generate Q&A pairs for spaced repetition and active recall.</p>
          </div>
        </div>

        {status === "empty" && (
          <div className="relative z-10">
            <form onSubmit={handleGenerate} className="flex flex-col items-center justify-center space-y-6 h-64 border-2 border-dashed border-white/10 rounded-xl bg-white/5 p-8">
              <Target className="w-12 h-12 text-gray-500 opacity-50" />
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g. Cranial Nerves, React Hooks)"
                className="w-full max-w-md px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors text-center"
                required
              />
              <button 
                type="submit"
                disabled={isGenerating || cooldown > 0}
                className="px-8 py-3 bg-red-500 hover:bg-red-400 disabled:bg-red-500/50 text-white font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:shadow-none flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Cards...
                  </>
                ) : cooldown > 0 ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Cooldown ({cooldown}s)
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Generate Flashcards
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {status === "active" && flashcards.length > 0 && (
          <div className="relative z-10 flex flex-col items-center mt-12">
            <p className="text-red-400 font-semibold mb-6">Card {currentIndex + 1} of {flashcards.length}</p>

            {/* 3D Flip Card */}
            <div 
              className="w-full max-w-2xl h-80 cursor-pointer"
              style={{ perspective: "1000px" }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div 
                className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
              >
                {/* Front */}
                <div className="absolute inset-0 bg-[#121622] border-2 border-white/10 hover:border-red-500/30 rounded-2xl flex flex-col items-center justify-center p-8 shadow-2xl [backface-visibility:hidden]">
                  <p className="text-gray-400 text-sm mb-4 uppercase tracking-widest font-semibold">Question</p>
                  <h3 className="text-2xl font-bold text-white text-center leading-relaxed">{flashcards[currentIndex].front}</h3>
                  <p className="absolute bottom-6 text-gray-500 text-sm flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Click to flip
                  </p>
                </div>

                {/* Back */}
                <div className="absolute inset-0 bg-red-500/10 border-2 border-red-500/30 rounded-2xl flex flex-col items-center justify-center p-8 shadow-[0_0_30px_rgba(239,68,68,0.1)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                   <p className="text-red-400 text-sm mb-4 uppercase tracking-widest font-semibold">Answer</p>
                   <h3 className="text-xl font-medium text-white text-center leading-relaxed">{flashcards[currentIndex].back}</h3>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-6 mt-12">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => {
                  setStatus("empty");
                  setTopic("");
                }}
                className="px-6 py-2 border border-white/20 hover:bg-white/5 text-white text-sm font-medium rounded-lg transition-colors"
              >
                New Deck
              </button>

              <button 
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                className="p-3 rounded-full bg-red-500 hover:bg-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:shadow-none"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
