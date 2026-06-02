"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Brain, Clock, Zap, MessageSquare, Target } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-border bg-background/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary flex items-center gap-2">
            <Brain className="w-8 h-8" /> <span>StudyAI</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 rounded-lg font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] -z-10" />
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
        >
          Supercharge your learning with <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            AI-Powered Intelligence
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Upload your PDFs and let our 7 specialized AI agents generate summaries, quizzes, flashcards, and study plans instantly. 
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/login" className="px-8 py-4 bg-primary text-primary-foreground text-lg rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(79,70,229,0.5)]">
            Start Learning for Free
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">7 Autonomous Agents at Your Service</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: BookOpen, title: "Summary Agent", desc: "Instantly extracts chapter-wise summaries and exam-oriented notes." },
            { icon: MessageSquare, title: "Tutor Agent", desc: "Explains difficult concepts with examples and citations." },
            { icon: Zap, title: "Quiz Agent", desc: "Generates custom MCQs and Short Answers for instant evaluation." },
            { icon: Target, title: "Flashcard Agent", desc: "Creates Q&A pairs for active recall and tracks retention." },
            { icon: Clock, title: "Study Planner", desc: "Generates optimal daily schedules and revision reminders." },
            { icon: Brain, title: "Voice Agent", desc: "Hands-free learning with Speech-to-Text and Text-to-Speech." }
          ].map((feature, idx) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={idx} 
              className="p-6 rounded-2xl bg-card border border-border backdrop-blur-xl shadow-lg hover:border-primary/50 transition-colors"
            >
              <feature.icon className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} StudyAI. Built with Next.js 15, Firebase, and Gemini.</p>
      </footer>
    </div>
  );
}
