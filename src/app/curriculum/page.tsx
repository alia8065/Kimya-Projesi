'use client';
import Link from 'next/link';
import { GRADE_INFO, GradeLevel, CURRICULUM } from '@/lib/curriculum';
import { useStore } from '@/lib/store';

const GRADES: GradeLevel[] = ['hazirlik', '9', '10', '11', '12'];

export default function CurriculumPage() {
  const { topicProgress, xp, level } = useStore();

  const getGradeCompletion = (grade: GradeLevel) => {
    const topics = CURRICULUM.filter(t => t.grade === grade);
    if (topics.length === 0) return 0;
    const completed = topics.filter(t => topicProgress[t.id]?.completed).length;
    return Math.round((completed / topics.length) * 100);
  };

  const totalTopics = CURRICULUM.length;
  const completedTopics = CURRICULUM.filter(t => topicProgress[t.id]?.completed).length;

  return (
    <div className="min-h-screen lab-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(124,58,237,0.2)' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
            📚
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Curriculum Laboratory</h1>
            <p className="text-xs text-gray-500">Structured learning by grade level</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold gradient-text-cyan">Level {level}</div>
            <div className="text-xs text-gray-500">{xp} XP total</div>
          </div>
          <Link href="/free-lab" className="px-3 py-1.5 rounded-lg text-xs text-cyan-400 transition-colors" style={{ border: '1px solid rgba(0,212,255,0.3)' }}>
            → Free Lab
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Overall progress */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Overall Progress</h2>
            <span className="text-sm text-gray-400">{completedTopics}/{totalTopics} topics</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(completedTopics / totalTopics) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Prep Class</span>
            <span>Grade 12</span>
          </div>
        </div>

        {/* Grade cards */}
        <h2 className="text-xl font-bold text-white mb-6 text-center">Select Your Grade Level</h2>

        <div className="space-y-4">
          {GRADES.map((grade, idx) => {
            const info = GRADE_INFO[grade];
            const topics = CURRICULUM.filter(t => t.grade === grade);
            const completion = getGradeCompletion(grade);

            return (
              <Link href={`/curriculum/${grade}`} key={grade} className="block group">
                <div className="glass-card p-6 transition-all duration-300 group-hover:scale-[1.01]"
                  style={{
                    borderColor: `${info.color}33`,
                    boxShadow: `0 0 0 0 ${info.color}`,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px ${info.color}22`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{info.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white">{info.label}</h3>
                        <span className="text-xs text-gray-500">{info.labelTr}</span>
                        {completion === 100 && <span className="badge badge-green">✓ Complete</span>}
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{info.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 progress-bar">
                          <div className="progress-fill" style={{ width: `${completion}%`, background: `linear-gradient(90deg, ${info.color}, ${info.color}88)` }} />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{completion}%</span>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-gray-600">
                        <span>{topics.length} topics</span>
                        <span>{topics.reduce((acc, t) => acc + t.duration, 0)} min total</span>
                        <span>{topics.reduce((acc, t) => acc + t.xpReward, 0)} XP available</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm group-hover:gap-3 transition-all"
                      style={{ background: `${info.color}11`, border: `1px solid ${info.color}33`, color: info.color }}>
                      Start
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-10 p-4 rounded-xl text-center" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <p className="text-sm text-gray-400">
            Each topic includes <span className="text-purple-400">theory</span>, <span className="text-cyan-400">interactive experiments</span>,{' '}
            <span className="text-green-400">AI explanations</span>, and <span className="text-yellow-400">quizzes</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
