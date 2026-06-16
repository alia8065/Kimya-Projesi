"use client";

import { use, useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, FlaskConical, Brain, HelpCircle,
  CheckCircle, ChevronRight, Play, Check, X, Trophy, ArrowRight,
  Droplets, Wind, Thermometer, Zap, RotateCcw,
} from "lucide-react";
import { CURRICULUM, getTopic } from "@/lib/curriculum";
import { CHEMICALS } from "@/lib/chemicals";
import { EQUIPMENT } from "@/lib/equipment";
import { simulateReaction } from "@/lib/reactions";
import { useLabStore } from "@/store/labStore";
import AIAssistant from "@/components/lab/AIAssistant";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ grade: string; topic: string }>;
}

type Section = 'theory' | 'experiment' | 'ai' | 'quiz';

/* ── Colour palette for liquid fills ─────────────────────── */
const LIQUID_COLORS: Record<string, string> = {
  colorless:      'rgba(180,210,255,0.18)',
  blue:           'rgba(59,130,246,0.55)',
  'deep blue':    'rgba(29,78,216,0.65)',
  purple:         'rgba(147,51,234,0.55)',
  violet:         'rgba(139,92,246,0.55)',
  green:          'rgba(16,185,129,0.45)',
  yellow:         'rgba(234,179,8,0.45)',
  orange:         'rgba(249,115,22,0.45)',
  red:            'rgba(239,68,68,0.45)',
  brown:          'rgba(120,53,15,0.55)',
  pink:           'rgba(236,72,153,0.45)',
  white:          'rgba(240,240,255,0.25)',
  'pale blue':    'rgba(147,197,253,0.35)',
};

/* ── Mini Flask SVG Component ─────────────────────────────── */
function SimFlask({
  label,
  color = 'rgba(180,210,255,0.18)',
  fillPct = 60,
  hasBubbles = false,
  hasPrecipitate = false,
  isActive = false,
}: {
  label: string;
  color?: string;
  fillPct?: number;
  hasBubbles?: boolean;
  hasPrecipitate?: boolean;
  isActive?: boolean;
}) {
  const fillY = 110 - (fillPct * 0.65);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 80, height: 100 }}>
        <svg viewBox="0 0 80 100" width="80" height="100"
          style={{ filter: isActive ? 'drop-shadow(0 0 12px rgba(99,102,241,0.6))' : 'none', transition: 'filter 0.3s' }}>
          <path d="M28 8 L28 40 L6 82 Q6 92 16 92 L64 92 Q74 92 74 82 L52 40 L52 8 Z"
            fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
          <rect x="24" y="3" width="32" height="10" rx="3"
            fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
          <clipPath id={`flask-clip-${label}`}>
            <path d="M29 8 L29 40 L8 82 Q8 90 16 90 L64 90 Q72 90 72 82 L51 40 L51 8 Z" />
          </clipPath>
          {fillPct > 0 && (
            <rect x="0" y={fillY} width="80" height="100"
              fill={color}
              clipPath={`url(#flask-clip-${label})`}
              style={{ transition: 'fill 1s ease, y 0.8s ease' }} />
          )}
          {hasPrecipitate && (
            <rect x="12" y="84" width="56" height="6" rx="2"
              fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"
              clipPath={`url(#flask-clip-${label})`} />
          )}
          {hasBubbles && [20, 35, 50, 65].map((cx, i) => (
            <circle key={i} cx={cx} cy={fillY + 5} r="2.5"
              fill="rgba(255,255,255,0.45)"
              className="bubble" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </svg>
      </div>
      <span className="text-xs text-slate-400 text-center leading-tight">{label}</span>
    </div>
  );
}

/* ── Beaker SVG ──────────────────────────────────────────── */
function SimBeaker({
  label, color = 'rgba(180,210,255,0.18)', fillPct = 50, isActive = false,
}: { label: string; color?: string; fillPct?: number; isActive?: boolean }) {
  const fillY = 90 - fillPct * 0.6;
  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: 72, height: 90 }}>
        <svg viewBox="0 0 72 90" width="72" height="90"
          style={{ filter: isActive ? 'drop-shadow(0 0 10px rgba(16,185,129,0.5))' : 'none', transition: 'filter 0.3s' }}>
          <path d="M6 4 L66 4 L66 82 Q66 88 60 88 L12 88 Q6 88 6 82 Z"
            fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.4)" strokeWidth="2" />
          <clipPath id={`beaker-clip-${label}`}>
            <path d="M7 4 L65 4 L65 82 Q65 87 60 87 L12 87 Q7 87 7 82 Z" />
          </clipPath>
          {fillPct > 0 && (
            <rect x="0" y={fillY} width="72" height="90"
              fill={color}
              clipPath={`url(#beaker-clip-${label})`}
              style={{ transition: 'fill 1s ease, y 0.8s ease' }} />
          )}
          {[20, 30, 40, 50, 60].map(y => (
            <line key={y} x1="62" y1={y} x2="70" y2={y}
              stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
          ))}
        </svg>
      </div>
      <span className="text-xs text-slate-400 text-center leading-tight">{label}</span>
    </div>
  );
}

