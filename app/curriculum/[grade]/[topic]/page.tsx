"use client";

import { use, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, FlaskConical, Brain, HelpCircle, CheckCircle, ChevronRight, Play, Check, X, Trophy, ArrowRight } from "lucide-react";
import { CURRICULUM, getTopic } from "@/lib/curriculum";
import { CHEMICALS } from "@/lib/chemicals";
import { simulateReaction } from "@/lib/reactions";
import { useLabStore } from "@/store/labStore";
import AIAssistant from "@/components/lab/AIAssistant";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ grade: string; topic: string }>;
}

type Section = 'theory' | 'experiment' | 'ai' | 'quiz';

export default function TopicPage({ params }: Props) {
  const { grade: gradeId, topic: topicId } = use(params);
  const topic = getTopic(gradeId, topicId);
  if (!topic) notFound();

  const [activeSection, setActiveSection] = useState<Section>('theory');
  const [currentTheorySection, setCurrentTheorySection] = useState(0);
  const [experimentRunning, setExperimentRunning] = useState(false);
  const [experimentResult, setExperimentResult] = useState<ReturnType<typeof simulateReaction> | null>(null);
  const [currentExpStep, setCurrentExpStep] = useState(-1);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const { addXP, completeTopicProgress, getTopicProgress, progress } = useLabStore();
  const topicProgress = getTopicProgress(gradeId, topicId);

  const SECTIONS: { id: Section; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'theory', label: 'Theory', icon: <BookOpen className="w-4 h-4" />, color: '#6366f1' },
    { id: 'experiment', label: 'Experiment', icon: <FlaskConical className="w-4 h-4" />, color: '#10b981' },
    { id: 'ai', label: 'AI Tutor', icon: <Brain className="w-4 h-4" />, color: '#8b5cf6' },
    { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-4 h-4" />, color: '#f59e0b' },
  ];

  const runExperiment = useCallback(async () => {
    const exp = topic.experiments[0];
    if (!exp) return;
    setExperimentRunning(true);
    setCurrentExpStep(0);

    for (let i = 0; i < exp.steps.length; i++) {
      setCurrentExpStep(i);
      await new Promise(r => setTimeout(r, 1200));
    }

    const result = simulateReaction(exp.chemicals);
    setExperimentResult(result);
    setExperimentRunning(false);
    addXP(20);
  }, [topic, addXP]);

  const handleQuizAnswer = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitQuiz = () => {
    let correct = 0;
    topic.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.answer) correct++;
    });
    const score = Math.round((correct / topic.quiz.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    addXP(score >= 80 ? 50 : score >= 60 ? 30 : 15);

    completeTopicProgress({
      topicId,
      gradeId,
      quizScore: score,
      experimentDone: experimentResult !== null || !!topicProgress?.experimentDone,
    });
  };

  const grade = CURRICULUM[gradeId];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0e1a', color: '#e2e8f0' }}>
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-indigo-500/15 px-4 py-3"
        style={{ background: 'rgba(10,14,26,0.98)', backdropFilter: 'blur(16px)' }}>
        {/* Top row: back + title */}
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-0">
          <div className="flex items-center gap-2 min-w-0">
            <Link href={`/curriculum/${gradeId}`} className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{grade?.shortName}</span>
            </Link>
            <div className="w-px h-4 bg-slate-600 hidden sm:block" />
            <span className="text-base sm:text-lg flex-shrink-0">{topic.icon}</span>
            <span className="font-semibold text-white text-sm truncate">{topic.name}</span>
            {topicProgress?.experimentDone && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          </div>
        </div>

        {/* Section navigation — scrolls horizontally on mobile */}
        <div className="flex items-center gap-1 overflow-x-auto sm:mt-0 mt-2 pb-0.5 sm:pb-0 sm:justify-end sm:absolute sm:top-3 sm:right-4">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0"
              style={{
                background: activeSection === s.id ? `${s.color}20` : 'transparent',
                border: activeSection === s.id ? `1px solid ${s.color}50` : '1px solid transparent',
                color: activeSection === s.id ? s.color : '#94a3b8',
              }}>
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* THEORY SECTION */}
          {activeSection === 'theory' && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="text-xs text-indigo-400 font-medium mb-2 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  THEORY
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">{topic.name}</h1>
                <p className="text-slate-400 leading-relaxed">{topic.description}</p>
              </div>

              {/* Theory sections */}
              <div className="space-y-4">
                {topic.theory.sections.map((section, i) => (
                  <div key={i} className={`rounded-xl overflow-hidden transition-all duration-300 ${i === currentTheorySection ? 'ring-1 ring-indigo-500/40' : ''}`}
                    style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <button
                      className="w-full flex items-center justify-between p-5 text-left"
                      onClick={() => setCurrentTheorySection(i === currentTheorySection ? -1 : i)}>
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-400"
                          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                          {i + 1}
                        </div>
                        <h3 className="font-semibold text-white">{section.title}</h3>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${i === currentTheorySection ? 'rotate-90' : ''}`} />
                    </button>

                    {i === currentTheorySection && (
                      <div className="px-5 pb-5 border-t border-indigo-500/10">
                        <p className="text-slate-300 leading-relaxed mt-4 mb-4">{section.content}</p>
                        {section.formula && (
                          <div className="inline-block px-4 py-2 rounded-xl font-mono text-sm"
                            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
                            {section.formula}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Next button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setActiveSection('experiment')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  Next: Experiment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* EXPERIMENT SECTION */}
          {activeSection === 'experiment' && topic.experiments.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="text-xs text-emerald-400 font-medium mb-2 flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5" />
                  INTERACTIVE EXPERIMENT
                </div>
                <h1 className="text-3xl font-black text-white mb-3">{topic.experiments[0].name}</h1>
                <p className="text-slate-400 leading-relaxed">{topic.experiments[0].description}</p>
              </div>

              {/* Chemicals and equipment */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div className="text-xs text-emerald-400 font-medium mb-3">CHEMICALS NEEDED</div>
                  <div className="space-y-2">
                    {topic.experiments[0].chemicals.map(chemId => {
                      const chem = CHEMICALS.find(c => c.id === chemId);
                      if (!chem) return null;
                      return (
                        <div key={chemId} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-sm text-slate-300">{chem.name}</span>
                          <span className="text-xs text-slate-500 font-mono">({chem.formula})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <div className="text-xs text-indigo-400 font-medium mb-3">EQUIPMENT</div>
                  <div className="space-y-2">
                    {topic.experiments[0].equipment.slice(0, 4).map((eqId, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="text-sm text-slate-300 capitalize">{eqId.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Procedure */}
              <div className="rounded-xl p-5 mb-6" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <div className="text-xs text-slate-400 font-medium mb-4">PROCEDURE</div>
                <div className="space-y-3">
                  {topic.experiments[0].steps.map((step, i) => (
                    <div key={i} className={`flex gap-3 items-start p-3 rounded-lg transition-all ${
                      experimentRunning && currentExpStep === i
                        ? 'ring-1 ring-indigo-500'
                        : ''
                    }`}
                      style={{
                        background: experimentRunning && currentExpStep === i
                          ? 'rgba(99,102,241,0.15)'
                          : experimentRunning && currentExpStep > i
                          ? 'rgba(16,185,129,0.08)'
                          : 'rgba(30,41,59,0.3)',
                        border: '1px solid transparent',
                      }}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                        experimentRunning && currentExpStep > i
                          ? 'bg-emerald-500 text-white'
                          : experimentRunning && currentExpStep === i
                          ? 'bg-indigo-500 text-white'
                          : 'text-slate-500'
                      }`}
                        style={
                          !(experimentRunning && (currentExpStep > i || currentExpStep === i))
                            ? { background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(99,102,241,0.2)' }
                            : {}
                        }>
                        {experimentRunning && currentExpStep > i ? <Check className="w-3 h-3" /> : i + 1}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Run button */}
              {!experimentResult ? (
                <button
                  onClick={runExperiment}
                  disabled={experimentRunning}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                  <Play className={`w-4 h-4 ${experimentRunning ? 'animate-spin' : ''}`} />
                  {experimentRunning ? 'Running Experiment...' : 'Start Experiment'}
                </button>
              ) : (
                <div>
                  {/* Results */}
                  <div className="rounded-xl p-5 mb-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="font-semibold text-white">Experiment Complete!</span>
                    </div>
                    <div className="text-xs text-emerald-400 font-medium mb-2">REACTION</div>
                    <div className="font-mono text-indigo-300 text-sm mb-3">{experimentResult.equation}</div>
                    <div className="text-xs text-slate-400 font-medium mb-2">EXPECTED OBSERVATIONS</div>
                    <p className="text-slate-300 text-sm leading-relaxed">{topic.experiments[0].expectedObservations}</p>
                    {experimentResult.observations.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {experimentResult.observations.map((obs, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-xs"
                            style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}>
                            {obs}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => { setActiveSection('ai'); }}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white text-sm"
                      style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
                      <Brain className="w-4 h-4" />
                      Ask AI Tutor
                    </button>
                    <button onClick={() => setActiveSection('quiz')}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white text-sm"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                      <HelpCircle className="w-4 h-4" />
                      Take Quiz
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI TUTOR SECTION */}
          {activeSection === 'ai' && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <div className="text-xs text-purple-400 font-medium mb-2 flex items-center gap-2">
                  <Brain className="w-3.5 h-3.5" />
                  AI TUTOR
                </div>
                <h1 className="text-2xl font-black text-white mb-2">Ask ChemBot About {topic.name}</h1>
                <p className="text-slate-400 text-sm">Get personalized explanations about this topic.</p>
              </div>

              <AIAssistant
                context={{
                  topic: topic.name,
                  gradeLevel: CURRICULUM[gradeId]?.name,
                  currentExperiment: topic.experiments[0]?.name,
                  reactionResult: experimentResult,
                }}
                className="h-[500px]"
              />

              <div className="mt-6 flex justify-end">
                <button onClick={() => setActiveSection('quiz')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                  Take Quiz
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* QUIZ SECTION */}
          {activeSection === 'quiz' && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="text-xs text-amber-400 font-medium mb-2 flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  QUIZ
                </div>
                <h1 className="text-2xl font-black text-white mb-2">{topic.name} Quiz</h1>
                <p className="text-slate-400 text-sm">Test your understanding with {topic.quiz.length} questions.</p>
              </div>

              {quizSubmitted ? (
                /* Results */
                <div className="text-center py-10">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: quizScore >= 80 ? 'rgba(16,185,129,0.2)' : quizScore >= 60 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                      border: `2px solid ${quizScore >= 80 ? 'rgba(16,185,129,0.5)' : quizScore >= 60 ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)'}`,
                    }}>
                    <div className="text-3xl font-black"
                      style={{ color: quizScore >= 80 ? '#6ee7b7' : quizScore >= 60 ? '#fcd34d' : '#fca5a5' }}>
                      {quizScore}%
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {quizScore >= 80 ? '🎉 Excellent!' : quizScore >= 60 ? '👍 Good Job!' : '📚 Keep Studying!'}
                  </h2>
                  <p className="text-slate-400 mb-8">
                    You got {topic.quiz.filter(q => quizAnswers[q.id] === q.answer).length} out of {topic.quiz.length} correct.
                  </p>

                  {/* Review answers */}
                  <div className="text-left space-y-4 mb-8">
                    {topic.quiz.map((q, i) => {
                      const isCorrect = quizAnswers[q.id] === q.answer;
                      return (
                        <div key={q.id} className="rounded-xl p-4"
                          style={{
                            background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                            border: isCorrect ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.25)',
                          }}>
                          <div className="flex items-start gap-3 mb-3">
                            {isCorrect
                              ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              : <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            }
                            <div>
                              <p className="text-sm text-white font-medium mb-1">{q.question}</p>
                              {!isCorrect && q.options && (
                                <p className="text-xs text-red-300 mb-1">
                                  Your answer: {q.options[quizAnswers[q.id] as number] ?? 'Not answered'}
                                </p>
                              )}
                              {q.options && (
                                <p className="text-xs text-emerald-300 mb-1">
                                  Correct: {q.options[q.answer as number]}
                                </p>
                              )}
                              <p className="text-xs text-slate-400">{q.explanation}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(0); }}
                      className="px-6 py-2.5 rounded-xl text-sm font-medium"
                      style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(99,102,241,0.2)', color: '#94a3b8' }}>
                      Retry Quiz
                    </button>
                    <Link href={`/curriculum/${gradeId}`}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white text-sm"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      <Trophy className="w-4 h-4" />
                      Back to Topics
                    </Link>
                  </div>
                </div>
              ) : (
                /* Questions */
                <div className="space-y-6">
                  {topic.quiz.map((q, i) => (
                    <div key={q.id} className="rounded-xl p-5"
                      style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
                      <div className="flex items-start gap-3 mb-4">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0"
                          style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
                          {i + 1}
                        </span>
                        <h3 className="text-sm font-medium text-white leading-relaxed">{q.question}</h3>
                      </div>

                      <div className="space-y-2 ml-10">
                        {(q.options || ['True', 'False']).map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleQuizAnswer(q.id, optIdx)}
                            className="quiz-option w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all"
                            style={{
                              background: quizAnswers[q.id] === optIdx
                                ? 'rgba(99,102,241,0.15)'
                                : 'rgba(30,41,59,0.4)',
                              border: quizAnswers[q.id] === optIdx
                                ? '1px solid rgba(99,102,241,0.5)'
                                : '1px solid rgba(99,102,241,0.1)',
                              color: quizAnswers[q.id] === optIdx ? '#a5b4fc' : '#94a3b8',
                            }}>
                            <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < topic.quiz.length}
                    className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                    Submit Quiz ({Object.keys(quizAnswers).length}/{topic.quiz.length} answered)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
