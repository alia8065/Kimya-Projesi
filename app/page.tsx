"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FlaskConical, BookOpen, Atom, Zap, Star, ArrowRight, ChevronRight, Shield, Brain, Award } from "lucide-react";

const FLOATING_MOLECULES = [
  { symbol: "H₂O", x: 10, y: 20, delay: 0 },
  { symbol: "NaCl", x: 85, y: 15, delay: 0.5 },
  { symbol: "CO₂", x: 15, y: 70, delay: 1 },
  { symbol: "O₂", x: 80, y: 75, delay: 1.5 },
  { symbol: "CH₄", x: 50, y: 85, delay: 2 },
  { symbol: "HCl", x: 45, y: 10, delay: 0.8 },
  { symbol: "Fe", x: 92, y: 45, delay: 1.2 },
  { symbol: "Au", x: 5, y: 45, delay: 0.3 },
];

const FEATURES = [
  { icon: <Brain className="w-5 h-5" />, title: "Tuteur IA en chimie", desc: "Obtenez des explications et des conseils instantanés" },
  { icon: <FlaskConical className="w-5 h-5" />, title: "Simulations réalistes", desc: "Réactions scientifiquement précises" },
  { icon: <BookOpen className="w-5 h-5" />, title: "Programme complet", desc: "3e–Terminale + Classe préparatoire" },
  { icon: <Award className="w-5 h-5" />, title: "Gamification", desc: "XP, badges et récompenses" },
  { icon: <Zap className="w-5 h-5" />, title: "Retour en temps réel", desc: "Résultats de réaction instantanés" },
  { icon: <Shield className="w-5 h-5" />, title: "Environnement sécurisé", desc: "Aucun risque réel, tout pour apprendre" },
];

const STATS = [
  { value: "50+", label: "Produits chimiques" },
  { value: "30+", label: "Réactions" },
  { value: "5", label: "Niveaux scolaires" },
  { value: "100+", label: "Questions de quiz" },
];

