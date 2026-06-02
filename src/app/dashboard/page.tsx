"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpen, Trophy, Flame, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    streak: 0,
    topics: 0,
    pdfs: 0,
    quizAvg: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (!user) {
        // In a real app we'd redirect, but for UI mockup let's just show zero states
        setLoading(false);
        return;
      }

      try {
        const docsQuery = query(collection(db, "documents"), where("userId", "==", user.uid));
        const docsSnap = await getDocs(docsQuery);
        const pdfCount = docsSnap.size;

        const quizQuery = query(collection(db, "quizResults"), where("userId", "==", user.uid));
        const quizSnap = await getDocs(quizQuery);
        
        let totalScore = 0;
        quizSnap.forEach(doc => {
          const data = doc.data();
          totalScore += (data.score / data.totalQuestions) * 100;
        });
        const quizAvg = quizSnap.size ? Math.round(totalScore / quizSnap.size) : 0;

        setStats({
          streak: 5, // Mocked streak calculation
          topics: 12, // Mocked topics
          pdfs: pdfCount,
          quizAvg
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchStats();
      else router.push("/login");
    });

    return () => unsubscribe();
  }, [router]);

  const mockChartData = [
    { day: "Mon", score: 65 },
    { day: "Tue", score: 70 },
    { day: "Wed", score: 85 },
    { day: "Thu", score: 82 },
    { day: "Fri", score: 90 },
    { day: "Sat", score: 95 },
    { day: "Sun", score: 98 },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 text-foreground">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">Student Dashboard</h1>
          <Link href="/upload" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-md hover:bg-opacity-90">
            Upload New PDF
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <Flame className="w-10 h-10 text-orange-500 mb-2" />
            <span className="text-3xl font-bold">{stats.streak} Days</span>
            <span className="text-sm text-muted-foreground">Study Streak</span>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <BookOpen className="w-10 h-10 text-accent mb-2" />
            <span className="text-3xl font-bold">{stats.topics}</span>
            <span className="text-sm text-muted-foreground">Topics Completed</span>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <FileText className="w-10 h-10 text-secondary mb-2" />
            <span className="text-3xl font-bold">{stats.pdfs}</span>
            <span className="text-sm text-muted-foreground">PDFs Uploaded</span>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <Trophy className="w-10 h-10 text-yellow-500 mb-2" />
            <span className="text-3xl font-bold">{stats.quizAvg}%</span>
            <span className="text-sm text-muted-foreground">Average Quiz Score</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="md:col-span-2 p-6 bg-card border border-border rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Weekly Progress</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <XAxis dataKey="day" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1e2f", borderColor: "#4f46e5" }} />
                  <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: "#4f46e5" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-accent">AI</span> Recommendations
            </h2>
            <div className="space-y-4 flex-1">
              <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                <p className="font-semibold text-secondary mb-1">Focus Area</p>
                <p className="text-sm">Your scores in "Cell Biology" are dipping. Try generating a new quiz.</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="font-semibold text-primary mb-1">Study Planner</p>
                <p className="text-sm">You have 5 days until your physics exam. Start your revision session now.</p>
              </div>
            </div>
            <Link href="/planner" className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-card border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all">
              View Study Plan <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
