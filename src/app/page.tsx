'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const MOLECULES = [
  { symbol: 'H₂O', x: '10%', y: '15%', color: '#00d4ff' },
  { symbol: 'CO₂', x: '85%', y: '10%', color: '#7c3aed' },
  { symbol: 'NaCl', x: '5%', y: '70%', color: '#10b981' },
  { symbol: 'H₂SO₄', x: '88%', y: '75%', color: '#f59e0b' },
  { symbol: 'NH₃', x: '50%', y: '5%', color: '#00d4ff' },
  { symbol: 'CH₄', x: '20%', y: '85%', color: '#ef4444' },
];

const STATS = [
  { value: '200+', label: 'Chemicals' },
  { value: '50+', label: 'Experiments' },
  { value: '5', label: 'Grade Levels' },
  { value: 'AI', label: 'Powered Tutor' },
];

const FEATURES = [
  { icon: '🤖', title: 'AI Chemistry Tutor', desc: 'Ask any chemistry question and get instant, accurate explanations.' },
  { icon: '🧬', title: 'Realistic Reactions', desc: 'Scientifically accurate simulation engine with real products.' },
  { icon: '🏆', title: 'Gamification', desc: 'Earn XP, unlock badges, and track your mastery level.' },
  { icon: '📊', title: 'Progress Analytics', desc: 'Track performance across topics, quizzes, and experiments.' },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<'free' | 'curriculum' | null>(null);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen lab-bg relative overflow-hidden">
      {/* Floating molecules */}
      {mounted && MOLECULES.map((mol) => (
        <div key={mol.symbol} className="absolute animate-float pointer-events-none select-none hidden lg:block"
          style={{ left: mol.x, top: mol.y, animationDelay: `${Math.random() * 4}s` }}>
          <span className="text-xs font-mono opacity-20" style={{ color: mol.color }}>{mol.symbol}</span>
        </div>
      ))}

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
            ⚗️
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text-cyan">ChemLab AI</h1>
            <p className="text-xs text-gray-500">Virtual Chemistry Laboratory</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard/student" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">Dashboard</Link>
          <Link href="/free-lab" className="px-4 py-2 rounded-lg text-sm font-medium text-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
            Start Lab
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 pb-8">
        <div className="text-center max-w-3xl animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            AI-Powered Chemistry Education Platform
          </div>

          <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            <span className="gradient-text-cyan">Virtual</span>
            <span className="text-white"> Chemistry</span>
            <br />
            <span className="text-white">Laboratory</span>
          </h2>

          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Perform real chemistry experiments in a safe digital environment.
            Learn through simulation, AI guidance, and interactive quizzes.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold gradient-text-cyan">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Free Laboratory */}
          <Link href="/free-lab" className="block group"
            onMouseEnter={() => setHovered('free')} onMouseLeave={() => setHovered(null)}>
            <div className={`relative p-8 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${hovered === 'free' ? 'scale-[1.02]' : ''}`}
              style={{
                background: 'rgba(0,212,255,0.04)',
                border: `1px solid ${hovered === 'free' ? 'rgba(0,212,255,0.6)' : 'rgba(0,212,255,0.2)'}`,
                boxShadow: hovered === 'free' ? '0 0 30px rgba(0,212,255,0.15)' : 'none',
              }}>
              <div className="relative z-10">
                <div className="text-5xl mb-4">🔭</div>
                <h3 className="text-2xl font-bold text-white mb-3">Free Laboratory</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Explore chemistry freely and create your own experiments.
                  No restrictions — mix any chemicals, use any equipment, discover reactions on your own.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['200+ Chemicals', 'All Equipment', 'Any Reaction', 'AI Assistant'].map(tag => (
                    <span key={tag} className="badge badge-cyan">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>🧪</span> Open exploration
                  </div>
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
                    style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}>
                    Enter Free Lab
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Curriculum Laboratory */}
          <Link href="/curriculum" className="block group"
            onMouseEnter={() => setHovered('curriculum')} onMouseLeave={() => setHovered(null)}>
            <div className={`relative p-8 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${hovered === 'curriculum' ? 'scale-[1.02]' : ''}`}
              style={{
                background: 'rgba(124,58,237,0.04)',
                border: `1px solid ${hovered === 'curriculum' ? 'rgba(124,58,237,0.6)' : 'rgba(124,58,237,0.2)'}`,
                boxShadow: hovered === 'curriculum' ? '0 0 30px rgba(124,58,237,0.15)' : 'none',
              }}>
              <div className="relative z-10">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-white mb-3">Curriculum Laboratory</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Follow chemistry experiments based on your grade level.
                  Structured learning with theory, guided experiments, quizzes, and progress tracking.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['5 Grade Levels', 'Theory + Lab', 'Quizzes', 'Progress Tracking'].map(tag => (
                    <span key={tag} className="badge badge-purple">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>🎓</span> Prep → Grade 12
                  </div>
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
                    style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.4)', color: '#a78bfa' }}>
                    Select Grade
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 w-full max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-card p-5 text-center">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h4 className="text-sm font-semibold text-white mb-1">{f.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
          <Link href="/dashboard/student" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <span>👨‍🎓</span> Student Dashboard
          </Link>
          <span>•</span>
          <Link href="/dashboard/teacher" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <span>👨‍🏫</span> Teacher Dashboard
          </Link>
        </div>
      </main>

      <footer className="relative z-10 text-center py-6 text-xs text-gray-600 border-t mt-8" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <p>ChemLab AI — Virtual Chemistry Laboratory Platform</p>
        <p className="mt-1">Safe learning environment for chemistry education</p>
      </footer>
    </div>
  );
}
