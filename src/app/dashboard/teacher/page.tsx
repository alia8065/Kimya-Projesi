'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CURRICULUM, GRADE_INFO, GradeLevel } from '@/lib/curriculum';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MOCK_STUDENTS = [
  { id: '1', name: 'Ayşe K.', grade: '10', xp: 850, topics: 7, avgScore: 88, streak: 5, active: true },
  { id: '2', name: 'Mehmet A.', grade: '11', xp: 1200, topics: 12, avgScore: 76, streak: 12, active: true },
  { id: '3', name: 'Zeynep T.', grade: '9', xp: 450, topics: 4, avgScore: 92, streak: 3, active: true },
  { id: '4', name: 'Emirhan Y.', grade: '12', xp: 2100, topics: 18, avgScore: 81, streak: 8, active: false },
  { id: '5', name: 'Selin B.', grade: '10', xp: 680, topics: 6, avgScore: 95, streak: 6, active: true },
  { id: '6', name: 'Can D.', grade: 'hazirlik', xp: 320, topics: 3, avgScore: 70, streak: 1, active: false },
];

const GRADE_STATS = (['hazirlik', '9', '10', '11', '12'] as GradeLevel[]).map(g => ({
  grade: GRADE_INFO[g].label,
  students: MOCK_STUDENTS.filter(s => s.grade === g).length,
  avgScore: MOCK_STUDENTS.filter(s => s.grade === g).reduce((a, s) => a + s.avgScore, 0) / Math.max(1, MOCK_STUDENTS.filter(s => s.grade === g).length),
  color: GRADE_INFO[g].color,
}));

const PIE_DATA = [
  { name: 'Active Today', value: MOCK_STUDENTS.filter(s => s.active).length, color: '#10b981' },
  { name: 'Inactive', value: MOCK_STUDENTS.filter(s => !s.active).length, color: '#374151' },
];

