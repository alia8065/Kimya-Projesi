"use client";

import Link from "next/link";
import { ArrowLeft, Users, BookOpen, TrendingUp, Award, BarChart2, CheckCircle, Clock, Plus, FlaskConical } from "lucide-react";
import { CURRICULUM, GRADE_ORDER } from "@/lib/curriculum";

const MOCK_STUDENTS = [
  { id: 1, name: "Ayşe Kaya", grade: "grade12", xp: 2450, completedTopics: 8, avgScore: 87, streak: 5, lastActive: "2h ago" },
  { id: 2, name: "Mehmet Demir", grade: "grade11", xp: 1830, completedTopics: 6, avgScore: 74, streak: 3, lastActive: "1d ago" },
  { id: 3, name: "Zeynep Yılmaz", grade: "grade12", xp: 3200, completedTopics: 11, avgScore: 92, streak: 12, lastActive: "30m ago" },
  { id: 4, name: "Can Çelik", grade: "grade10", xp: 950, completedTopics: 4, avgScore: 68, streak: 1, lastActive: "3d ago" },
  { id: 5, name: "Elif Şahin", grade: "grade9", xp: 1200, completedTopics: 5, avgScore: 81, streak: 8, lastActive: "5h ago" },
  { id: 6, name: "Berk Arslan", grade: "grade10", xp: 780, completedTopics: 3, avgScore: 59, streak: 0, lastActive: "1w ago" },
];

export default function TeacherDashboard() {
  const totalStudents = MOCK_STUDENTS.length;
  const avgXP = Math.round(MOCK_STUDENTS.reduce((s, st) => s + st.xp, 0) / totalStudents);
  const avgScore = Math.round(MOCK_STUDENTS.reduce((s, st) => s + st.avgScore, 0) / totalStudents);
  const activeToday = MOCK_STUDENTS.filter(s => s.lastActive.includes('m') || s.lastActive.includes('h')).length;

  const gradeDistribution = GRADE_ORDER.map(gId => ({
    grade: CURRICULUM[gId]?.shortName || gId,
    count: MOCK_STUDENTS.filter(s => s.grade === gId).length,
  }));

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
            <span className="font-semibold text-white">Teacher Dashboard</span>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white"
              style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <Plus className="w-4 h-4" />
              Create Assignment
            </button>
            <Link href="/dashboard/student" className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
              style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(99,102,241,0.15)' }}>
              Student View
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Overview cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: totalStudents, icon: <Users className="w-5 h-5 text-indigo-400" />, color: '#6366f1' },
            { label: 'Active Today', value: activeToday, icon: <TrendingUp className="w-5 h-5 text-emerald-400" />, color: '#10b981' },
            { label: 'Avg XP', value: avgXP.toLocaleString(), icon: <Award className="w-5 h-5 text-amber-400" />, color: '#f59e0b' },
            { label: 'Avg Quiz Score', value: `${avgScore}%`, icon: <BarChart2 className="w-5 h-5 text-purple-400" />, color: '#8b5cf6' },
          ].map((card, i) => (
            <div key={i} className="rounded-xl p-5"
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div className="flex items-center justify-between mb-3">
                {card.icon}
                <div className="w-2 h-2 rounded-full" style={{ background: card.color }} />
              </div>
              <div className="text-2xl font-black text-white">{card.value}</div>
              <div className="text-xs text-slate-400 mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Students table */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Student Progress
            </h2>
            {/* Scrollable table wrapper for tablet/mobile */}
            <div className="rounded-xl overflow-hidden"
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px]">
                  <thead>
                    <tr className="border-b border-indigo-500/10">
                      <th className="text-left text-xs text-slate-400 px-3 py-3 font-medium">Student</th>
                      <th className="text-left text-xs text-slate-400 px-3 py-3 font-medium">Grade</th>
                      <th className="text-left text-xs text-slate-400 px-3 py-3 font-medium">XP</th>
                      <th className="text-left text-xs text-slate-400 px-3 py-3 font-medium">Topics</th>
                      <th className="text-left text-xs text-slate-400 px-3 py-3 font-medium">Score</th>
                      <th className="text-left text-xs text-slate-400 px-3 py-3 font-medium hidden sm:table-cell">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_STUDENTS.map((student, i) => {
                      const grade = CURRICULUM[student.grade];
                      const totalTopics = grade?.topics.length || 0;
                      return (
                        <tr key={student.id} className="border-b border-indigo-500/5 hover:bg-indigo-500/5 transition-colors">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                style={{ background: `hsl(${i * 60}, 70%, 40%)` }}>
                                {student.name[0]}
                              </div>
                              <span className="text-sm text-white font-medium whitespace-nowrap">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
                              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                              {grade?.shortName || student.grade}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm text-white font-semibold whitespace-nowrap">{student.xp.toLocaleString()}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white whitespace-nowrap">{student.completedTopics}/{totalTopics}</span>
                              <div className="h-1.5 rounded-full bg-slate-700/50 w-10 flex-shrink-0">
                                <div className="h-full rounded-full bg-emerald-500"
                                  style={{ width: `${(student.completedTopics / Math.max(1, totalTopics)) * 100}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-sm font-semibold"
                              style={{ color: student.avgScore >= 80 ? '#6ee7b7' : student.avgScore >= 60 ? '#fcd34d' : '#fca5a5' }}>
                              {student.avgScore}%
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-400 hidden sm:table-cell">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${student.lastActive.includes('m') || student.lastActive.includes('h') ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                              {student.lastActive}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            {/* Grade distribution */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                Students by Grade
              </h3>
              <div className="rounded-xl p-4 space-y-3"
                style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
                {gradeDistribution.filter(g => g.count > 0).map((g, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-16">{g.grade}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-700/50">
                      <div className="h-full rounded-full"
                        style={{ width: `${(g.count / totalStudents) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                    </div>
                    <span className="text-xs text-white w-4">{g.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Assign Experiment', icon: <FlaskConical className="w-4 h-4" />, color: '#6366f1' },
                  { label: 'Create Quiz', icon: <CheckCircle className="w-4 h-4" />, color: '#10b981' },
                  { label: 'View Reports', icon: <TrendingUp className="w-4 h-4" />, color: '#f59e0b' },
                  { label: 'Schedule Class', icon: <Clock className="w-4 h-4" />, color: '#8b5cf6' },
                ].map((action, i) => (
                  <button key={i} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(99,102,241,0.12)' }}>
                    <span style={{ color: action.color }}>{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Curriculum overview */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Curriculum
              </h3>
              <div className="space-y-2">
                {GRADE_ORDER.map(gId => {
                  const grade = CURRICULUM[gId];
                  if (!grade) return null;
                  return (
                    <Link key={gId} href={`/curriculum/${gId}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-500/10 transition-all"
                      style={{ border: '1px solid rgba(99,102,241,0.08)' }}>
                      <span className="text-lg">{grade.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs text-white font-medium">{grade.shortName}</div>
                        <div className="text-xs text-slate-500">{grade.topics.length} topics</div>
                      </div>
                      <span className="text-xs text-slate-500">
                        {MOCK_STUDENTS.filter(s => s.grade === gId).length} students
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
