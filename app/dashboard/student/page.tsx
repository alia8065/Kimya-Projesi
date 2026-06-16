"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, Star, FlaskConical, BookOpen, Brain, Zap, Target, ChevronRight, Award } from "lucide-react";
import { useLabStore } from "@/store/labStore";
import { calculateLevel, getLevelProgress, getNextLevel, BADGES } from "@/lib/gamification";
import { CURRICULUM, GRADE_ORDER } from "@/lib/curriculum";

export default function StudentDashboard() {
  const { xp, badges, experimentsRun, reactionsDiscovered, aiQuestionsAsked, progress } = useLabStore();

  const level = calculateLevel(xp);
  const nextLevel = getNextLevel(xp);
  const levelProgress = getLevelProgress(xp);
  const earnedBadges = BADGES.filter(b => badges.includes(b.id));
  const completedTopics = progress.filter(p => p.experimentDone).length;
  const avgQuizScore = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + (p.quizScore || 0), 0) / progress.length)
    : 0;

  const STATS = [
    { label: 'Total XP', value: xp.toLocaleString(), icon: <Star className="w-5 h-5 text-amber-400" />, color: '#f59e0b' },
    { label: 'Experiments Run', value: experimentsRun, icon: <FlaskConical className="w-5 h-5 text-indigo-400" />, color: '#6366f1' },
    { label: 'Reactions Found', value: reactionsDiscovered.length, icon: <Zap className="w-5 h-5 text-emerald-400" />, color: '#10b981' },
    { label: 'Topics Completed', value: completedTopics, icon: <BookOpen className="w-5 h-5 text-purple-400" />, color: '#8b5cf6' },
    { label: 'AI Questions', value: aiQuestionsAsked, icon: <Brain className="w-5 h-5 text-cyan-400" />, color: '#06b6d4' },
    { label: 'Avg Quiz Score', value: `${avgQuizScore}%`, icon: <Target className="w-5 h-5 text-rose-400" />, color: '#f43f5e' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a', color: '#e2e8f0' }}>
      <div className="fixed inset-0 grid-bg opacity-25 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-indigo-500/15 px-6 py-4"
        style={{ background: 'rgba(10,14,26,0.98)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <div className="w-px h-4 bg-slate-600" />
            <span className="font-semibold text-white">Student Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/free-lab" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Free Lab</Link>
            <Link href="/curriculum" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">Curriculum</Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Level card */}
        <div className="rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{level.icon}</div>
              <div>
                <div className="text-xs text-indigo-400 font-medium mb-1">CURRENT LEVEL</div>
                <div className="text-2xl font-black text-white">{level.name}</div>
                <div className="text-slate-400 text-sm">Level {level.level} • {xp} XP total</div>
              </div>
            </div>
            <div className="text-right">
              {nextLevel ? (
                <div>
                  <div className="text-xs text-slate-400 mb-1">Next: {nextLevel.name}</div>
                  <div className="text-xs text-slate-500">{nextLevel.xpRequired - xp} XP needed</div>
                </div>
              ) : (
                <div className="text-amber-400 font-bold">MAX LEVEL 🏆</div>
              )}
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Level {level.level}</span>
              {nextLevel && <span>Level {nextLevel.level}</span>}
            </div>
            <div className="h-3 rounded-full bg-slate-700/50">
              <div className="h-full rounded-full progress-bar" style={{ width: `${levelProgress}%` }} />
            </div>
            <div className="text-xs text-slate-400 mt-1">{Math.round(levelProgress)}% progress</div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat, i) => (
            <div key={i} className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="text-xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Badges */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Badges ({earnedBadges.length}/{BADGES.length})
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {BADGES.map(badge => {
                const earned = badges.includes(badge.id);
                return (
                  <div key={badge.id} title={badge.description}
                    className="rounded-xl p-3 text-center transition-all"
                    style={{
                      background: earned ? 'rgba(245,158,11,0.1)' : 'rgba(15,23,42,0.5)',
                      border: earned ? '1px solid rgba(245,158,11,0.35)' : '1px solid rgba(99,102,241,0.1)',
                      opacity: earned ? 1 : 0.4,
                    }}>
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-xs font-semibold text-white leading-tight">{badge.name}</div>
                    <div className="text-xs mt-0.5 capitalize"
                      style={{ color: badge.rarity === 'legendary' ? '#f59e0b' : badge.rarity === 'epic' ? '#8b5cf6' : badge.rarity === 'rare' ? '#6366f1' : '#64748b' }}>
                      {badge.rarity}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Curriculum Progress */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Curriculum Progress
            </h2>
            <div className="space-y-3">
              {GRADE_ORDER.map(gradeId => {
                const grade = CURRICULUM[gradeId];
                if (!grade) return null;
                const completed = progress.filter(p => p.gradeId === gradeId && p.experimentDone).length;
                const total = grade.topics.length;
                const pct = total > 0 ? (completed / total) * 100 : 0;

                return (
                  <Link key={gradeId} href={`/curriculum/${gradeId}`}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:border-indigo-500/35"
                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(99,102,241,0.12)' }}>
                    <div className="text-2xl">{grade.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-white">{grade.shortName}</span>
                        <span className="text-xs text-slate-400">{completed}/{total}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-700/50">
                        <div className="h-full rounded-full progress-bar" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>

            {/* Recent activity */}
            {progress.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Activity</h3>
                <div className="space-y-2">
                  {[...progress].sort((a, b) => b.completedAt - a.completedAt).slice(0, 4).map((p, i) => {
                    const grade = CURRICULUM[p.gradeId];
                    const topic = grade?.topics.find(t => t.id === p.topicId);
                    if (!topic) return null;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg"
                        style={{ background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(99,102,241,0.1)' }}>
                        <span className="text-lg">{topic.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-white truncate">{topic.name}</div>
                          <div className="text-xs text-slate-500">{grade?.shortName} • Score: {p.quizScore}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/free-lab"
            className="flex items-center gap-4 p-5 rounded-xl transition-all group"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)'; }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))' }}>
              <FlaskConical className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white">Continue in Free Lab</div>
              <div className="text-slate-400 text-sm">Explore chemistry without limits</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </Link>

          <Link href="/curriculum"
            className="flex items-center gap-4 p-5 rounded-xl transition-all group"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.08)'; }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,182,212,0.2))' }}>
              <BookOpen className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white">Continue Curriculum</div>
              <div className="text-slate-400 text-sm">Pick up where you left off</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