export default function TeacherDashboard() {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showAssign, setShowAssign] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  const filteredStudents = MOCK_STUDENTS.filter(s => {
    const matchGrade = selectedGrade === 'all' || s.grade === selectedGrade;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchGrade && matchSearch;
  });

  const topPerformers = [...MOCK_STUDENTS].sort((a, b) => b.avgScore - a.avgScore).slice(0, 3);

  return (
    <div className="min-h-screen lab-bg">
      <header className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
            👨‍🏫
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Teacher Dashboard</h1>
            <p className="text-xs text-gray-500">Monitor students and track class progress</p>
          </div>
        </div>
        <button onClick={() => setShowAssign(!showAssign)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-black transition-all"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
          + Assign Experiment
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Assign modal */}
        {showAssign && (
          <div className="glass-card p-6" style={{ border: '1px solid rgba(0,212,255,0.3)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Assign Experiment to Students</h2>
              <button onClick={() => setShowAssign(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}>
                <option value="">Select topic...</option>
                {CURRICULUM.map(t => (
                  <option key={t.id} value={t.id}>{GRADE_INFO[t.grade].label}: {t.titleTr}</option>
                ))}
              </select>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                <option value="all">All Students</option>
                {(['hazirlik', '9', '10', '11', '12'] as GradeLevel[]).map(g => (
                  <option key={g} value={g}>{GRADE_INFO[g].label}</option>
                ))}
              </select>
              <button onClick={() => { setShowAssign(false); setSelectedTopic(''); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-black"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                Assign Now
              </button>
            </div>
          </div>
        )}

        {/* Class overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '👨‍🎓', label: 'Total Students', value: MOCK_STUDENTS.length, color: '#00d4ff' },
            { icon: '🟢', label: 'Active Today', value: MOCK_STUDENTS.filter(s => s.active).length, color: '#10b981' },
            { icon: '📊', label: 'Avg Score', value: `${Math.round(MOCK_STUDENTS.reduce((a, s) => a + s.avgScore, 0) / MOCK_STUDENTS.length)}%`, color: '#f59e0b' },
            { icon: '🧪', label: 'Total Experiments', value: MOCK_STUDENTS.reduce((a, s) => a + s.topics, 0), color: '#7c3aed' },
          ].map(stat => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Average Score by Grade</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={GRADE_STATS}>
                <XAxis dataKey="grade" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'rgba(10,14,26,0.9)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8 }} />
                {GRADE_STATS.map((g, i) => (
                  <Bar key={g.grade} dataKey="avgScore" fill={g.color} radius={[4, 4, 0, 0]} />
                ))}
                <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
                  {GRADE_STATS.map((g, i) => <Cell key={i} fill={g.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Activity Status</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value">
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(10,14,26,0.9)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs">
              {PIE_DATA.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-400">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top performers */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4">Top Performers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topPerformers.map((s, i) => (
              <div key={s.id} className="p-4 rounded-xl text-center"
                style={{ background: i === 0 ? 'rgba(245,158,11,0.1)' : i === 1 ? 'rgba(148,163,184,0.1)' : 'rgba(180,83,9,0.1)', border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.3)' : i === 1 ? 'rgba(148,163,184,0.3)' : 'rgba(180,83,9,0.3)'}` }}>
                <div className="text-2xl mb-1">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                <p className="font-semibold text-white">{s.name}</p>
                <p className="text-xs text-gray-500">{GRADE_INFO[s.grade as GradeLevel]?.label}</p>
                <p className="text-lg font-bold mt-1" style={{ color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#b45309' }}>{s.avgScore}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Student table */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="font-semibold text-white">Student Progress</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border text-white placeholder-gray-600 focus:outline-none"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <select value={selectedGrade} onChange={e => setSelectedGrade(e.target.value as GradeLevel | 'all')}
                className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border text-white focus:outline-none"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <option value="all">All Grades</option>
                {(['hazirlik', '9', '10', '11', '12'] as GradeLevel[]).map(g => (
                  <option key={g} value={g}>{GRADE_INFO[g].label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <th className="text-left py-2 pr-4">Student</th>
                  <th className="text-left py-2 pr-4">Grade</th>
                  <th className="text-left py-2 pr-4">XP</th>
                  <th className="text-left py-2 pr-4">Topics</th>
                  <th className="text-left py-2 pr-4">Avg Score</th>
                  <th className="text-left py-2 pr-4">Streak</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(s => (
                  <tr key={s.id} className="border-b text-sm hover:bg-white/2 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}>
                          {s.name.charAt(0)}
                        </div>
                        <span className="text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{GRADE_INFO[s.grade as GradeLevel]?.label}</td>
                    <td className="py-3 pr-4">
                      <span className="text-cyan-400 font-medium">{s.xp}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="progress-bar w-16">
                          <div className="progress-fill" style={{ width: `${(s.topics / 20) * 100}%` }} />
                        </div>
                        <span className="text-gray-400 text-xs">{s.topics}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`font-medium ${s.avgScore >= 90 ? 'text-green-400' : s.avgScore >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {s.avgScore}%
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-orange-400">{s.streak} 🔥</td>
                    <td className="py-3">
                      <span className={`badge ${s.active ? 'badge-green' : 'badge-red'}`}>
                        {s.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '📋', title: 'Create Quiz', desc: 'Build a custom quiz for your class', color: '#00d4ff', link: '/curriculum' },
            { icon: '📊', title: 'View Reports', desc: 'Detailed performance analytics', color: '#7c3aed', link: '/dashboard/teacher' },
            { icon: '🧪', title: 'Explore Lab', desc: 'Try experiments yourself', color: '#10b981', link: '/free-lab' },
          ].map(card => (
            <Link href={card.link} key={card.title} className="glass-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform">
              <div className="text-3xl">{card.icon}</div>
              <div>
                <h3 className="font-semibold text-white">{card.title}</h3>
                <p className="text-xs text-gray-500">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
