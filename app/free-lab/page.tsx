"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, FlaskConical, Atom, Play, Trash2, Plus, X,
  ChevronDown, ChevronUp, Search, Bot, Beaker, Settings2, Droplets,
} from "lucide-react";
import { CHEMICALS, Chemical } from "@/lib/chemicals";
import { EQUIPMENT } from "@/lib/equipment";
import { simulateReaction } from "@/lib/reactions";
import { useLabStore } from "@/store/labStore";
import AIAssistant from "@/components/lab/AIAssistant";
import ReactionVessel from "@/components/lab/ReactionVessel";

const HAZARD_COLORS = {
  low:    { bg: 'rgba(16,185,129,0.15)',  text: '#6ee7b7', border: 'rgba(16,185,129,0.3)'  },
  medium: { bg: 'rgba(245,158,11,0.15)', text: '#fcd34d', border: 'rgba(245,158,11,0.3)' },
  high:   { bg: 'rgba(239,68,68,0.15)',  text: '#fca5a5', border: 'rgba(239,68,68,0.3)'  },
};
const CATEGORY_COLORS: Record<string, string> = {
  acid: '#ef4444', base: '#6366f1', salt: '#10b981', metal: '#f59e0b',
  organic: '#8b5cf6', indicator: '#06b6d4', oxidizer: '#f97316',
  solvent: '#64748b', other: '#94a3b8',
};

type MobileTab = 'chemicals' | 'lab' | 'ai';
type LabMode   = 'reaction' | 'titration';

