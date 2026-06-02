"use client";

import { useState } from "react";
import { Zap, Loader2, PlayCircle, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

interface QuizQuestion {
  type: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function QuizAgentPage() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [quizStatus, setQuizStatus] = useState<"empty" | "active" | "results">("empty");
  const [score, setScore] = useState(0);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setQuizStatus("empty");
    try {
      const res = await fetch("/api/agents/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
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

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    quizData.forEach((q, idx) => {
      if (q.options[selectedAnswers[idx]] === q.answer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setQuizStatus("results");
  };

  const resetQuiz = () => {
    setQuizStatus("empty");
    setTopic("");
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
          <div className="relative z-10">
            <form onSubmit={handleGenerate} className="flex flex-col items-center justify-center space-y-6 h-64 border-2 border-dashed border-white/10 rounded-xl bg-white/5 p-8">
              <Zap className="w-12 h-12 text-gray-500 opacity-50" />
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g. Quantum Computing, OOP in Java)"
                className="w-full max-w-md px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500 transition-colors text-center"
                required
              />
              <button 
                type="submit"
                disabled={isGenerating}
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-500/50 text-black font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(234,179,8,0.4)] disabled:shadow-none flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Generate Quiz
                  </>
                )}
              </button>
            </form>
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
                disabled={Object.keys(selectedAnswers).length < quizData.length}
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(234,179,8,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
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
                 const isCorrect = q.options[selectedAnswers[idx]] === q.answer;
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
                              {q.options[selectedAnswers[idx]]}
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