export default function HomePage() {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1525 50%, #0a0e1a 100%)' }}>
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-50 pointer-events-none" />

      {/* Floating molecules */}
      {mounted && FLOATING_MOLECULES.map((mol, i) => (
        <div
          key={i}
          className="fixed pointer-events-none select-none float-animation"
          style={{
            left: `${mol.x}%`,
            top: `${mol.y}%`,
            animationDelay: `${mol.delay}s`,
            opacity: 0.15,
          }}
        >
          <span className="text-indigo-400 text-xs font-mono font-bold">{mol.symbol}</span>
        </div>
      ))}

      {/* Glowing orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-indigo-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Atom className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-tight">ChemLab AI</div>
            <div className="text-xs text-indigo-400">Laboratoire de chimie virtuel</div>
          </div>
        </div>
        <nav className="hidden lg:flex items-center gap-6 text-sm text-slate-400">
          <Link href="/free-lab" className="hover:text-white transition-colors">Labo libre</Link>
          <Link href="/curriculum" className="hover:text-white transition-colors">Programme</Link>
          <Link href="/dashboard/student" className="hover:text-white transition-colors">Tableau de bord</Link>
        </nav>
        <Link href="/dashboard/student"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
          style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
          <Star className="w-4 h-4 text-indigo-400" />
          Ma progression
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 text-center pt-20 pb-16 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
          <Zap className="w-3 h-3" />
          Éducation chimique propulsée par l'IA
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
          <span className="text-white">Laboratoire</span>
          <span className="text-gradient-primary"> de Chimie</span>
          <br />
          <span className="text-white">Virtuel</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Vivez le frisson des expériences chimiques dans un environnement virtuel sécurisé propulsé par l'IA.
          Apprenez par l'interaction, pas par mémorisation.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-5 sm:gap-8 mb-16">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black text-gradient-primary">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mode Selection - MAIN CONTENT */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Choisissez votre mode de laboratoire</h2>
            <p className="text-slate-400">Deux expériences d'apprentissage entièrement distinctes</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* FREE LAB Card */}
            <Link href="/free-lab"
              onMouseEnter={() => setHoveredMode('free')}
              onMouseLeave={() => setHoveredMode(null)}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer block"
              style={{
                background: hoveredMode === 'free'
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)'
                  : 'rgba(15,23,42,0.8)',
                border: hoveredMode === 'free' ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(99,102,241,0.15)',
                boxShadow: hoveredMode === 'free' ? '0 0 40px rgba(99,102,241,0.2)' : 'none',
                transform: hoveredMode === 'free' ? 'translateY(-4px)' : 'none',
              }}>

              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)' }} />

              <div className="p-6 sm:p-10">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 float-animation"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}>
                  <FlaskConical className="w-10 h-10 text-indigo-400" />
                </div>

                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}>
                  OPTION 1
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">Laboratoire libre</h3>
                <p className="text-slate-400 leading-relaxed mb-8 text-base">
                  Explorez librement la chimie et créez vos propres expériences. Mélangez des produits chimiques, observez les réactions
                  et posez toutes vos questions à notre tuteur IA. Sans restrictions — exploration pure.
                </p>

                <ul className="space-y-3 mb-10">
                  {['Sélectionner tout produit chimique de la base de données', 'Mélanger et observer les réactions', 'Utiliser tout l\'équipement de laboratoire', 'Assistant IA toujours disponible', 'Aucune restriction de programme'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
                        <ChevronRight className="w-3 h-3 text-indigo-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    Entrer dans le labo libre
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-500">Exploration ouverte</div>
                </div>
              </div>
            </Link>

            {/* CURRICULUM LAB Card */}
            <Link href="/curriculum"
              onMouseEnter={() => setHoveredMode('curriculum')}
              onMouseLeave={() => setHoveredMode(null)}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer block"
              style={{
                background: hoveredMode === 'curriculum'
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%)'
                  : 'rgba(15,23,42,0.8)',
                border: hoveredMode === 'curriculum' ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(16,185,129,0.15)',
                boxShadow: hoveredMode === 'curriculum' ? '0 0 40px rgba(16,185,129,0.15)' : 'none',
                transform: hoveredMode === 'curriculum' ? 'translateY(-4px)' : 'none',
              }}>

              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4, #0ea5e9)' }} />

              <div className="p-6 sm:p-10">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 float-animation"
                  style={{ animationDelay: '1s', background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,182,212,0.2))', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <BookOpen className="w-10 h-10 text-emerald-400" />
                </div>

                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' }}>
                  OPTION 2
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">Laboratoire de programme</h3>
                <p className="text-slate-400 leading-relaxed mb-8 text-base">
                  Suivez des expériences chimiques adaptées à votre niveau scolaire. Apprentissage structuré avec théorie,
                  expériences interactives, quiz et guidance IA — tout aligné sur le programme.
                </p>

                <ul className="space-y-3 mb-10">
                  {['Sujets organisés par niveau', 'Théorie + Expérience + Quiz', 'Suivi des progrès', 'Tuteur IA pour chaque sujet', '3e–Terminale + Prépa'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <ChevronRight className="w-3 h-3 text-emerald-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                    style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                    Choisir un niveau
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-500">Apprentissage structuré</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="relative z-10 px-6 py-16 border-t border-indigo-500/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-white mb-12">Fonctionnalités de la plateforme</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-indigo-400"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  {f.icon}
                </div>
                <div className="font-semibold text-white mb-2 text-sm">{f.title}</div>
                <div className="text-xs text-slate-400">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-indigo-500/10 px-6 py-8 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Atom className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-400">ChemLab AI</span>
        </div>
        <p>Laboratoire de chimie virtuel propulsé par l'IA • Environnement d'apprentissage sécurisé</p>
      </footer>
    </div>
  );
}