/* ── Burette SVG ─────────────────────────────────────────── */
function SimBurette({ dripping = false, liquidLevel = 100 }: { dripping?: boolean; liquidLevel?: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: 30, height: 160 }}>
        <svg viewBox="0 0 30 160" width="30" height="160">
          <rect x="8" y="4" width="14" height="130" rx="3"
            fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
          <clipPath id="burette-clip">
            <rect x="9" y="4" width="12" height="130" rx="2" />
          </clipPath>
          <rect x="9" y={4 + (100 - liquidLevel) * 1.3} width="12" height="130"
            fill="rgba(59,130,246,0.5)" clipPath="url(#burette-clip)"
            style={{ transition: 'y 0.8s ease' }} />
          <rect x="10" y="134" width="10" height="8" rx="2"
            fill="rgba(99,102,241,0.3)" stroke="rgba(99,102,241,0.5)" strokeWidth="1" />
          <line x1="15" y1="142" x2="15" y2="152"
            stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
          {dripping && (
            <circle cx="15" cy="158" r="3" fill="rgba(59,130,246,0.8)" className="bubble" />
          )}
        </svg>
      </div>
      <span className="text-xs text-slate-400">Burette</span>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────── */
export default function TopicPage({ params }: Props) {
  const { grade: gradeId, topic: topicId } = use(params);
  const topic = getTopic(gradeId, topicId);
  if (!topic) notFound();

  const [activeSection, setActiveSection] = useState<Section>('theory');
  const [currentTheorySection, setCurrentTheorySection] = useState(0);

  /* Experiment state */
  const [currentStep, setCurrentStep]       = useState(-1);   // -1 = not started
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [experimentDone, setExperimentDone] = useState(false);
  const [experimentResult, setExperimentResult] = useState<ReturnType<typeof simulateReaction> | null>(null);

  /* Visual simulation state */
  const [flaskColor, setFlaskColor]         = useState('rgba(180,210,255,0.12)');
  const [flaskFill, setFlaskFill]           = useState(0);
  const [hasBubbles, setHasBubbles]         = useState(false);
  const [hasPrecipitate, setHasPrecipitate] = useState(false);
  const [buretteFill, setBuretteFill]       = useState(100);
  const [dripping, setDripping]             = useState(false);
  const [simMessage, setSimMessage]         = useState('');
  const [isAnimating, setIsAnimating]       = useState(false);

  /* Quiz state */
  const [quizAnswers, setQuizAnswers]       = useState<Record<string, number | null>>({});
  const [quizSubmitted, setQuizSubmitted]   = useState(false);
  const [quizScore, setQuizScore]           = useState(0);

  const { addXP, completeTopicProgress, getTopicProgress } = useLabStore();
  const topicProgress = getTopicProgress(gradeId, topicId);

  const grade   = CURRICULUM[gradeId];
  const exp     = topic.experiments[0];
  const steps   = exp?.steps ?? [];

  const SECTIONS: { id: Section; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'theory',     label: 'Theory',     icon: <BookOpen className="w-4 h-4" />,    color: '#6366f1' },
    { id: 'experiment', label: 'Experiment', icon: <FlaskConical className="w-4 h-4" />, color: '#10b981' },
    { id: 'ai',         label: 'AI Tutor',   icon: <Brain className="w-4 h-4" />,       color: '#8b5cf6' },
    { id: 'quiz',       label: 'Quiz',       icon: <HelpCircle className="w-4 h-4" />,  color: '#f59e0b' },
  ];

  /* Perform a step — animate the simulation */
  const doStep = useCallback(async (stepIdx: number) => {
    if (isAnimating || completedSteps.has(stepIdx)) return;
    setIsAnimating(true);
    setCurrentStep(stepIdx);

    const totalSteps = steps.length;
    const progress   = (stepIdx + 1) / totalSteps;

    /* Update flask fill gradually */
    setFlaskFill(Math.min(70, progress * 70));

    /* Step-specific visual changes */
    const stepText = steps[stepIdx].toLowerCase();

    if (stepText.includes('fill') || stepText.includes('add') || stepText.includes('dissolve') || stepText.includes('pipette')) {
      setFlaskFill(prev => Math.min(prev + 20, 70));
      setSimMessage('Adding reagent…');
    }
    if (stepText.includes('heat') || stepText.includes('hot')) {
      setSimMessage('Heating solution…');
      setFlaskColor('rgba(239,120,40,0.35)');
    }
    if (stepText.includes('stir') || stepText.includes('mix') || stepText.includes('swirl')) {
      setSimMessage('Mixing…');
    }
    if (stepText.includes('indicator') || stepText.includes('pink') || stepText.includes('colour') || stepText.includes('color')) {
      setFlaskColor('rgba(236,72,153,0.35)');
      setSimMessage('Indicator added — solution turns pink…');
    }
    if (stepText.includes('nacl') || stepText.includes('naoh') || stepText.includes('titrant') || stepText.includes('burette')) {
      setBuretteFill(prev => Math.max(0, prev - 25));
      setDripping(true);
      setSimMessage('Adding titrant drop by drop…');
      await new Promise(r => setTimeout(r, 600));
      setDripping(false);
    }
    if (stepText.includes('endpoint') || stepText.includes('colour disappear') || stepText.includes('permanent') || stepText.includes('colorless')) {
      setFlaskColor('rgba(180,210,255,0.12)');
      setSimMessage('Endpoint reached — colour disappears!');
    }
    if (stepText.includes('precipitate') || stepText.includes('white') || stepText.includes('blue')) {
      setHasPrecipitate(true);
      setSimMessage('Precipitate forming…');
    }
    if (stepText.includes('gas') || stepText.includes('bubble') || stepText.includes('fizz') || stepText.includes('co₂')) {
      setHasBubbles(true);
      setSimMessage('Gas evolving — bubbles visible!');
    }

    await new Promise(r => setTimeout(r, 800));

    setCompletedSteps(prev => new Set([...prev, stepIdx]));
    setIsAnimating(false);
    setSimMessage('');

    /* Last step → run reaction engine & mark done */
    if (stepIdx === totalSteps - 1) {
      const result = simulateReaction(exp.chemicals);
      setExperimentResult(result);
      setExperimentDone(true);
      addXP(25);

      /* Apply reaction result to simulation */
      if (result.colorChange) {
        setFlaskColor(LIQUID_COLORS[result.colorChange.toLowerCase()] ?? 'rgba(180,210,255,0.18)');
      }
      if (result.precipitate) setHasPrecipitate(true);
      if (result.gasProduced) setHasBubbles(true);

      completeTopicProgress({
        topicId,
        gradeId,
        quizScore: topicProgress?.quizScore ?? 0,
        experimentDone: true,
      });
    }
  }, [isAnimating, completedSteps, steps, exp, addXP, completeTopicProgress, topicId, gradeId, topicProgress]);

  const resetExperiment = () => {
    setCurrentStep(-1);
    setCompletedSteps(new Set());
    setExperimentDone(false);
    setExperimentResult(null);
    setFlaskColor('rgba(180,210,255,0.12)');
    setFlaskFill(0);
    setHasBubbles(false);
    setHasPrecipitate(false);
    setBuretteFill(100);
    setDripping(false);
  };

  /* Quiz handlers */
  const handleQuizAnswer = (qId: string, idx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: idx }));
  };

  const submitQuiz = () => {
    let correct = 0;
    topic.quiz.forEach(q => { if (quizAnswers[q.id] === q.answer) correct++; });
    const score = Math.round((correct / topic.quiz.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    addXP(score >= 80 ? 50 : score >= 60 ? 30 : 15);
    completeTopicProgress({
      topicId, gradeId,
      quizScore: score,
      experimentDone: experimentDone || !!topicProgress?.experimentDone,
    });
  };

  /* Detect equipment */
  const hasBurette   = exp?.equipment.includes('burette')   ?? false;
  const hasHotPlate  = exp?.equipment.includes('hot_plate') ?? false;
  const hasPHMeter   = exp?.equipment.includes('ph_meter')  ?? false;
  const hasTherm     = exp?.equipment.includes('thermometer') ?? false;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0e1a', color: '#e2e8f0' }}>
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="relative z-10 border-b border-indigo-500/15 px-4 py-3"
        style={{ background: 'rgba(10,14,26,0.98)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link href={`/curriculum/${gradeId}`}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{grade?.shortName ?? 'Back'}</span>
            </Link>
            <div className="w-px h-4 bg-slate-600 hidden sm:block" />
            <span className="text-base flex-shrink-0">{topic.icon}</span>
            <span className="font-semibold text-white text-sm truncate">{topic.name}</span>
            {(topicProgress?.experimentDone || experimentDone) && (
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
          </div>

          {/* Section tabs — scroll on mobile */}
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0"
                style={{
                  background: activeSection === s.id ? `${s.color}20` : 'transparent',
                  border:     activeSection === s.id ? `1px solid ${s.color}50` : '1px solid transparent',
                  color:      activeSection === s.id ? s.color : '#94a3b8',
                }}>
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6">

        {/* ══ THEORY ══════════════════════════════════════════ */}
        {activeSection === 'theory' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="text-xs text-indigo-400 font-medium mb-2 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" /> THEORY
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">{topic.name}</h1>
              <p className="text-slate-400 leading-relaxed">{topic.description}</p>
            </div>

            <div className="space-y-3">
              {topic.theory.sections.map((section, i) => (
                <div key={i}
                  className={`rounded-xl overflow-hidden transition-all ${i === currentTheorySection ? 'ring-1 ring-indigo-500/40' : ''}`}
                  style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <button className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
                    onClick={() => setCurrentTheorySection(i === currentTheorySection ? -1 : i)}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0"
                        style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                        {i + 1}
                      </div>
                      <h3 className="font-semibold text-white text-sm sm:text-base">{section.title}</h3>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${i === currentTheorySection ? 'rotate-90' : ''}`} />
                  </button>
                  {i === currentTheorySection && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-indigo-500/10">
                      <p className="text-slate-300 leading-relaxed mt-4 mb-3 text-sm">{section.content}</p>
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

            <div className="mt-8 flex justify-end">
              <button onClick={() => setActiveSection('experiment')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                Go to Experiment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══ EXPERIMENT ══════════════════════════════════════ */}
        {activeSection === 'experiment' && exp && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-emerald-400 font-medium mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5" /> INTERACTIVE EXPERIMENT
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white">{exp.name}</h1>
                <p className="text-slate-400 text-sm mt-1">{exp.description}</p>
              </div>
              {(currentStep >= 0 || experimentDone) && (
                <button onClick={resetExperiment}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white flex-shrink-0 transition-colors"
                  style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>

            {/* ── SIMULATION AREA ── */}
            <div className="rounded-2xl overflow-hidden mb-5"
              style={{ background: 'rgba(8,12,22,0.9)', border: '1px solid rgba(99,102,241,0.2)' }}>

              {/* Top bar — equipment readings */}
              <div className="flex items-center gap-3 px-4 py-2 border-b border-indigo-500/10 flex-wrap"
                style={{ background: 'rgba(15,23,42,0.6)' }}>
                <span className="text-xs font-medium text-slate-400">Lab Instruments</span>
                {hasPHMeter && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                    pH: {experimentDone && experimentResult?.pHChange !== null ? experimentResult!.pHChange : '—'}
                  </div>
                )}
                {hasTherm && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
                    <Thermometer className="w-3 h-3" />
                    {experimentDone && experimentResult?.isExothermic ? '↑ Exothermic' : 'Room temp'}
                  </div>
                )}
                {hasBubbles && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#93c5fd' }}>
                    <Wind className="w-3 h-3" /> Gas evolving
                  </div>
                )}
                {hasPrecipitate && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                    style={{ background: 'rgba(248,250,252,0.05)', border: '1px solid rgba(248,250,252,0.15)', color: '#e2e8f0' }}>
                    <Droplets className="w-3 h-3" /> Precipitate
                  </div>
                )}
              </div>

              {/* Main sim canvas */}
              <div className="flex items-end justify-center gap-6 sm:gap-10 px-6 py-8 relative min-h-[200px]">
                {/* Background grid */}
                <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

                {/* Burette if applicable */}
                {hasBurette && (
                  <SimBurette dripping={dripping} liquidLevel={buretteFill} />
                )}

                {/* Reagent flasks — one per chemical */}
                {exp.chemicals.slice(0, 2).map((chemId, i) => {
                  const chem = CHEMICALS.find(c => c.id === chemId);
                  const isInStep = currentStep >= 0 && steps[currentStep]?.toLowerCase().includes(chemId.replace('_', ''));
                  return (
                    <SimFlask
                      key={chemId}
                      label={chem ? `${chem.formula}` : chemId}
                      color={LIQUID_COLORS[chem?.color?.toLowerCase() ?? ''] ?? 'rgba(180,210,255,0.18)'}
                      fillPct={currentStep >= 0 ? 65 : 0}
                      isActive={isInStep}
                    />
                  );
                })}

                {/* Main reaction beaker — in the center */}
                <div className="flex flex-col items-center gap-1 relative">
                  <SimBeaker
                    label="Reaction vessel"
                    color={flaskColor}
                    fillPct={flaskFill}
                    isActive={currentStep >= 0}
                  />
                  {/* Bubble animation overlay */}
                  {hasBubbles && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-blue-300 animate-bounce">
                      💨↑
                    </div>
                  )}
                </div>

                {/* Status message */}
                {simMessage && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs text-emerald-300 whitespace-nowrap"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    {simMessage}
                  </div>
                )}
              </div>

              {/* Reaction result banner */}
              {experimentDone && experimentResult && (
                <div className="mx-4 mb-4 rounded-xl p-4"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white">Experiment Complete!</span>
                    <span className="text-xs text-emerald-400 ml-auto">+25 XP</span>
                  </div>
                  <div className="font-mono text-indigo-300 text-sm mb-2 break-all">{experimentResult.equation}</div>
                  <p className="text-slate-300 text-xs leading-relaxed mb-3">{exp.expectedObservations}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {experimentResult.observations.map((obs, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs"
                        style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}>
                        {obs}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── STEP-BY-STEP PROCEDURE ── */}
            <div className="rounded-xl overflow-hidden mb-5"
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div className="px-4 py-3 border-b border-indigo-500/10 flex items-center justify-between"
                style={{ background: 'rgba(15,23,42,0.5)' }}>
                <span className="text-xs font-medium text-slate-400">
                  PROCEDURE — {completedSteps.size}/{steps.length} steps done
                </span>
                <div className="h-1.5 rounded-full bg-slate-700/50 w-28">
                  <div className="h-full rounded-full progress-bar"
                    style={{ width: `${steps.length > 0 ? (completedSteps.size / steps.length) * 100 : 0}%` }} />
                </div>
              </div>

              <div className="p-3 sm:p-4 space-y-2">
                {steps.map((step, i) => {
                  const done    = completedSteps.has(i);
                  const active  = currentStep === i && !done;
                  const locked  = i > 0 && !completedSteps.has(i - 1) && !done;

                  return (
                    <div key={i}
                      className="flex gap-3 items-start p-3 rounded-xl transition-all"
                      style={{
                        background: done    ? 'rgba(16,185,129,0.08)'
                                  : active  ? 'rgba(99,102,241,0.12)'
                                  :           'rgba(30,41,59,0.35)',
                        border:    done    ? '1px solid rgba(16,185,129,0.3)'
                                  : active  ? '1px solid rgba(99,102,241,0.4)'
                                  : locked  ? '1px solid rgba(30,41,59,0.3)'
                                  :           '1px solid rgba(99,102,241,0.15)',
                      }}>

                      {/* Step number / check */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-500 text-white' : 'text-slate-500'
                      }`}
                        style={!done && !active ? { background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(99,102,241,0.2)' } : {}}>
                        {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>

                      {/* Text */}
                      <p className={`text-sm leading-relaxed flex-1 ${done ? 'text-slate-400' : 'text-slate-200'}`}>
                        {step}
                      </p>

                      {/* Do It button */}
                      {!done && !locked && (
                        <button
                          onClick={() => doStep(i)}
                          disabled={isAnimating}
                          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                          style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: '#fff' }}>
                          <Play className={`w-3 h-3 ${isAnimating && active ? 'animate-spin' : ''}`} />
                          {isAnimating && active ? '…' : 'Do it'}
                        </button>
                      )}
                      {done && (
                        <span className="flex-shrink-0 text-xs text-emerald-400 font-medium">✓ Done</span>
                      )}
                      {locked && (
                        <span className="flex-shrink-0 text-xs text-slate-600">Locked</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Required chemicals & equipment info */}
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="rounded-xl p-4" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div className="text-xs text-emerald-400 font-medium mb-3 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5" /> CHEMICALS
                </div>
                <div className="space-y-1.5">
                  {exp.chemicals.map(chemId => {
                    const chem = CHEMICALS.find(c => c.id === chemId);
                    if (!chem) return null;
                    return (
                      <div key={chemId} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{chem.name}</span>
                        <span className="text-xs text-slate-500 font-mono ml-auto">({chem.formula})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl p-4" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div className="text-xs text-indigo-400 font-medium mb-3">EQUIPMENT</div>
                <div className="space-y-1.5">
                  {exp.equipment.map((eqId, i) => {
                    const eq = EQUIPMENT.find(e => e.id === eqId);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-base">{eq?.icon ?? '🔬'}</span>
                        <span className="text-sm text-slate-300">{eq?.name ?? eqId.replace(/_/g, ' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Next actions */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setActiveSection('ai')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
                <Brain className="w-4 h-4" /> Ask AI Tutor
              </button>
              <button onClick={() => setActiveSection('quiz')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white text-sm ml-auto"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                <HelpCircle className="w-4 h-4" /> Take Quiz <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══ AI TUTOR ════════════════════════════════════════ */}
        {activeSection === 'ai' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-5">
              <div className="text-xs text-purple-400 font-medium mb-1 flex items-center gap-2">
                <Brain className="w-3.5 h-3.5" /> AI TUTOR
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Ask ChemBot About {topic.name}</h1>
            </div>
            <AIAssistant
              context={{
                topic: topic.name,
                gradeLevel: grade?.name,
                currentExperiment: exp?.name,
                reactionResult: experimentResult,
              }}
              className="h-[480px]"
            />
            <div className="mt-5 flex justify-end">
              <button onClick={() => setActiveSection('quiz')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                Take Quiz <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══ QUIZ ════════════════════════════════════════════ */}
        {activeSection === 'quiz' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="text-xs text-amber-400 font-medium mb-1 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5" /> QUIZ
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">{topic.name} Quiz</h1>
              <p className="text-slate-400 text-sm mt-1">{topic.quiz.length} questions</p>
            </div>

            {quizSubmitted ? (
              <div className="text-center py-8">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5"
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
                <p className="text-slate-400 mb-6">
                  {topic.quiz.filter(q => quizAnswers[q.id] === q.answer).length} / {topic.quiz.length} correct
                </p>

                <div className="text-left space-y-3 mb-8">
                  {topic.quiz.map(q => {
                    const ok = quizAnswers[q.id] === q.answer;
                    return (
                      <div key={q.id} className="rounded-xl p-4"
                        style={{
                          background: ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                          border: ok ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.25)',
                        }}>
                        <div className="flex items-start gap-3">
                          {ok ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              : <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                          <div className="text-sm">
                            <p className="text-white font-medium mb-1">{q.question}</p>
                            {!ok && q.options && (
                              <p className="text-red-300 text-xs mb-1">Your answer: {q.options[quizAnswers[q.id] as number] ?? '—'}</p>
                            )}
                            {q.options && <p className="text-emerald-300 text-xs mb-1">Correct: {q.options[q.answer as number]}</p>}
                            <p className="text-slate-400 text-xs">{q.explanation}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center gap-3 flex-wrap">
                  <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(0); }}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(99,102,241,0.2)', color: '#94a3b8' }}>
                    Retry Quiz
                  </button>
                  <Link href={`/curriculum/${gradeId}`}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white text-sm"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <Trophy className="w-4 h-4" /> Back to Topics
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {topic.quiz.map((q, i) => (
                  <div key={q.id} className="rounded-xl p-4 sm:p-5"
                    style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <div className="flex items-start gap-3 mb-4">
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0"
                        style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
                        {i + 1}
                      </span>
                      <h3 className="text-sm font-medium text-white leading-relaxed">{q.question}</h3>
                    </div>
                    <div className="space-y-2 ml-10">
                      {(q.options || ['True', 'False']).map((opt, idx) => (
                        <button key={idx} onClick={() => handleQuizAnswer(q.id, idx)}
                          className="quiz-option w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all"
                          style={{
                            background: quizAnswers[q.id] === idx ? 'rgba(99,102,241,0.15)' : 'rgba(30,41,59,0.4)',
                            border:     quizAnswers[q.id] === idx ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(99,102,241,0.1)',
                            color:      quizAnswers[q.id] === idx ? '#a5b4fc' : '#94a3b8',
                          }}>
                          <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={submitQuiz}
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
  );
}
