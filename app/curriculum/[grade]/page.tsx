"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, FlaskConical, Brain, HelpCircle } from "lucide-react";
import { CURRICULUM, GRADE_ORDER } from "@/lib/curriculum";
import { useLabStore } from "@/store/labStore";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ grade: string }>;
}

export default function GradePage({ params }: Props) {
  const { grade: gradeId } = use(params);
  const { progress } = useLabStore();

  const gradeData = CURRICULUM[gradeId];
  if (!gradeData) notFound();

  const currentIndex = GRADE_ORDER.indexOf(gradeId);
  const prevGrade = currentIndex > 0 ? GRADE_ORDER[currentIndex - 1] : null;
  const nextGrade = currentIndex < GRADE_ORDER.length - 1 ? GRADE_ORDER[currentIndex + 1] : null;

  const completedTopics = gradeData.topics.filter(t =>
    progress.some(p => p.gradeId === gradeId && p.topicId === t.id && p.experimentDone)
  );

  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a', color: '#e2e8f0' }}>
      <div className="fixed inset-0 grid-bg opacity-25 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-indigo-500/15 px-6 py-4"
        style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/curriculum" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Grades
            </Link>
            <div className="w-px h-4 bg-slate-600" />
            <span className="text-2xl">{gradeData.icon}</span>
            <span className="font-semibold text-white">{gradeData.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {prevGrade && (
              <Link href={`/curriculum/${prevGrade}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                ← {CURRICULUM[prevGrade]?.shortName}
              </Link>
            )}
            {nextGrade && (
              <Link href={`/curriculum/${nextGrade}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                {CURRICULUM[nextGrade]?.shortName} →
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Grade header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{gradeData.icon}</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{gradeData.name}</h1>
              <p className="text-slate-400">{gradeData.description}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Overall Progress</span>
                <span className="text-white font-semibold">{completedTopics.length}/{gradeData.topics.length} topics</span>
              </div>
              <div className="h-2 rounded-full bg-slate-700/50">
                <div className="h-full rounded-full progress-bar"
                  style={{ width: `${gradeData.topics.length > 0 ? (completedTopics.length / gradeData.topics.length) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Topics grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {gradeData.topics.map((topic, index) => {
            const topicProgress = progress.find(p => p.gradeId === gradeId && p.topicId === topic.id);
            const isCompleted = topicProgress?.experimentDone;
            const inProgress = topicProgress && !topicProgress.experimentDone;

            return (
              <Link key={topic.id} href={`/curriculum/${gradeId}/${topic.id}`}
                className="group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 block"
                style={{
                  background: isCompleted
                    ? 'rgba(16,185,129,0.08)'
                    : 'rgba(15,23,42,0.7)',
                  border: isCompleted
                    ? '1px solid rgba(16,185,129,0.3)'
                    : '1px solid rgba(99,102,241,0.15)',
                  boxShadow: 'none',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px rgba(99,102,241,0.15)`;
                  (e.currentTarget as HTMLElement).style.borderColor = `rgba(99,102,241,0.4)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `none`;
                  (e.currentTarget as HTMLElement).style.borderColor = isCompleted ? `rgba(16,185,129,0.3)` : `rgba(99,102,241,0.15)`;
                }}>

                <div className="p-5">
                  {/* Topic header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        {topic.icon}
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Topic {index + 1}</div>
                        <h3 className="font-bold text-white text-sm">{topic.name}</h3>
                      </div>
                    </div>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                    {!isCompleted && !inProgress && (
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{topic.description}</p>

                  {/* Content sections */}
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                      style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <BookOpen className="w-3 h-3" />
                      {topic.theory.sections.length} theory sections
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <FlaskConical className="w-3 h-3" />
                      {topic.experiments.length} experiment{topic.experiments.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                      style={{ background: 'rgba(245,158,11,0.1)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <HelpCircle className="w-3 h-3" />
                      {topic.quiz.length} quiz questions
                    </div>
                  </div>

                  {/* Score if completed */}
                  {topicProgress?.quizScore !== undefined && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Quiz Score</span>
                      <span className="text-xs font-bold"
                        style={{ color: topicProgress.quizScore >= 80 ? '#6ee7b7' : topicProgress.quizScore >= 60 ? '#fcd34d' : '#fca5a5' }}>
                        {topicProgress.quizScore}%
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
