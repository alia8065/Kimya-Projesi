'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore, DEFAULT_ACHIEVEMENTS } from '@/lib/store';
import { CURRICULUM, GRADE_INFO, GradeLevel } from '@/lib/curriculum';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const GRADES: GradeLevel[] = ['hazirlik', '9', '10', '11', '12'];

const DAILY_CHALLENGES = [
  { id: '1', title: 'Perform a neutralization reaction', xp: 30, completed: false },
  { id: '2', title: 'Answer 5 quiz questions correctly', xp: 50, completed: false },
  { id: '3', title: 'Complete one experiment in Curriculum Lab', xp: 40, completed: false },
];

export default function StudentDashboard() {
  const { name, xp, level, achievements, topicProgress, experimentHistory, streak, setName } = useStore();
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(name);

  const completedTopics = CURRICULUM.filter(t => topicProgress[t.id]?.completed);
  const totalTopics = CURRICULUM.length;
  const xpProgress = xp % 500;
  const xpToNext = 500;

  const gradeRadarData = GRADES.map(g => {
    const gTopics = CURRICULUM.filter(t => t.grade === g);
    const done = gTopics.filter(t => topicProgress[t.id]?.completed).length;
    return {
      grade: GRADE_INFO[g].label,
      score: gTopics.length ? Math.round((done / gTopics.length) * 100) : 0,
    };
  });

  const xpHistory = [
    { day: 'Mon', xp: Math.max(0, xp - 400) },
    { day: 'Tue', xp: Math.max(0, xp - 300) },
    { day: 'Wed', xp: Math.max(0, xp - 200) },
    { day: 'Thu', xp: Math.max(0, xp - 100) },
    { day: 'Fri', xp: Math.max(0, xp - 50) },
    { day: 'Sat', xp: Math.max(0, xp - 20) },
    { day: 'Today', xp },
  ];

  const recentTopics = completedTopics.slice(-5).reverse();

  const avgQuizScore = (() => {
    const scored = Object.values(topicProgress).filter(p => p.quizScore !== undefined);
    if (!scored.length) return 0;
    return Math.round(scored.reduce((acc, p) => acc + (p.quizScore || 0), 0) / scored.length);
  })();

  return (
    <div className="min-h-screen lab-bg">
      <header className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
            👨‍🎓
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Student Dashboard</h1>
            <p className="text-xs text-gray-500">Track your chemistry learning journey</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/free-lab" className="px-3 py-1.5 rounded-lg text-xs text-cyan-400" style={{ border: '1px solid rgba(0,212,255,0.3)' }}>Free Lab</Link>
          <Link href="/curriculum" className="px-3 py-1.5 rounded-lg text-xs text-purple-400" style={{ border: '1px solid rgba(124,58,237,0.3)' }}>Curriculum</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Profile + XP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(0,212,255,0.3)' }}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                {editName ? (
                  <div className="flex gap-2">
                    <input value={nameInput} onChange={e => setNameInput(e.target.value)}
                      className="bg-white/10 border border-cyan-500/30 rounded px-2 py-1 text-sm text-white w-28" />
                    <button onClick={() => { setName(nameInput); setEditName(false); }}
                      className="text-xs text-cyan-400">Save</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-white">{name}</h2>
                    <button onClick={() => setEditName(true)} className="text-xs text-gray-600 hover:text-gray-400">✏️</button>
                  </div>
                )}
                <p className="text-sm gradient-text-cyan font-semibold">Level {level} Chemist</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{xp} XP</span><span>{xpToNext - xpProgress} to Level {level + 1}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(xpProgress / xpToNext) * 100}%` }} />
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">{streak}</div>
                <div className="text-xs text-gray-600">Day Streak 🔥</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{completedTopics.length}</div>
                <div className="text-xs text-gray-600">Topics Done</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{avgQuizScore}%</div>
                <div className="text-xs text-gray-600">Avg Quiz</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '📚', label: 'Topics Completed', value: `${completedTopics.length}/${totalTopics}`, color: '#00d4ff' },
              { icon: '🧪', label: 'Experiments Done', value: experimentHistory.length, color: '#10b981' },
              { icon: '📝', label: 'Quizzes Taken', value: Object.values(topicProgress).filter(p => p.quizScore !== undefined).length, color: '#f59e0b' },
              { icon: '🏅', label: 'Achievements', value: `${achievements.length}/${DEFAULT_ACHIEVEMENTS.length}`, color: '#7c3aed' },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Radar chart */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Grade Coverage</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={gradeRadarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="grade" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Radar name="Completion" dataKey="score" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* XP line chart */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">XP This Week</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={xpHistory}>
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'rgba(10,14,26,0.9)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#00d4ff' }} />
                <Line type="monotone" dataKey="xp" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily challenges + Recent topics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Daily challenges */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Daily Challenges</h3>
            <div className="space-y-3">
              {DAILY_CHALLENGES.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    🎯
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{c.title}</p>
                    <p className="text-xs text-yellow-500">+{c.xp} XP</p>
                  </div>
                  {c.completed ? (
                    <span className="badge badge-green">Done</span>
                  ) : (
                    <span className="badge badge-yellow">Pending</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent topics */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Recent Topics</h3>
            {recentTopics.length > 0 ? (
              <div className="space-y-2">
                {recentTopics.map(topic => {
                  const info = GRADE_INFO[topic.grade];
                  const p = topicProgress[topic.id];
                  return (
                    <Link href={`/curriculum/${topic.grade}/${topic.id}`} key={topic.id}
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5"
                      style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-xl">{topic.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm text-white">{topic.titleTr}</p>
                        <p className="text-xs text-gray-500">{info.label}</p>
                      </div>
                      <div className="text-right">
                        {p?.quizScore !== undefined && <div className="text-xs text-yellow-400">{p.quizScore}%</div>}
                        <span className="badge badge-green">✓</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <p className="text-sm">No completed topics yet</p>
                <Link href="/curriculum" className="text-cyan-400 text-xs mt-2 block">Start learning →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4">Achievements ({achievements.length}/{DEFAULT_ACHIEVEMENTS.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DEFAULT_ACHIEVEMENTS.map(ach => {
              const earned = achievements.find(a => a.id === ach.id);
              return (
                <div key={ach.id} className="p-3 rounded-xl text-center transition-all"
                  style={{
                    background: earned ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${earned ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    opacity: earned ? 1 : 0.4,
                  }}>
                  <div className="text-2xl mb-1">{earned ? ach.icon : '🔒'}</div>
                  <p className="text-xs font-medium text-white">{ach.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{ach.description}</p>
                  <p className="text-xs text-yellow-500 mt-1">+{ach.xp} XP</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
