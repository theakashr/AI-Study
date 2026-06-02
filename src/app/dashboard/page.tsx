"use client";

import { Flame, BookOpen, FileText, CheckCircle2, MessageSquare, Zap, Target, Clock, Brain } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot } from "recharts";

export default function DashboardPage() {
  const chartData = [
    { day: "Mon 12", hours: 2, quizzes: 1.5 },
    { day: "Tue 13", hours: 4, quizzes: 3 },
    { day: "Wed 14", hours: 3.5, quizzes: 2.5 },
    { day: "Thu 15", hours: 5, quizzes: 4 },
    { day: "Fri 16", hours: 7.2, quizzes: 6.5 },
    { day: "Sat 17", hours: 4.5, quizzes: 3.5 },
    { day: "Sun 18", hours: 8, quizzes: 6 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2A2E3D]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-xl text-center">
          <p className="text-white text-sm">{label.split(" ")[0]}: {payload[0].value} Hrs</p>
          <p className="text-gray-300 text-xs">94%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/30 shadow-[0_0_25px_rgba(79,70,229,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
              <Flame className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-sm font-medium text-gray-300 mt-1">Study Streak</div>
          </div>
          <div className="relative z-10 mt-6">
            <h3 className="text-4xl font-bold text-white mb-2">14 Days</h3>
            <p className="text-sm text-indigo-400 font-medium">+2 today</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-50" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-sm font-medium text-gray-300 mt-1 leading-tight">Topics<br/>Completed</div>
          </div>
          <div className="relative z-10 mt-4">
            <h3 className="text-4xl font-bold text-white mb-2">38 Topics</h3>
            <p className="text-sm text-purple-400 font-medium">6 this week</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-sm font-medium text-gray-300 mt-1">PDFs Uploaded</div>
          </div>
          <div className="relative z-10 mt-6">
            <h3 className="text-4xl font-bold text-white mb-2">52 Files</h3>
            <p className="text-sm text-cyan-400 font-medium">8 newly indexed</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-sm font-medium text-gray-300 mt-1">Quiz Score</div>
          </div>
          <div className="relative z-10 mt-6">
            <h3 className="text-4xl font-bold text-white mb-2">92%</h3>
            <p className="text-sm text-emerald-400 font-medium">+4% avg</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="col-span-2 bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Weekly Study Progress</h2>
              <p className="text-gray-400 text-sm mt-1">Hours Studied vs Quizzes</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">Mon 12</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">Sun 18 Aug</span>
            </div>
          </div>
          
          <div className="h-72 mt-8 -ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(val) => `${val} Hrs`} dx={-10} domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="hours" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" activeDot={{r: 6, fill: "#fff", stroke: "#4f46e5", strokeWidth: 2}} />
                <Area type="monotone" dataKey="quizzes" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorQuizzes)" activeDot={{r: 6, fill: "#fff", stroke: "#a855f7", strokeWidth: 2}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="col-span-1 bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
          <h2 className="text-xl font-bold text-white tracking-wide mb-6">AI Study<br/>Recommendations</h2>
          
          <div className="space-y-4">
            {/* Rec 1 */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 relative overflow-hidden group hover:bg-purple-500/20 transition-colors cursor-pointer">
              <div className="absolute left-0 top-0 w-1 h-full bg-purple-500 shadow-[0_0_10px_#A855F7]" />
              <p className="text-xs text-gray-400 mb-1">1. Review</p>
              <h4 className="text-sm font-medium text-white mb-3">Neural Network<br/>Backpropagation</h4>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500 text-white shadow-[0_0_8px_#A855F7]">Purple</span>
                <span className="text-xs text-gray-400">High Priority</span>
              </div>
            </div>

            {/* Rec 2 */}
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 relative overflow-hidden group hover:bg-cyan-500/20 transition-colors cursor-pointer">
              <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_#06B6D4]" />
              <p className="text-xs text-gray-400 mb-1">2. Practice</p>
              <h4 className="text-sm font-medium text-white mb-3">Data Structures: Graphs</h4>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500 text-white shadow-[0_0_8px_#06B6D4]">Cyan</span>
                <span className="text-xs text-gray-400">15 min</span>
              </div>
            </div>

            {/* Rec 3 */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 relative overflow-hidden group hover:bg-indigo-500/20 transition-colors cursor-pointer">
              <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500 shadow-[0_0_10px_#4F46E5]" />
              <p className="text-xs text-gray-400 mb-1">3. Next Quiz</p>
              <h4 className="text-sm font-medium text-white mb-3">Operating Systems Basics</h4>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white shadow-[0_0_8px_#4F46E5]">Indigo</span>
                <span className="text-xs text-gray-400">Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: 7 Autonomous Agents Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center text-white tracking-wide mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          7 Autonomous Agents at Your Service
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              icon: BookOpen, 
              title: "Summary Agent", 
              desc: "Instantly extracts chapter-wise summaries and exam-oriented notes.",
              color: "text-blue-400",
              border: "group-hover:border-blue-500/50",
              shadow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            },
            { 
              icon: MessageSquare, 
              title: "Tutor Agent", 
              desc: "Explains difficult concepts with examples and citations.",
              color: "text-purple-400",
              border: "group-hover:border-purple-500/50",
              shadow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            },
            { 
              icon: Zap, 
              title: "Quiz Agent", 
              desc: "Generates custom MCQs and Short Answers for instant evaluation.",
              color: "text-yellow-400",
              border: "group-hover:border-yellow-500/50",
              shadow: "group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            },
            { 
              icon: Target, 
              title: "Flashcard Agent", 
              desc: "Creates Q&A pairs for active recall and tracks retention.",
              color: "text-red-400",
              border: "group-hover:border-red-500/50",
              shadow: "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            },
            { 
              icon: Clock, 
              title: "Study Planner", 
              desc: "Generates optimal daily schedules and revision reminders.",
              color: "text-emerald-400",
              border: "group-hover:border-emerald-500/50",
              shadow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            },
            { 
              icon: Brain, 
              title: "Voice Agent", 
              desc: "Hands-free learning with Speech-to-Text and Text-to-Speech.",
              color: "text-cyan-400",
              border: "group-hover:border-cyan-500/50",
              shadow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            }
          ].map((agent, idx) => (
            <div 
              key={idx}
              className={`group p-6 rounded-2xl bg-[#161B29]/80 backdrop-blur-xl border border-white/5 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${agent.border} ${agent.shadow} relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <agent.icon className={`w-8 h-8 mb-4 ${agent.color}`} />
                <h3 className="text-lg font-bold text-white mb-2">{agent.title}</h3>
                <p className="text-sm text-gray-400">{agent.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
