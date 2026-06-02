"use client";

import { useState } from "react";
import { ClipboardList, Loader2, PlayCircle, CheckCircle2, XCircle } from "lucide-react";

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "What is the primary advantage of using React's Virtual DOM?",
    options: [
      "It makes the application completely secure from XSS attacks.",
      "It minimizes direct manipulation of the actual DOM, improving performance.",
      "It automatically writes CSS styles for components.",
      "It replaces the need for a backend database."
    ],
    answer: 1
  },
  {
    id: 2,
    question: "Which hook is used to manage side effects in functional React components?",
    options: [
      "useState",
      "useContext",
      "useEffect",
      "useMemo"
    ],
    answer: 2
  }
];

export default function QuizzesPage() {
  const [quizStatus, setQuizStatus] = useState<"empty" | "generating" | "active" | "results">("empty");
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [score, setScore] = useState(0);

  const handleGenerateQuiz = () => {
    setQuizStatus("generating");
    setTimeout(() => {
      setQuizStatus("active");
    }, 2000);
  };

  const handleSelectOption = (qId: number, oIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: oIdx }));
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    MOCK_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.answer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setQuizStatus("results");
  };

  const resetQuiz = () => {
    setQuizStatus("empty");
    setSelectedAnswers({});
    setScore(0);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <ClipboardList className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">AI Quizzes</h1>
              <p className="text-gray-400 text-sm">Test your knowledge with AI-generated questions.</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {quizStatus === "empty" && (
          <div className="relative z-10 h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-white/5 text-gray-500">
            <ClipboardList className="w-12 h-12 mb-4 opacity-50" />
            <p className="mb-2">No active quizzes right now.</p>
            <p className="text-sm text-gray-400 mb-6 text-center max-w-sm">Upload documents in the Uploads tab, then generate a custom quiz based on your materials.</p>
            <button 
              onClick={handleGenerateQuiz}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Generate Quiz
            </button>
          </div>
        )}

        {/* Generating State */}
        {quizStatus === "generating" && (
          <div className="relative z-10 h-64 flex flex-col items-center justify-center border border-white/10 rounded-xl bg-white/5">
            <Loader2 className="w-12 h-12 mb-4 text-emerald-400 animate-spin" />
            <p className="text-white font-medium mb-2">AI is analyzing your documents...</p>
            <p className="text-sm text-gray-400">Crafting personalized questions.</p>
          </div>
        )}

        {/* Active Quiz State */}
        {quizStatus === "active" && (
          <div className="relative z-10 space-y-8">
            {MOCK_QUESTIONS.map((q, i) => (
              <div key={q.id} className="bg-[#121622]/90 border border-white/10 rounded-xl p-6">
                <p className="text-emerald-400 font-semibold mb-2 text-sm">Question {i + 1} of {MOCK_QUESTIONS.length}</p>
                <h3 className="text-lg font-medium text-white mb-4">{q.question}</h3>
                <div className="space-y-3">
                  {q.options.map((opt, oIdx) => (
                    <label 
                      key={oIdx} 
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedAnswers[q.id] === oIdx ? 'bg-emerald-500/10 border-emerald-500/50 text-white' : 'bg-[#0B0F19] border-white/5 text-gray-300 hover:border-white/20'}`}
                    >
                      <input 
                        type="radio" 
                        name={`question-${q.id}`} 
                        value={oIdx}
                        checked={selectedAnswers[q.id] === oIdx}
                        onChange={() => handleSelectOption(q.id, oIdx)}
                        className="w-4 h-4 text-emerald-500 bg-gray-800 border-gray-600 focus:ring-emerald-500 focus:ring-offset-gray-900"
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
                disabled={Object.keys(selectedAnswers).length < MOCK_QUESTIONS.length}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answers
              </button>
            </div>
          </div>
        )}

        {/* Results State */}
        {quizStatus === "results" && (
          <div className="relative z-10 flex flex-col items-center justify-center p-8 border border-white/10 rounded-xl bg-white/5 text-center">
            <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mb-6 text-3xl font-bold border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              {score}/{MOCK_QUESTIONS.length}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              {score === MOCK_QUESTIONS.length 
                ? "Perfect score! You have completely mastered this material." 
                : "Good effort! Review the modules and try again to improve your score."}
            </p>
            
            <div className="w-full max-w-2xl space-y-4 mb-8 text-left">
               {MOCK_QUESTIONS.map((q) => {
                 const isCorrect = selectedAnswers[q.id] === q.answer;
                 return (
                  <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />}
                      <div>
                        <p className="text-white font-medium mb-1">{q.question}</p>
                        <p className="text-sm text-gray-400">
                          Your answer: <span className={isCorrect ? "text-emerald-400" : "text-red-400"}>{q.options[selectedAnswers[q.id]]}</span>
                        </p>
                        {!isCorrect && (
                           <p className="text-sm text-gray-400 mt-1">
                             Correct answer: <span className="text-emerald-400">{q.options[q.answer]}</span>
                           </p>
                        )}
                      </div>
                    </div>
                  </div>
                 )
               })}
            </div>

            <button 
              onClick={resetQuiz}
              className="px-6 py-2 border border-white/20 hover:bg-white/5 text-white font-medium rounded-lg transition-colors"
            >
              Take Another Quiz
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
