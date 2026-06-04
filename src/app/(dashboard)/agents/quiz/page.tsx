"use client";

import { useState, useRef } from "react";
import { Zap, Loader2, PlayCircle, CheckCircle2, XCircle, Upload, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/useAuth";
import { saveAgentData } from "@/lib/db";

interface QuizQuestion {
  type: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function QuizAgentPage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [quizStatus, setQuizStatus] = useState<"empty" | "active" | "results">("empty");
  const [score, setScore] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 4 * 1024 * 1024) {
        toast.error("File is too large. Please upload a PDF under 4MB.");
        return;
      }
      setFile(selectedFile);
      setTopic(""); // Clear topic if file selected
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type !== "application/pdf" && !droppedFile.name.endsWith('.pdf')) {
        toast.error("Please upload a PDF file.");
        return;
      }
      if (droppedFile.size > 4 * 1024 * 1024) {
        toast.error("File is too large. Please upload a PDF under 4MB.");
        return;
      }
      setFile(droppedFile);
      setTopic("");
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim() && !file) {
      toast.error("Please enter a topic or upload a PDF");
      return;
    }

    setIsGenerating(true);
    setQuizStatus("empty");
    
    const formData = new FormData();
    if (topic) formData.append("topic", topic);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("/api/agents/quiz", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to generate quiz");
      
      setQuizData(data.quiz);
      setQuizStatus("active");
      setSelectedAnswers({});
      toast.success("Quiz generated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const isAnswerCorrect = (q: QuizQuestion, selectedIdx: number | undefined) => {
    if (selectedIdx === undefined) return false;
    const selectedText = q.options[selectedIdx];
    if (selectedText === q.answer) return true;
    
    const letters = ["A", "B", "C", "D"];
    if (letters.includes(q.answer)) {
      return letters.indexOf(q.answer) === selectedIdx;
    }
    
    if (q.answer.includes(selectedText) || selectedText.includes(q.answer)) return true;
    return false;
  };

  const handleSubmitQuiz = async () => {
    let calculatedScore = 0;
    quizData.forEach((q, idx) => {
      if (isAnswerCorrect(q, selectedAnswers[idx])) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setQuizStatus("results");
    
    if (user) {
      try {
        await saveAgentData("quizzes", user.uid, {
          topic: file ? file.name : topic,
          score: calculatedScore,
          total: quizData.length,
          quizData
        });
      } catch(e) {
        console.error("Failed to save quiz to database:", e);
      }
    }
  };

  const resetQuiz = () => {
    setQuizStatus("empty");
    setTopic("");
    setFile(null);
    setQuizData([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Quiz Agent</h1>
            <p className="text-gray-400 text-sm">Generate targeted MCQs to evaluate your understanding instantly.</p>
          </div>
        </div>

        {quizStatus === "empty" && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                className={`h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all cursor-pointer group
                  ${isDragging ? 'border-yellow-400 bg-yellow-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-500/50'}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileSelect} 
                  accept=".pdf"
                />
                <Upload className={`w-10 h-10 mb-3 transition-colors ${isDragging ? 'text-yellow-400' : 'text-gray-500 group-hover:text-yellow-400'}`} />
                <p className={`font-medium ${isDragging ? 'text-yellow-400' : 'text-white'}`}>
                  {isDragging ? 'Drop PDF to generate' : 'Drag & Drop PDF Here'}
                </p>
              </div>

              {file && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-yellow-400 shrink-0" />
                    <p className="text-white text-sm truncate">{file.name}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-gray-400 hover:text-white">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center space-y-6 bg-white/5 border border-white/10 p-8 rounded-xl h-48">
              <div className="flex items-center justify-center gap-4 text-gray-400 mb-2">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-sm font-medium uppercase tracking-wider">OR</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => { setTopic(e.target.value); setFile(null); }}
                placeholder="Type a topic (e.g. History, Math)"
                className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500 transition-colors text-center"
              />
            </div>

            <div className="md:col-span-2 flex justify-center mt-4">
              <button 
                onClick={() => handleGenerate()}
                disabled={isGenerating || (!topic && !file)}
                className="px-10 py-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-500/50 text-black font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(234,179,8,0.4)] disabled:shadow-none flex items-center gap-2 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating 20 Questions...
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-6 h-6" />
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {quizStatus === "active" && (
          <div className="relative z-10 space-y-8">
            {quizData.map((q, qIdx) => (
              <div key={qIdx} className="bg-[#121622]/90 border border-white/10 rounded-xl p-6">
                <p className="text-yellow-400 font-semibold mb-2 text-sm">Question {qIdx + 1} of {quizData.length}</p>
                <h3 className="text-lg font-medium text-white mb-4">{q.question}</h3>
                <div className="space-y-3">
                  {q.options.map((opt, oIdx) => (
                    <label 
                      key={oIdx} 
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedAnswers[qIdx] === oIdx ? 'bg-yellow-500/10 border-yellow-500/50 text-white' : 'bg-[#0B0F19] border-white/5 text-gray-300 hover:border-white/20'}`}
                    >
                      <input 
                        type="radio" 
                        name={`question-${qIdx}`} 
                        value={oIdx}
                        checked={selectedAnswers[qIdx] === oIdx}
                        onChange={() => handleSelectOption(qIdx, oIdx)}
                        className="w-4 h-4 text-yellow-500 bg-gray-800 border-gray-600 focus:ring-yellow-500 focus:ring-offset-gray-900"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSubmitQuiz}
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(234,179,8,0.4)]"
              >
                Submit Answers
              </button>
            </div>
          </div>
        )}

        {quizStatus === "results" && (
          <div className="relative z-10 flex flex-col items-center justify-center p-8 border border-white/10 rounded-xl bg-white/5 text-center">
            <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mb-6 text-3xl font-bold border-yellow-500 text-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
              {score}/{quizData.length}
            </div>
            <h2 className="text-2xl font-bold text-white mb-8">Quiz Completed!</h2>
            
            <div className="w-full space-y-6 mb-8 text-left">
               {quizData.map((q, idx) => {
                 const isCorrect = isAnswerCorrect(q, selectedAnswers[idx]);
                 return (
                  <div key={idx} className={`p-6 rounded-xl border ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                    <div className="flex items-start gap-4">
                      {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> : <XCircle className="w-6 h-6 text-red-400 shrink-0" />}
                      <div className="flex-1">
                        <p className="text-white font-medium mb-3">{q.question}</p>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-sm">
                            <span className="text-gray-400">Your answer: </span>
                            <span className={isCorrect ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>
                              {selectedAnswers[idx] !== undefined ? q.options[selectedAnswers[idx]] : "Not Answered"}
                            </span>
                          </p>
                          {!isCorrect && (
                             <p className="text-sm">
                               <span className="text-gray-400">Correct answer: </span>
                               <span className="text-emerald-400 font-medium">{q.answer}</span>
                             </p>
                          )}
                        </div>

                        <div className="p-4 bg-[#0B0F19] rounded-lg border border-white/5">
                          <p className="text-xs text-yellow-500 font-semibold mb-1 uppercase tracking-wider">Explanation</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                 )
               })}
            </div>

            <button 
              onClick={resetQuiz}
              className="px-8 py-3 border border-white/20 hover:bg-white/5 text-white font-medium rounded-xl transition-colors"
            >
              Take Another Quiz
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
