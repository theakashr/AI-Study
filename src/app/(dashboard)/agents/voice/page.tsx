"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, Mic, MicOff, Volume2, Loader2, Square } from "lucide-react";
import toast from "react-hot-toast";

export default function VoiceAgentPage() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          if (event.error !== "no-speech") {
             toast.error("Microphone error: " + event.error);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setResponse("");
      if (synthesisRef.current) synthesisRef.current.cancel(); // Stop playing if speaking
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendToAI = async () => {
    if (!transcript.trim()) {
      toast.error("Please say something first.");
      return;
    }

    setIsProcessing(true);
    setResponse("");

    try {
      const res = await fetch("/api/agents/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to process voice");
      
      setResponse(data.reply);
      speakResponse(data.reply);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if (!synthesisRef.current) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Optional: pick a specific voice if desired
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    synthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden min-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
            <Brain className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Voice Agent</h1>
            <p className="text-gray-400 text-sm">Hands-free learning. Talk to your AI tutor out loud.</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center mt-12 space-y-12">
          
          {/* Main Visualizer Bubble */}
          <div className="relative flex items-center justify-center w-48 h-48">
            {/* Pulsing rings when listening or playing */}
            {(isListening || isPlaying) && (
              <>
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping opacity-75" />
                <div className="absolute inset-4 bg-cyan-500/30 rounded-full animate-pulse opacity-75" />
              </>
            )}

            <button
              onClick={toggleListening}
              className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isListening ? 'bg-red-500 hover:bg-red-400 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]'}`}
            >
               {isListening ? <MicOff className="w-12 h-12 text-white" /> : <Mic className="w-12 h-12 text-white" />}
            </button>
          </div>

          <div className="w-full max-w-2xl text-center space-y-6">
            {/* User Transcript */}
            <div className="min-h-[60px] p-4 bg-[#0B0F19] rounded-xl border border-white/5">
              <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">You Said:</p>
              <p className="text-white text-lg font-medium">{transcript || "Click the microphone and start speaking..."}</p>
            </div>

            {/* Action Buttons */}
            {transcript && !isListening && (
               <button 
                 onClick={handleSendToAI}
                 disabled={isProcessing}
                 className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 text-black font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:shadow-none inline-flex items-center gap-2"
               >
                 {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                 {isProcessing ? "Processing..." : "Ask AI"}
               </button>
            )}

            {/* AI Response */}
            {response && (
               <div className="min-h-[100px] p-6 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-left relative group">
                  <p className="text-cyan-400 text-xs mb-3 uppercase tracking-wider flex items-center justify-between">
                    <span>AI Response:</span>
                    {isPlaying && (
                      <button onClick={stopSpeaking} className="text-red-400 hover:text-red-300 flex items-center gap-1">
                        <Square className="w-3 h-3 fill-current" /> Stop Audio
                      </button>
                    )}
                  </p>
                  <p className="text-white text-lg leading-relaxed">{response}</p>
                  
                  {!isPlaying && (
                    <button 
                      onClick={() => speakResponse(response)}
                      className="absolute bottom-4 right-4 p-2 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-full text-cyan-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  )}
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
