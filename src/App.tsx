/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Heart, Sparkles, Send, Loader2, Compass, ArrowRight, Quote } from 'lucide-react';
import { getGuidance, GuidanceResponse } from './services/geminiService';
import { cn } from './lib/utils';
import Markdown from 'react-markdown';

export default function App() {
  const [situation, setSituation] = useState('');
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<GuidanceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getGuidance(situation);
      setGuidance(result);
      // Scroll to result after a short delay to allow animation
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError('I encountered an error while seeking wisdom. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-primary text-secondary">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          <div className="grid grid-cols-8 gap-4 p-8">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="h-12 border border-white/10 rounded-full" />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Compass className="w-8 h-8 text-secondary" />
            </div>
          </div>
          <h1 className="serif text-5xl md:text-7xl font-medium mb-4 tracking-tight">
            Nur Guide
          </h1>
          <p className="text-lg md:text-xl opacity-80 font-light max-w-xl mx-auto leading-relaxed">
            Find divine wisdom for your life's journey through the light of Quran and Sunnah.
          </p>
        </motion.div>

        {/* Input Area */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-2xl mt-12 relative z-10 px-4"
        >
          <form onSubmit={handleSubmit} className="relative group">
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Describe your situation or what's on your heart..."
              className="w-full bg-white text-stone-900 rounded-2xl p-6 pr-16 shadow-2xl focus:ring-4 focus:ring-white/20 transition-all min-h-[120px] resize-none text-lg border-none placeholder:text-stone-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={loading || !situation.trim()}
              className="absolute bottom-4 right-4 p-3 bg-primary text-secondary rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </form>
        </motion.div>
      </header>

      {/* Results Section */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-16">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center mb-8"
            >
              {error}
            </motion.div>
          )}

          {guidance ? (
            <motion.div
              key="guidance"
              ref={resultRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Reflection */}
              <section className="relative">
                <div className="absolute -left-4 top-0 text-primary/10">
                  <Quote className="w-24 h-24 rotate-180" />
                </div>
                <div className="relative z-10 pl-8">
                  <h2 className="serif text-3xl font-medium mb-6 flex items-center gap-3 text-primary">
                    <Heart className="w-6 h-6" /> Reflection
                  </h2>
                  <div className="prose prose-stone prose-lg max-w-none italic text-stone-700 leading-relaxed">
                    <Markdown>{guidance.reflection}</Markdown>
                  </div>
                </div>
              </section>

              {/* Quranic Wisdom */}
              <section>
                <h2 className="serif text-3xl font-medium mb-8 flex items-center gap-3 text-primary">
                  <BookOpen className="w-6 h-6" /> Quranic Wisdom
                </h2>
                <div className="grid gap-8">
                  {guidance.quran.map((q, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 group hover:shadow-md transition-shadow"
                    >
                      <div className="text-right mb-6">
                        <p className="serif text-3xl leading-loose text-stone-800 dir-rtl" dir="rtl">
                          {q.arabic}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <p className="text-lg text-stone-700 leading-relaxed">
                          "{q.translation}"
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                          <span className="text-sm font-semibold uppercase tracking-widest text-primary/60">
                            Surah {q.surah} • Ayah {q.ayahNumber}
                          </span>
                        </div>
                        <p className="text-sm text-stone-500 italic bg-stone-50 p-4 rounded-xl">
                          {q.context}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Sunnah (Hadith) */}
              <section>
                <h2 className="serif text-3xl font-medium mb-8 flex items-center gap-3 text-primary">
                  <Sparkles className="w-6 h-6" /> The Sunnah
                </h2>
                <div className="grid gap-8">
                  {guidance.sunnah.map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-stone-900 text-stone-100 p-8 rounded-3xl shadow-xl"
                    >
                      <p className="text-lg leading-relaxed mb-6 font-light">
                        {s.hadith}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-tighter">
                          {s.source}
                        </span>
                        <span className="px-3 py-1 bg-primary/30 rounded-full text-xs font-bold uppercase tracking-tighter text-secondary">
                          {s.grade}
                        </span>
                      </div>
                      <p className="text-sm text-stone-400 border-l-2 border-primary pl-4">
                        {s.explanation}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Practical Steps */}
              <section className="bg-primary/5 p-10 rounded-[3rem] border border-primary/10">
                <h2 className="serif text-3xl font-medium mb-8 flex items-center gap-3 text-primary">
                  <ArrowRight className="w-6 h-6" /> Practical Steps
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {guidance.practicalSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-secondary rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <p className="text-stone-700 leading-snug pt-1">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : !loading && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-block p-6 bg-stone-100 rounded-full mb-6">
                <Search className="w-12 h-12 text-stone-300" />
              </div>
              <h3 className="serif text-2xl text-stone-400">
                Your guidance will appear here
              </h3>
              <p className="text-stone-400 mt-2">
                Share what's on your mind to begin.
              </p>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="serif text-xl text-stone-500 italic">
                Seeking wisdom from the divine sources...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-stone-200 text-center">
        <p className="text-sm text-stone-400 font-light tracking-widest uppercase">
          Nur Guide • Wisdom for the Soul
        </p>
      </footer>
    </div>
  );
}
