"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronRight, CheckCircle, Lock } from "lucide-react";
import { CURRICULUM, GRADE_ORDER } from "@/lib/curriculum";
import { useLabStore } from "@/store/labStore";

const GRADE_BG_COLORS: Record<string, { gradient: string; border: string; glow: string }> = {
  hazirlık: { gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.1))', border: 'rgba(139,92,246,0.4)', glow: 'rgba(139,92,246,0.2)' },
  grade9: { gradient: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))', border: 'rgba(99,102,241,0.4)', glow: 'rgba(99,102,241,0.2)' },
  grade10: { gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.1))', border: 'rgba(16,185,129,0.4)', glow: 'rgba(16,185,129,0.2)' },
  grade11: { gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(249,115,22,0.1))', border: 'rgba(245,158,11,0.4)', glow: 'rgba(245,158,11,0.2)' },
  grade12: { gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(236,72,153,0.1))', border: 'rgba(239,68,68,0.4)', glow: 'rgba(239,68,68,0.2)' },
};

export default function CurriculumPage() {
  const { progress } = useLabStore();

  const getCompletedTopics = (gradeId: string) => {
    return progress.filter(p => p.gradeId === gradeId && p.experimentDone).length;
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a', color: '#e2e8f0' }}>
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-emerald-500/15 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Accueil
          </Link>
          <div className="w-px h-4 bg-slate-600" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Laboratoire de programme</span>
          </div>
        </div>
        <Link href="/dashboard/student" className="text-sm text-slate-400 hover:text-white transition-colors">
          Ma progression →
        </Link>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}>
            <BookOpen className="w-3 h-3" />
            Laboratoire de programme
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Choisissez votre niveau scolaire</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Choisissez votre niveau pour accéder aux expériences chimiques structurées, à la théorie et aux quiz alignés sur votre programme.
          </p>
        </div>

        {/* Grade Cards */}
        <div className="space-y-4">
          {GRADE_ORDER.map((gradeId, index) => {
            const grade = CURRICULUM[gradeId];
            if (!grade) return null;
            const colors = GRADE_BG_COLORS[gradeId];
            const completed = getCompletedTopics(gradeId);
            const total = grade.topics.length;
            const progressPct = total > 0 ? (completed / total) * 100 : 0;

            return (
              <Link key={gradeId} href={`/curriculum/${gradeId}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: colors.gradient,
                  border: `1px solid ${colors.border}`,
                  boxShadow: `0 0 0 rgba(0,0,0,0)`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${colors.glow}`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 rgba(0,0,0,0)`; }}>

                <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl sm:text-3xl"
                    style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}` }}>
                    {grade.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white">{grade.name}</h3>
                      {completed === total && total > 0 && (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{grade.description}</p>

                    {/* Topics preview */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {grade.topics.slice(0, 4).map(topic => {
                        const topicDone = progress.some(p => p.gradeId === gradeId && p.topicId === topic.id && p.experimentDone);
                        return (
                          <span key={topic.id} className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
                            style={{
                              background: topicDone ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                              border: topicDone ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.1)',
                              color: topicDone ? '#6ee7b7' : '#94a3b8',
                            }}>
                            {topicDone && <CheckCircle className="w-2.5 h-2.5" />}
                            {topic.icon} {topic.name}
                          </span>
                        );
                      })}
                      {grade.topics.length > 4 && (
                        <span className="px-2 py-0.5 rounded-full text-xs text-slate-500"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          +{grade.topics.length - 4} de plus
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-700/50">
                        <div className="h-full rounded-full progress-bar" style={{ width: `${progressPct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{completed}/{total} sujets</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info box */}
        <div className="mt-10 rounded-xl p-5 flex gap-4"
          style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <div className="text-2xl">💡</div>
          <div>
            <div className="font-semibold text-white text-sm mb-1">Comment fonctionne le Labo de programme</div>
            <div className="text-slate-400 text-xs leading-relaxed">
              Chaque sujet suit un parcours structuré : <strong className="text-slate-300">Théorie</strong> → <strong className="text-slate-300">Expérience interactive</strong> → <strong className="text-slate-300">Tuteur IA</strong> → <strong className="text-slate-300">Quiz</strong>.
              Complétez toutes les sections pour gagner des XP et des badges. Votre progression est sauvegardée automatiquement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
