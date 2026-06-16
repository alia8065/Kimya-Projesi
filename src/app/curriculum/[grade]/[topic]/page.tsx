'use client';
import { use, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getTopic, GRADE_INFO, GradeLevel } from '@/lib/curriculum';
import { useStore } from '@/lib/store';

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

export default function TopicPage({ params }: { params: Promise<{ grade: string; topic: string }> }) {
  const { grade, topic: topicId } = use(params);
  const gradeLevel = grade as GradeLevel;
  const topic = getTopic(topicId);
  const info = topic ? GRADE_INFO[gradeLevel] : null;

  const { topicProgress, completeExperiment, setQuizScore, completeTopic, addXP, unlockAchievement } = useStore();
  const progress = topicProgress[topicId] || { topicId, completed: false, experimentCompleted: false };

  const [activeSection, setActiveSection] = useState<'theory' | 'experiment' | 'ai' | 'quiz'>('theory');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const [theorySection, setTheorySection] = useState(0);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  if (!topic || !info) {
    return (
      <div className="min-h-screen lab-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Topic not found</p>
          <Link href={`/curriculum/${grade}`} className="text-cyan-400 mt-2 block">← Back to {grade}</Link>
        </div>
      </div>
    );
  }

  const completeStep = (stepIdx: number) => {
    const newSet = new Set(completedSteps).add(stepIdx);
    setCompletedSteps(newSet);
    if (newSet.size === topic.experiment.steps.length) {
      completeExperiment(topicId);
      addXP(Math.floor(topic.xpReward * 0.4));
      if (currentStep < topic.experiment.steps.length - 1) setCurrentStep(stepIdx + 1);
    } else {
      if (stepIdx === currentStep && stepIdx < topic.experiment.steps.length - 1) {
        setCurrentStep(stepIdx + 1);
      }
    }
  };

  const submitQuiz = () => {
    const total = topic.quiz.length;
    const correct = topic.quiz.filter((q, i) => quizAnswers[i] === q.correct).length;
    const score = Math.round((correct / total) * 100);
    setQuizScore(topicId, score);
    setQuizSubmitted(true);
    addXP(Math.floor(topic.xpReward * 0.4));
    if (score === 100) {
      unlockAchievement({ id: 'perfect_quiz', title: 'Perfect Score', description: 'Get 100% on a quiz', icon: '⭐', xp: 100 });
    }
    if (progress.experimentCompleted) {
      completeTopic(topicId);
      addXP(Math.floor(topic.xpReward * 0.2));
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || chatLoading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatLoading(true);
    try {
      const context = `Topic: ${topic.title} (${topic.titleTr}), Grade: ${grade}. Key points: ${topic.theory.keyPoints.join('; ')}`;
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, context, mode: 'curriculum' }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Could not process request.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const quizScore = topicProgress[topicId]?.quizScore;
  const allStepsCompleted = completedSteps.size === topic.experiment.steps.length;

  const SECTIONS = [
    { key: 'theory' as const, label: 'Theory', icon: '📖' },
    { key: 'experiment' as const, label: 'Experiment', icon: '🧪' },
    { key: 'ai' as const, label: 'AI Tutor', icon: '🤖' },
    { key: 'quiz' as const, label: 'Quiz', icon: '📝' },
  ];

  return (
    <div className="min-h-screen lab-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${info.color}22` }}>
        <div className="flex items-center gap-3">
          <Link href={`/curriculum/${grade}`} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="text-2xl">{topic.icon}</div>
          <div>
            <h1 className="text-base font-bold text-white">{topic.titleTr}</h1>
            <p className="text-xs text-gray-500">{info.label} · {topic.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">⏱ {topic.duration} min</span>
          <span className="text-xs" style={{ color: info.color }}>⭐ {topic.xpReward} XP</span>
          {progress.completed && <span className="badge badge-green">✓ Complete</span>}
        </div>
      </header>

      {/* Section tabs */}
      <div className="flex border-b px-4" style={{ borderColor: `${info.color}22` }}>
        {SECTIONS.map((section, idx) => {
          const done = section.key === 'experiment' ? progress.experimentCompleted :
            section.key === 'quiz' ? quizScore !== undefined : false;
          return (
            <button key={section.key} onClick={() => setActiveSection(section.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeSection === section.key ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              style={{ borderBottom: activeSection === section.key ? `2px solid ${info.color}` : '2px solid transparent' }}>
              <span>{section.icon}</span>
              <span className="hidden sm:inline">{section.label}</span>
              {done && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
            </button>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* THEORY */}
        {activeSection === 'theory' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Theory</h2>
              <div className="flex gap-2">
                {topic.theory.sections.map((_, i) => (
                  <button key={i} onClick={() => setTheorySection(i)}
                    className="w-2 h-2 rounded-full transition-colors"
                    style={{ background: theorySection === i ? info.color : 'rgba(255,255,255,0.2)' }} />
                ))}
              </div>
            </div>

            <div className="glass-card p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: info.color }}>
                {topic.theory.sections[theorySection].title}
              </h3>
              <div className="text-gray-300 leading-relaxed text-sm space-y-3">
                {topic.theory.sections[theorySection].content.split('\n').map((line, i) => {
                  if (!line.trim()) return null;
                  const formatted = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                    .replace(/•\s*(.*)/g, '<span class="flex items-start gap-2 my-1"><span style="color:' + info.color + '">•</span><span>$1</span></span>');
                  return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
                })}
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <button onClick={() => setTheorySection(Math.max(0, theorySection - 1))}
                disabled={theorySection === 0}
                className="px-4 py-2 rounded-lg text-sm disabled:opacity-30 transition-colors text-gray-400 hover:text-white"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                ← Previous
              </button>
              {theorySection < topic.theory.sections.length - 1 ? (
                <button onClick={() => setTheorySection(theorySection + 1)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: `${info.color}22`, border: `1px solid ${info.color}44`, color: info.color }}>
                  Next Section →
                </button>
              ) : (
                <button onClick={() => setActiveSection('experiment')}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-black transition-colors"
                  style={{ background: info.color }}>
                  Start Experiment →
                </button>
              )}
            </div>

            {/* Key points */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-3">Key Points</h3>
              <ul className="space-y-2">
                {topic.theory.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span style={{ color: info.color }} className="mt-0.5 flex-shrink-0">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* EXPERIMENT */}
        {activeSection === 'experiment' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">{topic.experiment.title}</h2>
              <p className="text-sm text-gray-400">{topic.experiment.objective}</p>
            </div>

            {/* Materials */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Chemicals</h3>
                <div className="flex flex-wrap gap-1.5">
                  {topic.experiment.chemicals.map(chem => (
                    <span key={chem} className="badge badge-cyan text-xs">{chem.toUpperCase()}</span>
                  ))}
                  {topic.experiment.chemicals.length === 0 && <span className="text-xs text-gray-600">No chemicals required</span>}
                </div>
              </div>
              <div className="glass-card p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Equipment</h3>
                <div className="flex flex-wrap gap-1.5">
                  {topic.experiment.equipment.map(eq => (
                    <span key={eq} className="badge badge-purple text-xs">{eq.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-white">Procedure</h3>
              {topic.experiment.steps.map((step, idx) => {
                const isCompleted = completedSteps.has(idx);
                const isCurrent = idx === currentStep;
                const isLocked = idx > currentStep && !completedSteps.has(idx - 1);

                return (
                  <div key={step.id}
                    className={`p-4 rounded-xl transition-all ${isCurrent ? 'ring-1' : ''}`}
                    style={{
                      background: isCompleted ? 'rgba(16,185,129,0.08)' : isCurrent ? `${info.color}08` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isCompleted ? 'rgba(16,185,129,0.3)' : isCurrent ? `${info.color}44` : 'rgba(255,255,255,0.06)'}`,
                      opacity: isLocked ? 0.5 : 1,
                    }}>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: isCompleted ? 'rgba(16,185,129,0.2)' : isCurrent ? `${info.color}22` : 'rgba(255,255,255,0.05)', color: isCompleted ? '#10b981' : isCurrent ? info.color : '#666' }}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-200 mb-1">{step.instruction}</p>
                        {step.hint && (
                          <p className="text-xs text-yellow-500 flex items-center gap-1 mb-1">
                            <span>💡</span> {step.hint}
                          </p>
                        )}
                        {step.expectedObservation && isCurrent && (
                          <p className="text-xs text-blue-400 flex items-center gap-1">
                            <span>👁</span> Expected: {step.expectedObservation}
                          </p>
                        )}
                        {isCompleted && step.expectedObservation && (
                          <p className="text-xs text-green-400">✓ {step.expectedObservation}</p>
                        )}
                      </div>
                      {isCurrent && !isCompleted && (
                        <button onClick={() => completeStep(idx)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-colors text-black"
                          style={{ background: info.color }}>
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Expected results */}
            <div className="glass-card p-5 mb-6">
              <h3 className="font-semibold text-white mb-2">Expected Results</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{topic.experiment.expectedResults}</p>
            </div>

            {allStepsCompleted && (
              <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <div className="text-2xl mb-2">🎉</div>
                <p className="text-green-400 font-semibold">Experiment Complete!</p>
                <p className="text-xs text-gray-500 mt-1">+{Math.floor(topic.xpReward * 0.4)} XP earned</p>
                <button onClick={() => setActiveSection('quiz')}
                  className="mt-3 px-4 py-2 rounded-lg text-sm text-black font-medium"
                  style={{ background: '#10b981' }}>
                  Take the Quiz →
                </button>
              </div>
            )}
          </div>
        )}

        {/* AI TUTOR */}
        {activeSection === 'ai' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">AI Chemistry Tutor</h2>
            <div className="glass-card flex flex-col" style={{ height: 500 }}>
              <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">🤖</div>
                  <p className="text-sm text-gray-400">I am your AI chemistry tutor for <strong className="text-white">{topic.titleTr}</strong>.</p>
                  <p className="text-xs text-gray-600 mt-1">Ask me anything about this topic!</p>
                </div>

                {messages.length === 0 && (
                  <div className="space-y-2">
                    {[
                      `What are the key concepts in ${topic.title}?`,
                      ...topic.quiz.slice(0, 2).map(q => q.question.substring(0, 60) + '...'),
                      `Explain ${topic.theory.sections[0].title} simply`,
                    ].map(q => (
                      <button key={q} onClick={() => setInput(q)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed`}
                      style={{
                        background: msg.role === 'user' ? `${info.color}22` : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${msg.role === 'user' ? `${info.color}44` : 'rgba(255,255,255,0.08)'}`,
                        color: msg.role === 'user' ? 'white' : '#d1d5db',
                      }}>
                      {msg.role === 'assistant' && <span className="font-semibold block mb-1" style={{ color: info.color }}>🤖 AI Tutor</span>}
                      <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="px-3 py-2 rounded-xl text-xs" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <span className="font-semibold" style={{ color: info.color }}>🤖 AI Tutor</span>
                      <div className="flex gap-1 mt-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: info.color, animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex gap-2">
                  <input type="text" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about this topic..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${info.color}33` }}
                  />
                  <button onClick={sendMessage} disabled={chatLoading || !input.trim()}
                    className="px-3 py-2 rounded-lg text-sm disabled:opacity-40 transition-all"
                    style={{ background: `${info.color}22`, border: `1px solid ${info.color}44`, color: info.color }}>
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {activeSection === 'quiz' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Quiz</h2>
              {quizScore !== undefined && !quizSubmitted && (
                <span className="badge badge-green">Best: {quizScore}%</span>
              )}
            </div>

            {quizSubmitted || quizScore !== undefined ? (
              <div>
                {/* Results */}
                <div className="glass-card p-6 text-center mb-6">
                  <div className="text-4xl mb-2">{(quizSubmitted ? topicProgress[topicId]?.quizScore : quizScore) === 100 ? '🏆' : '📊'}</div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {quizSubmitted ? topicProgress[topicId]?.quizScore : quizScore}%
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {topic.quiz.filter((q, i) => quizAnswers[i] === q.correct).length}/{topic.quiz.length} correct
                  </p>
                </div>

                <div className="space-y-4">
                  {topic.quiz.map((q, qi) => {
                    const userAns = quizAnswers[qi];
                    const isCorrect = userAns === q.correct;
                    return (
                      <div key={q.id} className="glass-card p-4">
                        <p className="text-sm font-medium text-white mb-3">{qi + 1}. {q.question}</p>
                        <div className="space-y-2 mb-3">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="px-3 py-2 rounded-lg text-xs"
                              style={{
                                background: oi === q.correct ? 'rgba(16,185,129,0.12)' : oi === userAns && !isCorrect ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${oi === q.correct ? 'rgba(16,185,129,0.4)' : oi === userAns && !isCorrect ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)'}`,
                                color: oi === q.correct ? '#10b981' : oi === userAns && !isCorrect ? '#ef4444' : '#9ca3af',
                              }}>
                              {oi === q.correct ? '✓ ' : oi === userAns && !isCorrect ? '✗ ' : ''}{opt}
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-blue-400 p-2 rounded" style={{ background: 'rgba(59,130,246,0.08)' }}>
                          💡 {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                  className="mt-4 w-full py-2 rounded-xl text-sm transition-colors"
                  style={{ background: `${info.color}15`, border: `1px solid ${info.color}33`, color: info.color }}>
                  Retake Quiz
                </button>
              </div>
            ) : (
              <div>
                <div className="space-y-5 mb-6">
                  {topic.quiz.map((q, qi) => (
                    <div key={q.id} className="glass-card p-5">
                      <p className="text-sm font-medium text-white mb-4">
                        <span style={{ color: info.color }}>{qi + 1}.</span> {q.question}
                        <span className="ml-2 badge badge-cyan">{q.type.replace('-', ' ')}</span>
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="quiz-option" onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                            style={{
                              background: quizAnswers[qi] === oi ? `${info.color}12` : undefined,
                              borderColor: quizAnswers[qi] === oi ? info.color : undefined,
                              color: quizAnswers[qi] === oi ? 'white' : '#9ca3af',
                            }}>
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full border flex items-center justify-center text-xs flex-shrink-0"
                                style={{ borderColor: quizAnswers[qi] === oi ? info.color : 'rgba(255,255,255,0.2)', background: quizAnswers[qi] === oi ? `${info.color}22` : 'transparent', color: quizAnswers[qi] === oi ? info.color : 'transparent' }}>
                                {quizAnswers[qi] === oi ? '●' : ''}
                              </div>
                              <span className="text-sm">{opt}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length < topic.quiz.length}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed text-black"
                  style={{ background: info.color }}>
                  Submit Quiz ({Object.keys(quizAnswers).length}/{topic.quiz.length} answered)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
