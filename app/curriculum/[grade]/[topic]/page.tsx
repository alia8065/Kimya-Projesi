"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, FlaskConical, Brain, HelpCircle,
  CheckCircle, ChevronRight, Play, Check, X, Trophy, ArrowRight,
  Droplets, Wind, Thermometer, RotateCcw, Zap,
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

const LIQUID: Record<string, string> = {
  colorless:   'rgba(200,220,255,0.2)',
  blue:        'rgba(59,130,246,0.55)',
  'deep blue': 'rgba(29,78,216,0.65)',
  purple:      'rgba(147,51,234,0.55)',
  violet:      'rgba(139,92,246,0.55)',
  green:       'rgba(16,185,129,0.45)',
  yellow:      'rgba(234,179,8,0.45)',
  orange:      'rgba(249,115,22,0.45)',
  red:         'rgba(239,68,68,0.45)',
  brown:       'rgba(120,53,15,0.55)',
  pink:        'rgba(236,72,153,0.5)',
  white:       'rgba(240,240,255,0.3)',
  'pale blue': 'rgba(147,197,253,0.35)',
};

/* ── Animated Erlenmeyer Flask ─────────────────────────────────────── */
function SimFlask({
  id, color = 'rgba(200,220,255,0.15)', fillPct = 0,
  bubbles = false, precipitate = false, glow = false,
}: {
  id: string; color?: string; fillPct?: number;
  bubbles?: boolean; precipitate?: boolean; glow?: boolean;
}) {
  const safeId = id.replace(/[^a-zA-Z0-9]/g, '-');
  const fillY  = 112 - Math.min(fillPct, 100) * 0.72;
  return (
    <svg viewBox="0 0 90 130" width="90" height="130"
      style={{ filter: glow ? 'drop-shadow(0 0 14px rgba(99,102,241,0.7))' : 'drop-shadow(0 0 6px rgba(99,102,241,0.2))', transition: 'filter 0.5s' }}>
      <defs>
        <clipPath id={`f-${safeId}`}>
          <path d="M32 8 L32 46 L7 95 Q7 114 18 114 L72 114 Q83 114 83 95 L58 46 L58 8 Z" />
        </clipPath>
      </defs>
      {/* Neck */}
      <rect x="27" y="3" width="36" height="12" rx="4"
        fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
      {/* Body */}
      <path d="M32 8 L32 46 L7 95 Q7 114 18 114 L72 114 Q83 114 83 95 L58 46 L58 8 Z"
        fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
      {/* Liquid */}
      {fillPct > 0 && (
        <rect x="0" y={fillY} width="90" height="130"
          fill={color} clipPath={`url(#f-${safeId})`}
          style={{ transition: 'fill 1s ease, y 0.7s ease' }} />
      )}
      {/* Precipitate layer */}
      {precipitate && (
        <rect x="12" y="107" width="66" height="7" rx="3"
          fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"
          clipPath={`url(#f-${safeId})`} />
      )}
      {/* Bubbles */}
      {bubbles && [18, 32, 50, 66].map((cx, i) => (
        <circle key={i} cx={cx} cy={fillY + 8} r="3"
          fill="rgba(255,255,255,0.45)"
          className="bubble" style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
      {/* Glass shine */}
      <path d="M36 12 L36 44 L18 80" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Animated Beaker ──────────────────────────────────────────────── */
function SimBeaker({
  id, color = 'rgba(200,220,255,0.15)', fillPct = 0, glow = false,
}: {
  id: string; color?: string; fillPct?: number; glow?: boolean;
}) {
  const safeId = id.replace(/[^a-zA-Z0-9]/g, '-');
  const fillY  = 82 - Math.min(fillPct, 100) * 0.62;
  return (
    <svg viewBox="0 0 80 100" width="80" height="100"
      style={{ filter: glow ? 'drop-shadow(0 0 14px rgba(16,185,129,0.7))' : 'drop-shadow(0 0 6px rgba(16,185,129,0.2))', transition: 'filter 0.5s' }}>
      <defs>
        <clipPath id={`b-${safeId}`}>
          <path d="M8 6 L72 6 L72 85 Q72 93 64 93 L16 93 Q8 93 8 85 Z" />
        </clipPath>
      </defs>
      {/* Body */}
      <path d="M8 6 L72 6 L72 85 Q72 93 64 93 L16 93 Q8 93 8 85 Z"
        fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.45)" strokeWidth="2" />
      {/* Liquid */}
      {fillPct > 0 && (
        <rect x="0" y={fillY} width="80" height="100"
          fill={color} clipPath={`url(#b-${safeId})`}
          style={{ transition: 'fill 1s ease, y 0.7s ease' }} />
      )}
      {/* Graduation marks */}
      {[20, 35, 50, 65].map(y => (
        <g key={y}>
          <line x1="68" y1={y} x2="76" y2={y} stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
        </g>
      ))}
      {/* Spout */}
      <path d="M60 6 L72 6 L78 0" stroke="rgba(16,185,129,0.45)" strokeWidth="2" fill="none" />
      {/* Shine */}
      <path d="M14 10 L14 80" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Burette ──────────────────────────────────────────────────────── */
function SimBurette({ level = 100, dripping = false }: { level?: number; dripping?: boolean }) {
  const fillH = Math.min(level, 100) * 1.2;
  const fillY = 4 + (120 - fillH);
  return (
    <svg viewBox="0 0 44 200" width="44" height="200">
      <defs>
        <clipPath id="bur-main">
          <rect x="15" y="4" width="14" height="120" rx="3" />
        </clipPath>
      </defs>
      {/* Body */}
      <rect x="15" y="4" width="14" height="120" rx="3"
        fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.55)" strokeWidth="1.5" />
      {/* Liquid */}
      <rect x="15.5" y={fillY} width="13" height={fillH}
        fill="rgba(59,130,246,0.5)" clipPath="url(#bur-main)"
        style={{ transition: 'all 0.6s ease' }} />
      {/* Grad marks */}
      {[24, 48, 72, 96].map((y, i) => (
        <g key={y}>
          <line x1="22" y1={y} x2="29" y2={y} stroke="rgba(99,102,241,0.45)" strokeWidth="1" />
          <text x="31" y={y + 3} fontSize="6" fill="rgba(148,163,184,0.7)">{(i + 1) * 25}</text>
        </g>
      ))}
      {/* Stopcock */}
      <rect x="13" y="124" width="18" height="7" rx="3"
        fill="rgba(99,102,241,0.3)" stroke="rgba(99,102,241,0.6)" strokeWidth="1.2" />
      {/* Tip */}
      <path d="M18 131 L26 131 L22 160 Z"
        fill="rgba(99,102,241,0.25)" stroke="rgba(99,102,241,0.5)" strokeWidth="1" />
      {/* Drip */}
      {dripping && (
        <ellipse cx="22" cy="164" rx="3" ry="4.5"
          fill="rgba(59,130,246,0.75)"
          style={{ animation: 'bubble-rise 0.6s ease-in forwards' }} />
      )}
    </svg>
  );
}

/* ── Test Tube ────────────────────────────────────────────────────── */
function SimTestTube({ color = 'rgba(200,220,255,0.15)', fillPct = 0 }: { color?: string; fillPct?: number }) {
  const fillY = 100 - fillPct * 0.7;
  return (
    <svg viewBox="0 0 40 120" width="40" height="120">
      <defs>
        <clipPath id="tt-main">
          <path d="M12 4 L28 4 L28 88 Q28 104 20 104 Q12 104 12 88 Z" />
        </clipPath>
      </defs>
      <path d="M12 4 L28 4 L28 88 Q28 104 20 104 Q12 104 12 88 Z"
        fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />
      {fillPct > 0 && (
        <rect x="0" y={fillY} width="40" height="120"
          fill={color} clipPath="url(#tt-main)"
          style={{ transition: 'fill 1s, y 0.7s' }} />
      )}
      <rect x="8" y="0" width="24" height="6" rx="3"
        fill="rgba(245,158,11,0.3)" stroke="rgba(245,158,11,0.5)" strokeWidth="1" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════ */
export default function TopicPage({ params }: Props) {
  const { grade: gradeId, topic: topicId } = use(params);
  const topic = getTopic(gradeId, topicId);
  if (!topic) notFound();

  const [activeSection, setActiveSection]   = useState<Section>('theory');
  const [currentTheorySection, setCurrentTheorySection] = useState(0);

  /* Experiment state */
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep]       = useState(-1);
  const [experimentDone, setExperimentDone] = useState(false);
  const [experimentResult, setExperimentResult] = useState<ReturnType<typeof simulateReaction> | null>(null);
  const [isAnimating, setIsAnimating]       = useState(false);

  /* Visual simulation state */
  const [mainColor, setMainColor]     = useState('rgba(200,220,255,0.15)');
  const [mainFill, setMainFill]       = useState(0);
  const [tube1Color, setTube1Color]   = useState('rgba(200,220,255,0.15)');
  const [tube1Fill, setTube1Fill]     = useState(0);
  const [tube2Color, setTube2Color]   = useState('rgba(200,220,255,0.15)');
  const [tube2Fill, setTube2Fill]     = useState(0);
  const [buretteLevel, setBuretteLevel] = useState(100);
  const [dripping, setDripping]       = useState(false);
  const [hasBubbles, setHasBubbles]   = useState(false);
  const [hasPrecipitate, setHasPrecipitate] = useState(false);
  const [mainGlow, setMainGlow]       = useState(false);
  const [simLog, setSimLog]           = useState<string[]>([]);

  /* Quiz state */
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore]     = useState(0);

  const { addXP, completeTopicProgress, getTopicProgress } = useLabStore();
  const topicProgress  = getTopicProgress(gradeId, topicId);

  const grade = CURRICULUM[gradeId];
  const exp   = topic.experiments[0];
  const steps = exp?.steps ?? [];

  const SECTIONS = [
    { id: 'theory'     as Section, label: 'Théorie',     icon: <BookOpen className="w-4 h-4" />,    color: '#6366f1' },
    { id: 'experiment' as Section, label: 'Expérience', icon: <FlaskConical className="w-4 h-4" />, color: '#10b981' },
    { id: 'ai'         as Section, label: 'Tuteur IA',   icon: <Brain className="w-4 h-4" />,       color: '#8b5cf6' },
    { id: 'quiz'       as Section, label: 'Quiz',       icon: <HelpCircle className="w-4 h-4" />,  color: '#f59e0b' },
  ];

  /* Detect equipment type for this experiment */
  const expHasBurette  = exp?.equipment.some(e => e === 'burette')  ?? false;
  const expHasHeat     = exp?.equipment.some(e => ['hot_plate', 'bunsen_burner'].includes(e)) ?? false;
  const expHasPH       = exp?.equipment.some(e => e === 'ph_meter') ?? false;
  const expHasTherm    = exp?.equipment.some(e => e === 'thermometer') ?? false;

  /* Determine simulation vessel type */
  const useFlask = exp?.equipment.some(e => ['erlenmeyer', 'volumetric_flask'].includes(e)) ?? false;

  /* Log helper */
  const log = (msg: string) =>
    setSimLog(prev => [...prev.slice(-4), msg]);

  /* Perform a step */
  const doStep = useCallback(async (idx: number) => {
    if (isAnimating || completedSteps.has(idx)) return;
    setIsAnimating(true);
    setCurrentStep(idx);
    setMainGlow(true);

    const s   = steps[idx].toLowerCase();
    const tot = steps.length;
    const pct = ((idx + 1) / tot) * 100;

    /* Tube fills when reagents added */
    if (s.includes('fill') || s.includes('add') || s.includes('dissolve') || s.includes('pipette') || s.includes('measure')) {
      setTube1Fill(Math.min(70, pct * 0.7));
      setTube2Fill(Math.min(60, pct * 0.6));
      setMainFill(prev => Math.min(prev + 18, 72));
      log('Réactif ajouté au récipient…');
    }
    if (s.includes('water') || s.includes('h₂o') || s.includes('h2o')) {
      setTube1Color('rgba(180,220,255,0.4)');
      setMainFill(prev => Math.min(prev + 20, 72));
    }
    if (s.includes('heat') || s.includes('hot') || s.includes('boil')) {
      setMainColor('rgba(239,120,40,0.35)');
      log('La solution chauffe…');
    }
    if (s.includes('stir') || s.includes('mix') || s.includes('swirl') || s.includes('shake')) {
      log('Mélange de la solution…');
    }
    if (s.includes('indicator') || s.includes('phenolphthalein') || s.includes('litmus')) {
      setTube2Color('rgba(236,72,153,0.55)');
      log('Indicateur ajouté — observez le changement de couleur !');
    }
    if (s.includes('nacl') || s.includes('naoh') || s.includes('titrant') || s.includes('burette') || s.includes('drop')) {
      setBuretteLevel(prev => Math.max(0, prev - 30));
      setDripping(true);
      log('Ajout du titrant goutte à goutte…');
      await new Promise(r => setTimeout(r, 700));
      setDripping(false);
    }
    if (s.includes('endpoint') || s.includes('colour disappear') || s.includes('permanent') || s.includes('colorless') || s.includes('colourless')) {
      setMainColor('rgba(200,220,255,0.2)');
      log('Point de fin atteint — la couleur disparaît !');
    }
    if (s.includes('pink') || s.includes('magenta') || s.includes('fuchsia')) {
      setMainColor('rgba(236,72,153,0.5)');
      setMainGlow(true);
      log('La solution vire au ROSE — point de fin !');
    }
    if (s.includes('precipitate') || s.includes('cloudy') || s.includes('turbid')) {
      setHasPrecipitate(true);
      log('Formation d\'un précipité…');
    }
    if (s.includes('gas') || s.includes('bubble') || s.includes('fizz') || s.includes('co₂') || s.includes('h₂')) {
      setHasBubbles(true);
      log('Dégagement de bulles de gaz !');
    }
    if (s.includes('blue') || s.includes('copper')) {
      setMainColor('rgba(59,130,246,0.5)');
    }
    if (s.includes('yellow') || s.includes('iodine')) {
      setMainColor('rgba(234,179,8,0.5)');
    }
    if (s.includes('flame') || s.includes('burn') || s.includes('ignite')) {
      setMainColor('rgba(239,100,20,0.5)');
      log('Combustion — flamme jaune observée !');
    }
    if (s.includes('record') || s.includes('calculate') || s.includes('note') || s.includes('observe')) {
      log('Observation enregistrée ✓');
    }

    await new Promise(r => setTimeout(r, 800));
    setCompletedSteps(prev => new Set([...prev, idx]));
    setMainGlow(false);
    setIsAnimating(false);

    /* Last step — complete experiment */
    if (idx === tot - 1) {
      const result = simulateReaction(exp.chemicals);
      setExperimentResult(result);
      setExperimentDone(true);
      addXP(25);
      if (result.colorChange) setMainColor(LIQUID[result.colorChange.toLowerCase()] ?? 'rgba(200,220,255,0.2)');
      if (result.precipitate) setHasPrecipitate(true);
      if (result.gasProduced) setHasBubbles(true);
      log('Expérience terminée ! +25 XP');
      completeTopicProgress({ topicId, gradeId, quizScore: topicProgress?.quizScore ?? 0, experimentDone: true });
    }
  }, [isAnimating, completedSteps, steps, exp, addXP, completeTopicProgress, topicId, gradeId, topicProgress]);

  const resetExperiment = () => {
    setCompletedSteps(new Set()); setCurrentStep(-1);
    setExperimentDone(false); setExperimentResult(null);
    setMainColor('rgba(200,220,255,0.15)'); setMainFill(0);
    setTube1Color('rgba(200,220,255,0.15)'); setTube1Fill(0);
    setTube2Color('rgba(200,220,255,0.15)'); setTube2Fill(0);
    setBuretteLevel(100); setDripping(false);
    setHasBubbles(false); setHasPrecipitate(false);
    setMainGlow(false); setSimLog([]);
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
    setQuizScore(score); setQuizSubmitted(true);
    addXP(score >= 80 ? 50 : score >= 60 ? 30 : 15);
    completeTopicProgress({ topicId, gradeId, quizScore: score, experimentDone: experimentDone || !!topicProgress?.experimentDone });
  };

  /* ── Simulation panel (reused in both column and stacked layouts) ── */
  const SimPanel = (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(6,9,18,0.95)', border: '1px solid rgba(16,185,129,0.25)' }}>

      {/* Header */}
      <div className="px-4 py-2.5 border-b border-emerald-500/15 flex items-center justify-between"
        style={{ background: 'rgba(16,185,129,0.07)' }}>
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Simulation en direct</span>
        </div>
        <div className="flex items-center gap-2">
          {expHasPH && experimentDone && experimentResult?.pHChange !== null && (
            <span className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
              pH {experimentResult!.pHChange}
            </span>
          )}
          {expHasTherm && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Thermometer className="w-3 h-3 inline mr-1" />
              {experimentResult?.isExothermic ? '↑ Exothermique' : '25°C'}
            </span>
          )}
          {hasBubbles && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(59,130,246,0.1)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Wind className="w-3 h-3 inline mr-1" />Gaz
            </span>
          )}
          {hasPrecipitate && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(248,250,252,0.07)', color: '#e2e8f0', border: '1px solid rgba(248,250,252,0.15)' }}>
              <Droplets className="w-3 h-3 inline mr-1" />Préc.
            </span>
          )}
        </div>
      </div>

      {/* Vessel canvas */}
      <div className="relative px-6 py-8 flex items-end justify-center gap-4 sm:gap-8"
        style={{ minHeight: 220, background: 'radial-gradient(ellipse at 50% 80%, rgba(16,185,129,0.06) 0%, transparent 70%)' }}>

        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

        {/* Burette (only when experiment uses one) */}
        {expHasBurette && (
          <div className="flex flex-col items-center gap-1 relative z-10">
            <span className="text-xs text-slate-500 font-mono mb-1">{buretteLevel.toFixed(0)} mL</span>
            <SimBurette level={buretteLevel} dripping={dripping} />
          </div>
        )}

        {/* Reagent vessel 1 */}
        {exp && exp.chemicals.length > 0 && (
          <div className="flex flex-col items-center gap-2 relative z-10">
            {useFlask
              ? <SimFlask id={`r1-${topicId}`} color={tube1Color} fillPct={tube1Fill} />
              : <SimTestTube color={tube1Color} fillPct={tube1Fill} />
            }
            <span className="text-xs text-slate-500 text-center max-w-[60px] leading-tight">
              {CHEMICALS.find(c => c.id === exp.chemicals[0])?.formula ?? exp.chemicals[0]}
            </span>
          </div>
        )}

        {/* Main reaction vessel */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          {useFlask
            ? <SimFlask id={`main-${topicId}`} color={mainColor} fillPct={mainFill}
                bubbles={hasBubbles} precipitate={hasPrecipitate} glow={mainGlow} />
            : <SimBeaker id={`main-${topicId}`} color={mainColor} fillPct={mainFill} glow={mainGlow} />
          }
          {/* Flame under vessel when heating */}
          {expHasHeat && completedSteps.size > 0 && (
            <div className="flex gap-0.5 -mt-1">
              {['🔥','🔥','🔥'].map((f, i) => (
                <span key={i} className="text-lg animate-pulse" style={{ animationDuration: `${0.3 + i * 0.1}s` }}>{f}</span>
              ))}
            </div>
          )}
          <span className="text-xs text-slate-400 text-center">Récipient de réaction</span>
        </div>

        {/* Reagent vessel 2 */}
        {exp && exp.chemicals.length > 1 && (
          <div className="flex flex-col items-center gap-2 relative z-10">
            {useFlask
              ? <SimFlask id={`r2-${topicId}`} color={tube2Color} fillPct={tube2Fill} />
              : <SimTestTube color={tube2Color} fillPct={tube2Fill} />
            }
            <span className="text-xs text-slate-500 text-center max-w-[60px] leading-tight">
              {CHEMICALS.find(c => c.id === exp.chemicals[1])?.formula ?? exp.chemicals[1]}
            </span>
          </div>
        )}
      </div>

      {/* Lab bench surface */}
      <div className="h-2" style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.6), rgba(15,23,42,0.4))' }} />

      {/* Activity log */}
      <div className="px-4 py-3 min-h-[60px]"
        style={{ background: 'rgba(10,14,26,0.5)', borderTop: '1px solid rgba(16,185,129,0.1)' }}>
        {simLog.length === 0 ? (
          <p className="text-xs text-slate-600 italic">Cliquez sur le bouton <strong className="text-slate-500">Effectuer</strong> d&apos;une étape — la simulation se met à jour ici</p>
        ) : (
          <div className="space-y-1">
            {simLog.slice(-3).map((msg, i) => (
              <div key={i} className="flex items-center gap-2 text-xs"
                style={{ color: i === simLog.slice(-3).length - 1 ? '#6ee7b7' : '#475569' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: i === simLog.slice(-3).length - 1 ? '#10b981' : '#334155' }} />
                {msg}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experiment complete banner */}
      {experimentDone && experimentResult && (
        <div className="mx-4 mb-4 mt-2 rounded-xl p-4"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">Expérience terminée !</span>
            <span className="ml-auto text-xs font-bold text-emerald-400">+25 XP</span>
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
  );

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0e1a', color: '#e2e8f0' }}>
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-indigo-500/15 px-4 py-3"
        style={{ background: 'rgba(10,14,26,0.98)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link href={`/curriculum/${gradeId}`}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{grade?.shortName ?? 'Retour'}</span>
            </Link>
            <div className="w-px h-4 bg-slate-600 hidden sm:block" />
            <span className="text-base flex-shrink-0">{topic.icon}</span>
            <span className="font-semibold text-white text-sm truncate">{topic.name}</span>
            {(topicProgress?.experimentDone || experimentDone) && (
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
          </div>

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

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6">

        {/* ══ THÉORIE ══════════════════════════════════════════════ */}
        {activeSection === 'theory' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="text-xs text-indigo-400 font-medium mb-2 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" /> THÉORIE
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
                Aller à l&apos;expérience <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══ EXPÉRIENCE ══════════════════════════════════════════ */}
        {activeSection === 'experiment' && exp && (
          <div className="max-w-5xl mx-auto">

            {/* Title row */}
            <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs text-emerald-400 font-medium mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5" /> EXPÉRIENCE INTERACTIVE
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white">{exp.name}</h1>
                <p className="text-slate-400 text-sm mt-1">{exp.description}</p>
              </div>
              {(currentStep >= 0 || experimentDone) && (
                <button onClick={resetExperiment}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs flex-shrink-0 transition-colors"
                  style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(99,102,241,0.2)', color: '#94a3b8' }}>
                  <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
                </button>
              )}
            </div>

            {/* Two-column layout: steps LEFT, simulation RIGHT */}
            <div className="lg:grid lg:grid-cols-[1fr_360px] gap-6 items-start">

              {/* ── LEFT: steps + chemicals + equipment ── */}
              <div className="space-y-5">

                {/* Step-by-step procedure */}
                <div className="rounded-xl overflow-hidden"
                  style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div className="px-4 py-3 flex items-center justify-between border-b border-indigo-500/10"
                    style={{ background: 'rgba(15,23,42,0.5)' }}>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Procédure — {completedSteps.size}/{steps.length} effectuées
                    </span>
                    <div className="h-1.5 w-28 rounded-full bg-slate-700/50">
                      <div className="h-full rounded-full progress-bar"
                        style={{ width: `${steps.length > 0 ? (completedSteps.size / steps.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 space-y-2">
                    {steps.map((step, i) => {
                      const done   = completedSteps.has(i);
                      const active = currentStep === i && !done;
                      const locked = i > 0 && !completedSteps.has(i - 1) && !done;
                      return (
                        <div key={i} className="flex gap-3 items-start p-3 rounded-xl transition-all"
                          style={{
                            background: done   ? 'rgba(16,185,129,0.08)'
                                      : active ? 'rgba(99,102,241,0.12)'
                                      :          'rgba(30,41,59,0.35)',
                            border:    done   ? '1px solid rgba(16,185,129,0.3)'
                                      : active ? '1px solid rgba(99,102,241,0.4)'
                                      : locked ? '1px solid rgba(30,41,59,0.3)'
                                      :          '1px solid rgba(99,102,241,0.15)',
                          }}>
                          {/* Step number / check */}
                          <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                            done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-500 text-white' : 'text-slate-500'
                          }`}
                            style={!done && !active ? { background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(99,102,241,0.2)' } : {}}>
                            {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                          </div>
                          {/* Text */}
                          <p className={`flex-1 text-sm leading-relaxed ${done ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200'}`}>
                            {step}
                          </p>
                          {/* Action */}
                          {!done && !locked && (
                            <button onClick={() => doStep(i)} disabled={isAnimating}
                              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                              style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: '#fff' }}>
                              <Play className={`w-3 h-3 ${isAnimating && active ? 'animate-spin' : ''}`} />
                              {isAnimating && active ? '…' : 'Effectuer'}
                            </button>
                          )}
                          {done && <span className="flex-shrink-0 text-xs text-emerald-400 font-medium">✓</span>}
                          {locked && <span className="flex-shrink-0 text-xs text-slate-600">🔒</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chemicals & Equipment */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3"
                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div className="text-xs text-emerald-400 font-medium mb-2 flex items-center gap-1">
                      <FlaskConical className="w-3 h-3" /> Produits chimiques
                    </div>
                    <div className="space-y-1">
                      {exp.chemicals.map(id => {
                        const c = CHEMICALS.find(ch => ch.id === id);
                        return (
                          <div key={id} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                            <span className="text-xs text-slate-300 truncate">{c?.name ?? id}</span>
                            <span className="text-xs text-slate-500 font-mono ml-auto">({c?.formula ?? id})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="rounded-xl p-3"
                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div className="text-xs text-indigo-400 font-medium mb-2">Équipement</div>
                    <div className="space-y-1">
                      {exp.equipment.map(id => {
                        const e = EQUIPMENT.find(eq => eq.id === id);
                        return (
                          <div key={id} className="flex items-center gap-2">
                            <span className="text-sm">{e?.icon ?? '🔬'}</span>
                            <span className="text-xs text-slate-300 truncate">{e?.name ?? id}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT (desktop) / BELOW (mobile): simulation ── */}
              <div className="mt-6 lg:mt-0 lg:sticky lg:top-4">
                {SimPanel}
              </div>
            </div>

            {/* Nav buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => setActiveSection('ai')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
                <Brain className="w-4 h-4" /> Demander au tuteur IA
              </button>
              <button onClick={() => setActiveSection('quiz')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white text-sm ml-auto"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                <HelpCircle className="w-4 h-4" /> Passer le quiz <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══ TUTEUR IA ════════════════════════════════════════════ */}
        {activeSection === 'ai' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-5">
              <div className="text-xs text-purple-400 font-medium mb-1 flex items-center gap-2">
                <Brain className="w-3.5 h-3.5" /> TUTEUR IA
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Demandez à ChemBot à propos de {topic.name}</h1>
            </div>
            <AIAssistant
              context={{ topic: topic.name, gradeLevel: grade?.name, currentExperiment: exp?.name, reactionResult: experimentResult }}
              className="h-[480px]"
            />
            <div className="mt-5 flex justify-end">
              <button onClick={() => setActiveSection('quiz')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                Passer le quiz <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══ QUIZ ════════════════════════════════════════════════ */}
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
                  {quizScore >= 80 ? '🎉 Excellent !' : quizScore >= 60 ? '👍 Bon travail !' : '📚 Continuez à étudier !'}
                </h2>
                <p className="text-slate-400 mb-6">
                  {topic.quiz.filter(q => quizAnswers[q.id] === q.answer).length} / {topic.quiz.length} correctes
                </p>
                <div className="text-left space-y-3 mb-8">
                  {topic.quiz.map(q => {
                    const ok = quizAnswers[q.id] === q.answer;
                    return (
                      <div key={q.id} className="rounded-xl p-4"
                        style={{ background: ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: ok ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.25)' }}>
                        <div className="flex items-start gap-3">
                          {ok ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              : <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                          <div className="text-sm">
                            <p className="text-white font-medium mb-1">{q.question}</p>
                            {!ok && q.options && <p className="text-red-300 text-xs mb-1">Votre réponse : {q.options[quizAnswers[q.id] as number] ?? '—'}</p>}
                            {q.options && <p className="text-emerald-300 text-xs mb-1">Correct : {q.options[q.answer as number]}</p>}
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
                    Recommencer le quiz
                  </button>
                  <Link href={`/curriculum/${gradeId}`}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white text-sm"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <Trophy className="w-4 h-4" /> Retour aux sujets
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
                          <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length < topic.quiz.length}
                  className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                  Soumettre le quiz ({Object.keys(quizAnswers).length}/{topic.quiz.length} réponses)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
