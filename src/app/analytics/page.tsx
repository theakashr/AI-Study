"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Activity, Percent, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const learningTrendsData = [
    { subject: "Math", accuracy: 85 },
    { subject: "Physics", accuracy: 70 },
    { subject: "History", accuracy: 95 },
    { subject: "Biology", accuracy: 80 },
    { subject: "Chemistry", accuracy: 65 },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 text-foreground">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">Analytics Center</h1>
          <Link href="/dashboard" className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium shadow-md hover:bg-opacity-90">
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <Clock className="w-10 h-10 text-primary mb-2" />
            <span className="text-3xl font-bold">124</span>
            <span className="text-sm text-muted-foreground">Total Study Hours</span>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <Percent className="w-10 h-10 text-accent mb-2" />
            <span className="text-3xl font-bold">82%</span>
            <span className="text-sm text-muted-foreground">Average Accuracy</span>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <Activity className="w-10 h-10 text-secondary mb-2" />
            <span className="text-3xl font-bold">45</span>
            <span className="text-sm text-muted-foreground">Quizzes Taken</span>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-10 h-10 text-green-500 mb-2" />
            <span className="text-3xl font-bold">+15%</span>
            <span className="text-sm text-muted-foreground">MoM Improvement</span>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Learning Trends (Accuracy by Subject)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={learningTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="subject" stroke="#888888" />
                <YAxis stroke="#888888" domain={[0, 100]} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: "#1e1e2f", borderColor: "#7c3aed" }} />
                <Bar dataKey="accuracy" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