/* ── Inline Erlenmeyer for titration ──────────────────────────────── */
function TitFlask({ color, glow }: { color: string; glow?: boolean }) {
  return (
    <svg viewBox="0 0 80 96" width="90" height="108"
      style={{ filter: glow ? 'drop-shadow(0 0 14px rgba(236,72,153,0.7))' : 'drop-shadow(0 0 8px rgba(99,102,241,0.3))', transition: 'filter 0.8s' }}>
      <defs>
        <clipPath id="tit-flask">
          <path d="M28 8 L28 40 L6 80 Q6 90 16 90 L64 90 Q74 90 74 80 L52 40 L52 8 Z" />
        </clipPath>
      </defs>
      <rect x="23" y="2" width="34" height="11" rx="3"
        fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
      <path d="M28 8 L28 40 L6 80 Q6 90 16 90 L64 90 Q74 90 74 80 L52 40 L52 8 Z"
        fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
      <rect x="0" y="44" width="80" height="60" fill={color}
        clipPath="url(#tit-flask)"
        style={{ transition: 'fill 1.5s ease' }} />
      <path d="M34 12 L34 38 L18 68" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Inline Burette for titration ─────────────────────────────────── */
function TitBurette({ level, dripping }: { level: number; dripping: boolean }) {
  const fillH = Math.max(0, Math.min(level, 100)) * 1.2;
  const fillY = 4 + (120 - fillH);
  return (
    <svg viewBox="0 0 44 190" width="44" height="190">
      <defs>
        <clipPath id="tit-burette"><rect x="15" y="4" width="14" height="120" rx="3" /></clipPath>
      </defs>
      <rect x="15" y="4" width="14" height="120" rx="3"
        fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.55)" strokeWidth="1.5" />
      <rect x="15.5" y={fillY} width="13" height={fillH}
        fill="rgba(99,102,241,0.45)" clipPath="url(#tit-burette)"
        style={{ transition: 'all 0.5s ease' }} />
      {[24, 48, 72, 96].map((y, i) => (
        <g key={y}>
          <line x1="22" y1={y} x2="29" y2={y} stroke="rgba(99,102,241,0.45)" strokeWidth="1" />
          <text x="31" y={y + 3} fontSize="6" fill="rgba(148,163,184,0.7)">{(i + 1) * 25}</text>
        </g>
      ))}
      <rect x="13" y="124" width="18" height="7" rx="3"
        fill="rgba(99,102,241,0.3)" stroke="rgba(99,102,241,0.6)" strokeWidth="1.2" />
      <path d="M18 131 L26 131 L22 162 Z"
        fill="rgba(99,102,241,0.25)" stroke="rgba(99,102,241,0.5)" strokeWidth="1" />
      {dripping && (
        <ellipse cx="22" cy="166" rx="3" ry="4"
          fill="rgba(99,102,241,0.8)"
          style={{ animation: 'bubble-rise 0.5s ease-in forwards' }} />
      )}
    </svg>
  );
}

export default function FreeLabPage() {
  const [searchQuery, setSearchQuery]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedChemical, setExpandedChemical] = useState<string | null>(null);
  const [isRunning, setIsRunning]               = useState(false);
  const [chemTab, setChemTab]                   = useState<'chemicals' | 'equipment'>('chemicals');
  const [mobileTab, setMobileTab]               = useState<MobileTab>('lab');
  const [leftOpen, setLeftOpen]                 = useState(true);
  const [rightOpen, setRightOpen]               = useState(true);

  /* ── Equipment interaction state ── */
  const [isHeating, setIsHeating]   = useState(false);
  const [isStirring, setIsStirring] = useState(false);
  const [buretteVol, setBuretteVol] = useState(50);
  const [isDripping, setIsDripping] = useState(false);

  /* ── Amount control (mmol per chemical, default 2.5) ── */
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const getAmt  = (id: string) => amounts[id] ?? 2.5;    // mmol
  const setAmt  = useCallback((id: string, val: number) => {
    const clamped = Math.max(0.1, Math.min(50, +val.toFixed(1)));
    setAmounts(p => ({ ...p, [id]: isNaN(clamped) ? 2.5 : clamped }));
  }, []);
  const changeAmt = useCallback((id: string, delta: number) => {
    setAmounts(p => {
      const cur = p[id] ?? 2.5;
      return { ...p, [id]: Math.max(0.1, Math.min(50, +(cur + delta).toFixed(1))) };
    });
  }, []);

  /* ── Titration state ── */
  const [labMode, setLabMode]           = useState<LabMode>('reaction');
  const [titrantVol, setTitrantVol]     = useState(0);
  const [indicatorAdded, setIndicatorAdded] = useState(false);
  const [titrationDone, setTitrationDone]   = useState(false);

  const {
    selectedChemicals, selectedEquipment, currentReaction,
    addChemical, removeChemical, addEquipment, removeEquipment,
    setCurrentReaction, addMessage, incrementExperiments, addDiscoveredReaction, addXP,
  } = useLabStore();

  /* Reset equipment state when deselected */
  useEffect(() => {
    if (!selectedEquipment.some(id => ['bunsen_burner', 'hot_plate'].includes(id))) setIsHeating(false);
    if (!selectedEquipment.includes('magnetic_stirrer')) setIsStirring(false);
    if (!selectedEquipment.includes('burette')) { setBuretteVol(50); setIsDripping(false); }
  }, [selectedEquipment]);

  /* Reset titration when switching to reaction mode */
  useEffect(() => {
    if (labMode === 'reaction') {
      setTitrantVol(0); setTitrationDone(false); setIndicatorAdded(false);
    }
  }, [labMode]);

  /* Equipment flags */
  const hasHeat        = selectedEquipment.some(id => ['bunsen_burner', 'hot_plate'].includes(id));
  const hasBurette     = selectedEquipment.includes('burette');
  const hasStirrer     = selectedEquipment.includes('magnetic_stirrer');
  const hasPH          = selectedEquipment.includes('ph_meter');
  const hasThermo      = selectedEquipment.includes('thermometer');
  const hasConductivity = selectedEquipment.includes('conductivity_meter');
  const hasBalance     = selectedEquipment.includes('balance');
  const showInstruments = hasPH || hasThermo || hasConductivity || hasBalance;

  /* Live instrument readings */
  function calcPH() {
    if (selectedChemicals.length === 0) return 7.0;
    if (labMode === 'titration') return titrationPH(titrantVol);
    if (currentReaction?.pHChange !== null && currentReaction?.pHChange !== undefined) return currentReaction.pHChange as number;
    const vals = selectedChemicals.map(id => CHEMICALS.find(c => c.id === id)?.properties.pH).filter((v): v is number => v !== undefined);
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 7.0;
  }
  function calcTemp() {
    let t = 25;
    if (currentReaction?.isExothermic) t += 35;
    else if (currentReaction) t -= 5;
    if (isHeating) t += 25;
    return Math.min(500, Math.max(0, Math.round(t)));
  }
  function calcCond() {
    return selectedChemicals.filter(id => {
      const c = CHEMICALS.find(ch => ch.id === id);
      return c && ['acid', 'base', 'salt'].includes(c.category);
    }).length * 280;
  }
  function calcMass() {
    return selectedChemicals.map(id => CHEMICALS.find(c => c.id === id)?.molecularWeight ?? 0).reduce((a, b) => a + b, 0);
  }

  /* Titration pH calculation — amounts now in mmol, titrantVol in mL at 0.1 M */
  function titrationPH(volAdded: number): number {
    const analyteId = selectedChemicals[0];
    if (!analyteId) return 7;
    const mmol       = getAmt(analyteId);         // mmol of analyte
    const molAnalyte = mmol / 1000;               // mol
    const analyteVolMl = mmol / 0.1;              // mL of analyte at 0.1 M (= mmol×10)
    const analytePH  = CHEMICALS.find(c => c.id === analyteId)?.properties.pH ?? 7;
    const isAcid     = analytePH < 7;
    const molTitrant = volAdded * 0.1 / 1000;     // mL titrant × 0.1 M = mol
    const totalVol   = (analyteVolMl + volAdded) / 1000;  // L
    if (isAcid) {
      if (molTitrant < molAnalyte - 1e-5)
        return Math.min(6.9, -Math.log10(Math.max(1e-14, (molAnalyte - molTitrant) / totalVol)));
      if (molTitrant <= molAnalyte + 1e-5) return 7.0;
      return Math.min(14, 14 + Math.log10(Math.max(1e-14, (molTitrant - molAnalyte) / totalVol)));
    } else {
      if (molTitrant < molAnalyte - 1e-5)
        return Math.max(7.1, 14 + Math.log10(Math.max(1e-14, (molAnalyte - molTitrant) / totalVol)));
      if (molTitrant <= molAnalyte + 1e-5) return 7.0;
      return Math.max(0, -Math.log10(Math.max(1e-14, (molTitrant - molAnalyte) / totalVol)));
    }
  }

  const curPH   = calcPH();
  const curTemp = calcTemp();
  const curCond = calcCond();
  const curMass = calcMass();

  const titPH    = titrationPH(titrantVol);
  // Equivalence vol (mL titrant at 0.1 M) = mmol_analyte × 10
  const eqVol    = selectedChemicals.length > 0 ? getAmt(selectedChemicals[0]) * 10 : 25;
  const nearEq   = titrantVol > 0 && Math.abs(titrantVol - eqVol) < 0.6;
  const totalMmol = selectedChemicals.reduce((s, id) => s + getAmt(id), 0);
  const indColor = !indicatorAdded
    ? 'rgba(200,220,255,0.18)'
    : titPH < 8.2 ? 'rgba(200,220,255,0.18)' : 'rgba(236,72,153,0.55)';
  const indGlow  = indicatorAdded && titPH >= 8.2;

  /* Handlers */
  const handleRunReaction = useCallback(async () => {
    if (selectedChemicals.length < 2) return;
    setIsRunning(true);
    await new Promise(r => setTimeout(r, 800));
    const result = simulateReaction(selectedChemicals);
    setCurrentReaction(result);
    incrementExperiments();
    addXP(10);
    addDiscoveredReaction([...selectedChemicals].sort().join('+'));
    addMessage({ role: 'assistant', content: `Reaction: ${result.equation}\n\n${result.description}\n\nObservations: ${result.observations.join(', ')}` });
    setIsRunning(false);
    setMobileTab('lab');
  }, [selectedChemicals, setCurrentReaction, incrementExperiments, addXP, addDiscoveredReaction, addMessage]);

  const addTitrant = useCallback((vol: number) => {
    if (!indicatorAdded || buretteVol <= 0) return;
    setIsDripping(true);
    const nextVol = Math.min(titrantVol + vol, 100);
    setTitrantVol(nextVol);
    setBuretteVol(prev => Math.max(0, prev - vol));
    const newPH = titrationPH(nextVol);
    if (!titrationDone && Math.abs(newPH - 7) < 0.5) {
      setTitrationDone(true);
      addXP(20);
      addMessage({ role: 'assistant', content: `Equivalence point reached! ${nextVol.toFixed(1)} mL of titrant added. pH = ${newPH.toFixed(2)}. The neutralisation reaction is complete! 🎉` });
    }
    setTimeout(() => setIsDripping(false), 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicatorAdded, buretteVol, titrantVol, titrationDone, addXP, addMessage]);

  const handleFreeDrip = useCallback(() => {
    if (buretteVol <= 0 || isDripping) return;
    setIsDripping(true);
    const newVol = Math.max(0, buretteVol - 1);
    setBuretteVol(newVol);
    const added = 50 - newVol;
    if (added % 5 === 0 || newVol === 0) {
      addMessage({ role: 'assistant', content: newVol === 0 ? 'Burette empty — refill to continue.' : `${added} mL of titrant added. ${newVol} mL remaining.` });
    }
    setTimeout(() => setIsDripping(false), 500);
  }, [buretteVol, isDripping, addMessage]);

  const selectedChemicalObjects = selectedChemicals.map(id => CHEMICALS.find(c => c.id === id)).filter(Boolean) as Chemical[];
  const filteredChemicals = CHEMICALS.filter(c => {
    const q = searchQuery.toLowerCase();
    return (c.name.toLowerCase().includes(q) || c.formula.toLowerCase().includes(q))
      && (selectedCategory === 'all' || c.category === selectedCategory);
  });
  const categories = ['all', ...Array.from(new Set(CHEMICALS.map(c => c.category)))];

  /* ══════════════════════════════════════════════════════════════════
     CHEMICAL PANEL (left sidebar)
  ══════════════════════════════════════════════════════════════════ */
  const ChemicalPanel = (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-indigo-500/15 flex-shrink-0">
        {(['chemicals', 'equipment'] as const).map(t => (
          <button key={t} onClick={() => setChemTab(t)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${chemTab === t ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}>
            {t === 'chemicals' ? '🧪 Chemicals' : '🔬 Equipment'}
          </button>
        ))}
      </div>

      {chemTab === 'chemicals' && (
        <>
          <div className="p-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input type="text" placeholder="Search chemicals…" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg text-white placeholder-slate-500 outline-none"
                style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.2)' }} />
            </div>
          </div>
          <div className="px-3 pb-2 flex gap-1.5 flex-wrap flex-shrink-0">
            {categories.slice(0, 7).map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className="px-2 py-0.5 rounded-md text-xs font-medium capitalize transition-all"
                style={{
                  background: selectedCategory === cat ? 'rgba(99,102,241,0.3)' : 'rgba(30,41,59,0.6)',
                  border: `1px solid ${selectedCategory === cat ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.1)'}`,
                  color: selectedCategory === cat ? '#a5b4fc' : '#94a3b8',
                }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
            {filteredChemicals.map(chem => {
              const isSel = selectedChemicals.includes(chem.id);
              const isExp = expandedChemical === chem.id;
              const hc    = HAZARD_COLORS[chem.hazardLevel];
              return (
                <div key={chem.id} className="rounded-lg overflow-hidden transition-all"
                  style={{
                    background: isSel ? 'rgba(99,102,241,0.12)' : 'rgba(30,41,59,0.4)',
                    border: isSel ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(99,102,241,0.1)',
                  }}>
                  <div className="flex items-center justify-between p-2.5 cursor-pointer"
                    onClick={() => setExpandedChemical(isExp ? null : chem.id)}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: `${CATEGORY_COLORS[chem.category]}20`, color: CATEGORY_COLORS[chem.category], border: `1px solid ${CATEGORY_COLORS[chem.category]}40` }}>
                        {chem.formula.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{chem.name}</div>
                        <div className="text-xs text-slate-400">{chem.formula}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                      <span className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: hc.bg, color: hc.text, border: `1px solid ${hc.border}` }}>
                        {chem.hazardLevel}
                      </span>
                      {isExp ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
                    </div>
                  </div>
                  {isExp && (
                    <div className="px-2.5 pb-2 border-t border-indigo-500/10">
                      <p className="text-xs text-slate-400 mt-2 mb-2 leading-relaxed">{chem.description}</p>
                      {chem.properties.pH !== undefined && (
                        <div className="text-xs text-slate-400 mb-1">pH: <span className="text-white">{chem.properties.pH}</span></div>
                      )}
                      <div className="text-xs text-slate-400">MW: <span className="text-white">{chem.molecularWeight} g/mol</span></div>
                    </div>
                  )}
                  <div className="px-2.5 pb-2.5">
                    <button onClick={e => { e.stopPropagation(); isSel ? removeChemical(chem.id) : addChemical(chem.id); }}
                      className="w-full py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-all"
                      style={{
                        background: isSel ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.2)',
                        border:     isSel ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(99,102,241,0.3)',
                        color:      isSel ? '#fca5a5' : '#a5b4fc',
                      }}>
                      {isSel ? <><X className="w-3 h-3" />Remove</> : <><Plus className="w-3 h-3" />Add to Lab</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {chemTab === 'equipment' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <p className="text-xs text-slate-500 pb-1 leading-relaxed">
            Select equipment below, then switch to <strong className="text-slate-400">Lab</strong> view to use it.
          </p>
          {EQUIPMENT.map(eq => {
            const isSel = selectedEquipment.includes(eq.id);
            const isOn  = (eq.id === 'bunsen_burner' || eq.id === 'hot_plate') ? isHeating
                        : eq.id === 'magnetic_stirrer' ? isStirring
                        : isSel;
            return (
              <div key={eq.id} className="rounded-lg p-2.5 cursor-pointer transition-all"
                style={{
                  background: isSel ? 'rgba(16,185,129,0.1)' : 'rgba(30,41,59,0.4)',
                  border:     isSel ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(99,102,241,0.1)',
                }}
                onClick={() => isSel ? removeEquipment(eq.id) : addEquipment(eq.id)}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{eq.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white">{eq.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{eq.category}</div>
                  </div>
                  {isSel && (
                    <span className={`text-xs font-bold ${isOn ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      {isOn ? '● ON' : '● ADDED'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════
     LAB BENCH (centre)
  ══════════════════════════════════════════════════════════════════ */
  const LabBench = (
    <div className="flex flex-col h-full">

      {/* Selected chemicals row with amount controls */}
      {selectedChemicalObjects.length > 0 && (
        <div className="px-4 pt-3 pb-2 flex-shrink-0 border-b border-indigo-500/10"
          style={{ background: 'rgba(10,14,26,0.7)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">Miktar (mmol)</span>
            <span className="text-xs text-slate-600">— her madde için mol sayısını ayarla</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedChemicalObjects.map(chem => {
              const mmol = getAmt(chem.id);
              const mol  = (mmol / 1000).toFixed(4);
              return (
                <div key={chem.id} className="flex flex-col gap-1.5 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.35)', minWidth: 160 }}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-indigo-300">{chem.formula}</span>
                    <button onClick={() => removeChemical(chem.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors p-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* mmol input */}
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => changeAmt(chem.id, -0.5)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-all active:scale-95"
                      style={{ background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
                      −
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="number" min={0.1} max={50} step={0.5}
                        value={mmol}
                        onChange={e => setAmt(chem.id, Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg text-center text-base font-mono font-bold text-white outline-none"
                        style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.5)' }}
                      />
                    </div>
                    <button onClick={() => changeAmt(chem.id, +0.5)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-all active:scale-95"
                      style={{ background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
                      +
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-xs px-0.5">
                    <span className="text-emerald-400 font-semibold">{mmol} mmol</span>
                    <span className="text-slate-500">{mol} mol</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instrument readings bar */}
      {showInstruments && (
        <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-indigo-500/10 flex-shrink-0"
          style={{ background: 'rgba(10,14,26,0.6)' }}>
          {hasPH && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <span>📊</span>
              <span className="text-xs text-slate-400">pH</span>
              <span className="text-sm font-mono font-bold text-white">{curPH.toFixed(2)}</span>
              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.8)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(curPH / 14) * 100}%`, background: curPH < 3 ? '#ef4444' : curPH < 6 ? '#f97316' : curPH < 8 ? '#10b981' : curPH < 11 ? '#6366f1' : '#8b5cf6' }} />
              </div>
            </div>
          )}
          {hasThermo && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <span>🌡️</span>
              <span className="text-xs text-slate-400">Temp</span>
              <span className="text-sm font-mono font-bold" style={{ color: curTemp > 60 ? '#f87171' : curTemp < 20 ? '#93c5fd' : '#fcd34d' }}>
                {curTemp}°C
              </span>
            </div>
          )}
          {hasConductivity && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <span>⚡</span>
              <span className="text-xs text-slate-400">Cond.</span>
              <span className="text-sm font-mono font-bold text-amber-300">{curCond} mS/cm</span>
            </div>
          )}
          {hasBalance && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span>⚖️</span>
              <span className="text-xs text-slate-400">Avg MW</span>
              <span className="text-sm font-mono font-bold text-emerald-300">
                {curMass > 0 ? `${curMass.toFixed(1)} g/mol` : '— g/mol'}
              </span>
            </div>
          )}
          {selectedChemicals.length === 0 && (
            <span className="text-xs text-slate-600 self-center">Add chemicals to see live readings</span>
          )}
        </div>
      )}

      {/* Mode toggle — only shown when burette is in equipment */}
      {hasBurette && selectedChemicals.length >= 1 && (
        <div className="px-4 py-2 flex items-center gap-2 border-b border-indigo-500/10 flex-shrink-0"
          style={{ background: 'rgba(10,14,26,0.5)' }}>
          <span className="text-xs text-slate-500 mr-1">Lab mode:</span>
          {(['reaction', 'titration'] as LabMode[]).map(m => (
            <button key={m} onClick={() => setLabMode(m)}
              className="px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background: labMode === m ? (m === 'titration' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)') : 'rgba(30,41,59,0.4)',
                border: labMode === m ? `1px solid ${m === 'titration' ? 'rgba(16,185,129,0.5)' : 'rgba(99,102,241,0.5)'}` : '1px solid rgba(99,102,241,0.1)',
                color: labMode === m ? (m === 'titration' ? '#6ee7b7' : '#a5b4fc') : '#64748b',
              }}>
              {m === 'titration' ? '📏 Titration' : '⚗️ Reaction'}
            </button>
          ))}
        </div>
      )}

      {/* ══ TITRATION MODE ══ */}
      {labMode === 'titration' && hasBurette ? (
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-start p-4 gap-4"
            style={{ background: 'linear-gradient(135deg, rgba(10,14,26,0.95), rgba(15,23,42,0.9))' }}>
            <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

            {/* Titration setup visual */}
            <div className="relative z-10 flex items-end justify-center gap-6 sm:gap-10 mt-2">
              {/* Burette */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-mono text-slate-400 mb-1">{buretteVol.toFixed(1)} mL left</span>
                <TitBurette level={buretteVol * 2} dripping={isDripping} />
                <span className="text-xs text-slate-500">Burette</span>
                <span className="text-xs text-indigo-400 font-mono">
                  {selectedChemicals[1] ? CHEMICALS.find(c => c.id === selectedChemicals[1])?.formula ?? 'Titrant' : 'Titrant'}
                </span>
              </div>

              {/* Flask */}
              <div className="flex flex-col items-center gap-1">
                <TitFlask color={indColor} glow={indGlow} />
                <span className="text-xs text-slate-500">Erlenmeyer</span>
                <span className="text-xs text-indigo-400 font-mono">
                  {selectedChemicals[0] ? CHEMICALS.find(c => c.id === selectedChemicals[0])?.formula ?? 'Analyte' : 'Analyte'} ({getAmt(selectedChemicals[0] ?? '')} mmol)
                </span>
              </div>

              {/* pH meter display */}
              <div className="flex flex-col items-center gap-2">
                <div className="text-xs text-slate-400 mb-1">pH Meter</div>
                <div className="rounded-xl px-4 py-3 text-center"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', minWidth: 80 }}>
                  <div className="text-3xl font-black font-mono transition-all duration-500"
                    style={{ color: titPH < 4 ? '#f87171' : titPH < 6.5 ? '#fb923c' : titPH < 7.5 ? '#4ade80' : titPH < 10 ? '#6366f1' : '#8b5cf6' }}>
                    {titPH.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">pH</div>
                </div>
                <div className="text-xs text-slate-400 tabular-nums">{titrantVol.toFixed(1)} mL added</div>
                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.8)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(titPH / 14) * 100}%`, background: titPH < 7 ? '#ef4444' : '#10b981' }} />
                </div>
              </div>
            </div>

            {/* Step indicator */}
            {!indicatorAdded && (
              <div className="relative z-10 text-center text-xs text-amber-400 px-4 py-2 rounded-lg"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                Step 1: Add an indicator to the flask first
              </div>
            )}

            {/* Equivalence point */}
            {titrationDone && (
              <div className="relative z-10 w-full max-w-sm mx-auto px-4 py-3 rounded-xl text-center"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.4)' }}>
                <div className="text-emerald-400 font-bold text-sm mb-1">🎉 Equivalence Point Reached!</div>
                <div className="text-xs text-slate-300">
                  Volume used: <span className="font-mono font-bold text-white">{titrantVol.toFixed(1)} mL</span>
                  {' · '}pH = <span className="font-mono font-bold text-white">{titPH.toFixed(2)}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Analyte: {getAmt(selectedChemicals[0] ?? '').toFixed(1)} mmol · Titrant used: {titrantVol.toFixed(1)} mL
                </div>
              </div>
            )}

            {nearEq && !titrationDone && (
              <div className="relative z-10 text-xs text-amber-300 animate-pulse">
                ⚠️ Near equivalence point — add drops carefully!
              </div>
            )}

            {/* Titration controls */}
            <div className="relative z-10 flex flex-wrap gap-2 justify-center">
              {!indicatorAdded ? (
                <button onClick={() => setIndicatorAdded(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                  <Droplets className="w-4 h-4" /> Add Indicator (Phenolphthalein)
                </button>
              ) : (
                <>
                  <button onClick={() => addTitrant(0.5)} disabled={buretteVol <= 0 || titrantVol >= 100}
                    className="px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-40"
                    style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
                    Drop (0.5 mL)
                  </button>
                  <button onClick={() => addTitrant(1)} disabled={buretteVol <= 0 || titrantVol >= 100}
                    className="px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-40"
                    style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
                    + 1 mL
                  </button>
                  <button onClick={() => addTitrant(5)} disabled={buretteVol <= 0 || titrantVol >= 100}
                    className="px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-40"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
                    + 5 mL
                  </button>
                  <button onClick={() => addTitrant(10)} disabled={buretteVol <= 0 || titrantVol >= 100}
                    className="px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-40"
                    style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(99,102,241,0.2)', color: '#64748b' }}>
                    + 10 mL
                  </button>
                </>
              )}
              <button
                onClick={() => { setTitrantVol(0); setBuretteVol(50); setTitrationDone(false); setIndicatorAdded(false); setIsDripping(false); }}
                className="px-3 py-2 rounded-lg text-xs transition-all"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                Reset
              </button>
            </div>

            {/* Titration info panel */}
            <div className="relative z-10 w-full max-w-sm grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Analyte', value: `${getAmt(selectedChemicals[0] ?? '').toFixed(1)} mmol` },
                { label: 'Titrant', value: `${titrantVol.toFixed(1)} mL` },
                { label: 'Eq. vol.', value: `~${eqVol.toFixed(0)} mL` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg p-2"
                  style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="text-sm font-mono font-bold text-white mt-0.5">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      ) : (
        /* ══ REACTION MODE ══ */
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(10,14,26,0.95), rgba(15,23,42,0.9))' }}>
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          <div className="relative z-10 flex items-end justify-center gap-8">
            {/* Burette (reaction mode) */}
            {hasBurette && (
              <div className="flex flex-col items-center gap-1 pb-2">
                <span className="text-xs font-mono text-slate-400">{buretteVol.toFixed(0)} mL</span>
                <TitBurette level={buretteVol * 2} dripping={isDripping} />
                <button onClick={handleFreeDrip} disabled={buretteVol <= 0}
                  className="text-xs px-3 py-1 rounded-lg mt-1 transition-all disabled:opacity-40"
                  style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
                  Drip
                </button>
                {buretteVol <= 0 && (
                  <button onClick={() => setBuretteVol(50)} className="text-xs px-2 py-0.5 rounded mt-1 transition-all"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}>
                    Refill
                  </button>
                )}
              </div>
            )}

            {/* Flask */}
            <div className="relative">
              {isHeating && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-0.5 z-0">
                  {['🔥', '🔥', '🔥'].map((f, i) => (
                    <span key={i} className="text-xl animate-pulse" style={{ animationDuration: `${0.3 + i * 0.1}s` }}>{f}</span>
                  ))}
                </div>
              )}
              <div className="relative z-10">
                <ReactionVessel reaction={currentReaction} chemicals={selectedChemicals} isRunning={isRunning} totalMmol={totalMmol} />
              </div>
              {isStirring && (
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-14 h-2 rounded-full animate-spin"
                    style={{ background: 'rgba(6,182,212,0.6)', animationDuration: '0.4s' }} />
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mt-5">
            {hasHeat && (
              <button onClick={() => setIsHeating(v => !v)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isHeating ? 'rgba(239,68,68,0.2)' : 'rgba(30,41,59,0.6)',
                  border: isHeating ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(99,102,241,0.2)',
                  color: isHeating ? '#fca5a5' : '#94a3b8',
                }}>
                🔥 {isHeating ? 'Stop Heat' : 'Start Heat'}
              </button>
            )}
            {hasStirrer && (
              <button onClick={() => setIsStirring(v => !v)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isStirring ? 'rgba(6,182,212,0.2)' : 'rgba(30,41,59,0.6)',
                  border: isStirring ? '1px solid rgba(6,182,212,0.5)' : '1px solid rgba(99,102,241,0.2)',
                  color: isStirring ? '#67e8f9' : '#94a3b8',
                }}>
                🌀 {isStirring ? 'Stop Stirring' : 'Start Stirring'}
              </button>
            )}
            <button onClick={handleRunReaction}
              disabled={selectedChemicals.length < 2 || isRunning}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: selectedChemicals.length >= 2 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(30,41,59,0.6)',
                boxShadow:  selectedChemicals.length >= 2 ? '0 0 30px rgba(99,102,241,0.3)' : 'none',
              }}>
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Simulating…' : 'Run Reaction'}
            </button>
          </div>
          {selectedChemicals.length < 2 && !hasBurette && (
            <p className="relative z-10 mt-3 text-slate-500 text-sm text-center">
              Add at least 2 chemicals to run a reaction
            </p>
          )}
        </div>
      )}

      {/* Reaction result (reaction mode) */}
      {labMode === 'reaction' && currentReaction && (
        <div className="mx-4 mb-3 rounded-xl p-4 flex-shrink-0"
          style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="flex items-start gap-3">
            <Atom className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-mono text-indigo-300 text-sm font-bold mb-1 break-all">{currentReaction.equation}</div>
              <div className="text-slate-300 text-xs leading-relaxed mb-2">{currentReaction.description}</div>
              <div className="flex flex-wrap gap-1.5">
                {currentReaction.observations.map((obs, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-xs"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}>
                    {obs}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equipment strip */}
      {selectedEquipment.length > 0 && (
        <div className="px-4 py-2 border-t border-indigo-500/15 flex gap-2 overflow-x-auto flex-shrink-0"
          style={{ background: 'rgba(15,23,42,0.8)' }}>
          {selectedEquipment.map(id => {
            const eq = EQUIPMENT.find(e => e.id === id);
            if (!eq) return null;
            const isOn = (id === 'bunsen_burner' || id === 'hot_plate') ? isHeating
                       : id === 'magnetic_stirrer' ? isStirring : false;
            return (
              <div key={id} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                style={{ background: isOn ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)', border: isOn ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(16,185,129,0.2)' }}
                onClick={() => {
                  if (id === 'bunsen_burner' || id === 'hot_plate') setIsHeating(v => !v);
                  else if (id === 'magnetic_stirrer') setIsStirring(v => !v);
                }}>
                <span>{eq.icon}</span>
                <span className="text-xs text-slate-300 whitespace-nowrap">{eq.name}</span>
                {isOn && <span className="text-xs text-emerald-400 font-bold">ON</span>}
                <button onClick={e => { e.stopPropagation(); removeEquipment(id); }} className="text-slate-600 hover:text-red-400 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════
     MOBILE TAB BAR
  ══════════════════════════════════════════════════════════════════ */
  const MobileTabBar = (
    <nav className="lg:hidden flex-shrink-0 border-t border-indigo-500/15"
      style={{ background: 'rgba(10,14,26,0.98)' }}>
      <div className="flex">
        {([
          { id: 'chemicals' as MobileTab, label: 'Chemicals', icon: <Beaker className="w-5 h-5" />, badge: undefined as number | undefined },
          { id: 'lab'       as MobileTab, label: 'Lab',       icon: <FlaskConical className="w-5 h-5" />, badge: selectedChemicals.length > 0 ? selectedChemicals.length : undefined },
          { id: 'ai'        as MobileTab, label: 'AI Tutor',  icon: <Bot className="w-5 h-5" />, badge: undefined as number | undefined },
        ]).map(tab => (
          <button key={tab.id} onClick={() => setMobileTab(tab.id)}
            className="relative flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors"
            style={{ color: mobileTab === tab.id ? '#a5b4fc' : '#64748b' }}>
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="absolute top-2 right-1/4 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: '#6366f1' }}>
                {tab.badge}
              </span>
            )}
            {mobileTab === tab.id && <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-indigo-500" />}
          </button>
        ))}
      </div>
    </nav>
  );

  /* ══════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════ */
  return (
    <div className="h-screen flex flex-col" style={{ background: '#0a0e1a', color: '#e2e8f0' }}>

      <header className="flex-shrink-0 border-b border-indigo-500/15 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm flex-shrink-0">
            <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Home</span>
          </Link>
          <div className="w-px h-4 bg-slate-600 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white text-sm">Free Laboratory</span>
            {labMode === 'titration' && (
              <span className="px-2 py-0.5 rounded-full text-xs text-emerald-300 font-bold"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                TITRATION
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setLeftOpen(v => !v)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
            style={{ background: leftOpen ? 'rgba(99,102,241,0.2)' : 'rgba(30,41,59,0.4)', color: leftOpen ? '#a5b4fc' : '#64748b', border: '1px solid rgba(99,102,241,0.15)' }}>
            <Settings2 className="w-3.5 h-3.5" /> Chemicals
          </button>
          <button onClick={() => setRightOpen(v => !v)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
            style={{ background: rightOpen ? 'rgba(99,102,241,0.2)' : 'rgba(30,41,59,0.4)', color: rightOpen ? '#a5b4fc' : '#64748b', border: '1px solid rgba(99,102,241,0.15)' }}>
            <Bot className="w-3.5 h-3.5" /> AI
          </button>
          <span className="text-xs text-slate-500 hidden sm:inline">{selectedChemicals.length} chem.</span>
          <button
            onClick={() => { selectedChemicals.forEach(id => removeChemical(id)); setCurrentReaction(null); setTitrantVol(0); setTitrationDone(false); setIndicatorAdded(false); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 transition-colors"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Trash2 className="w-3.5 h-3.5" /><span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT panel */}
        <div className={`hidden lg:flex flex-col flex-shrink-0 border-r border-indigo-500/15 overflow-hidden transition-all duration-300 ${leftOpen ? 'w-72' : 'w-0 border-0'}`}
          style={{ background: 'rgba(10,14,26,0.9)' }}>
          {leftOpen && ChemicalPanel}
        </div>

        {/* CENTER */}
        <div className="flex-1 overflow-hidden min-w-0">
          <div className="lg:hidden h-full flex flex-col overflow-hidden" style={{ background: 'rgba(10,14,26,0.9)' }}>
            {mobileTab === 'chemicals' && ChemicalPanel}
            {mobileTab === 'lab' && LabBench}
            {mobileTab === 'ai' && (
              <AIAssistant
                context={currentReaction ? { reaction: currentReaction, chemicals: selectedChemicals } : undefined}
                className="flex-1"
              />
            )}
          </div>
          <div className="hidden lg:flex h-full flex-col">{LabBench}</div>
        </div>

        {/* RIGHT panel */}
        <div className={`hidden lg:flex flex-col flex-shrink-0 border-l border-indigo-500/15 overflow-hidden transition-all duration-300 ${rightOpen ? 'w-80' : 'w-0 border-0'}`}
          style={{ background: 'rgba(10,14,26,0.9)' }}>
          {rightOpen && (
            <AIAssistant
              context={currentReaction ? { reaction: currentReaction, chemicals: selectedChemicals } : undefined}
              className="flex-1"
            />
          )}
        </div>
      </div>

      {MobileTabBar}
    </div>
  );
}
