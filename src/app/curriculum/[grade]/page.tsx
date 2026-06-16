'use client';
import { use } from 'react';
import Link from 'next/link';
import { getGradeTopics, GRADE_INFO, GradeLevel } from '@/lib/curriculum';
import { useStore } from '@/lib/store';

export default function GradePage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade } = use(params);
  const gradeLevel = grade as GradeLevel;
  const info = GRADE_INFO[gradeLevel];
  const topics = getGradeTopics(gradeLevel);
  const { topicProgress } = useStore();

  if (!info) {
    return (
      <div className="min-h-screen lab-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Grade not found</p>
          <Link href="/curriculum" className="text-cyan-400 mt-2 block">← Back to Curriculum</Link>
        </div>
      </div>
    );
  }

  const completedCount = topics.filter(t => topicProgress[t.id]?.completed).length;

  return (
    <div className="min-h-screen lab-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${info.color}22` }}>
        <div className="flex items-center gap-3">
          <Link href="/curriculum" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="text-3xl">{info.icon}</div>
          <div>
            <h1 className="text-lg font-bold text-white">{info.label}</h1>
            <p className="text-xs text-gray-500">{info.labelTr} · {info.description}</p>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {completedCount}/{topics.length} completed
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
            <span>Grade Progress</span>
            <span>{Math.round((completedCount / topics.length) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(completedCount / topics.length) * 100}%`, background: `linear-gradient(90deg, ${info.color}, ${info.color}88)` }} />
          </div>
        </div>

        {/* Topic list */}
        <div className="space-y-3">
          {topics.map((topic, idx) => {
            const progress = topicProgress[topic.id];
            const isCompleted = progress?.completed;
            const hasExperiment = progress?.experimentCompleted;
            const quizScore = progress?.quizScore;

            return (
              <Link href={`/curriculum/${grade}/${topic.id}`} key={topic.id} className="block group">
                <div className="glass-card p-5 transition-all duration-300 group-hover:scale-[1.01]"
                  style={{ borderColor: isCompleted ? `${info.color}44` : `${info.color}1a` }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 15px ${info.color}15`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                  <div className="flex items-center gap-4">
                    {/* Order indicator */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `${info.color}15`, border: `1px solid ${info.color}33` }}>
                      {isCompleted ? '✓' : topic.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-gray-600 font-mono">{String(idx + 1).padStart(2, '0')}</span>
                        <h3 className="font-semibold text-white">{topic.titleTr}</h3>
                        <span className="text-xs text-gray-600">{topic.title}</span>
                        {isCompleted && <span className="badge badge-green">✓ Done</span>}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{topic.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="text-gray-600">⏱ {topic.duration} min</span>
                        <span style={{ color: info.color }}>⭐ {topic.xpReward} XP</span>
                        {hasExperiment && <span className="text-green-500">🧪 Experiment done</span>}
                        {quizScore !== undefined && <span className="text-yellow-500">📝 Quiz: {quizScore}%</span>}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
                        style={{ background: `${info.color}15`, border: `1px solid ${info.color}33`, color: info.color }}>
                        →
                      </div>
                    </div>
                  </div>

                  {/* Mini progress for topic */}
                  <div className="mt-3 flex gap-2">
                    {[
                      { label: 'Theory', done: isCompleted || hasExperiment },
                      { label: 'Experiment', done: hasExperiment },
                      { label: 'Quiz', done: quizScore !== undefined },
                    ].map(step => (
                      <div key={step.label} className="flex items-center gap-1 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ background: step.done ? info.color : 'rgba(255,255,255,0.1)' }} />
                        <span className={step.done ? 'text-gray-400' : 'text-gray-700'}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/curriculum" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to all grades
          </Link>
        </div>
      </div>
    </div>
  );
}
