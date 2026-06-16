"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, FlaskConical, Atom, Play, Trash2, Plus, X,
  ChevronDown, ChevronUp, Search, Bot, Beaker, Settings2,
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

export default function FreeLabPage() {
  const [searchQuery, setSearchQuery]             = useState("");
  const [selectedCategory, setSelectedCategory]   = useState<string>('all');
  const [expandedChemical, setExpandedChemical]   = useState<string | null>(null);
  const [isRunning, setIsRunning]                 = useState(false);
  const [chemTab, setChemTab]                     = useState<'chemicals' | 'equipment'>('chemicals');
  const [mobileTab, setMobileTab]                 = useState<MobileTab>('lab');
  const [leftOpen, setLeftOpen]                   = useState(true);
  const [rightOpen, setRightOpen]                 = useState(true);

  // Equipment interaction state
  const [isHeating, setIsHeating]   = useState(false);
  const [isStirring, setIsStirring] = useState(false);
  const [buretteVol, setBuretteVol] = useState(50);
  const [isDripping, setIsDripping] = useState(false);

  const {
    selectedChemicals, selectedEquipment, currentReaction,
    addChemical, removeChemical, addEquipment, removeEquipment,
    setCurrentReaction, addMessage, incrementExperiments, addDiscoveredReaction, addXP,
  } = useLabStore();

  // Reset equipment state when equipment is removed
  useEffect(() => {
    const hasHeat = selectedEquipment.some(id => ['bunsen_burner', 'hot_plate'].includes(id));
    if (!hasHeat) setIsHeating(false);
    if (!selectedEquipment.includes('magnetic_stirrer')) setIsStirring(false);
    if (!selectedEquipment.includes('burette')) { setBuretteVol(50); setIsDripping(false); }
  }, [selectedEquipment]);

  // Derived flags for active equipment
  const hasHeat       = selectedEquipment.some(id => ['bunsen_burner', 'hot_plate'].includes(id));
  const hasBurette    = selectedEquipment.includes('burette');
  const hasStirrer    = selectedEquipment.includes('magnetic_stirrer');
  const hasPH         = selectedEquipment.includes('ph_meter');
  const hasThermo     = selectedEquipment.includes('thermometer');
  const hasConductivity = selectedEquipment.includes('conductivity_meter');
  const hasBalance    = selectedEquipment.includes('balance');

  // Live instrument readings
  function calcPH(): number {
    if (currentReaction?.pHChange !== null && currentReaction?.pHChange !== undefined) {
      return currentReaction.pHChange as number;
    }
    const vals = selectedChemicals
      .map(id => CHEMICALS.find(c => c.id === id)?.properties.pH)
      .filter((v): v is number => v !== undefined);
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 7;
  }
  function calcTemp(): number {
    let t = 25;
    if (currentReaction?.isExothermic) t += 35;
    else if (currentReaction && selectedChemicals.length > 0) t -= 5;
    if (isHeating) t += 25;
    return Math.min(500, Math.max(0, Math.round(t)));
  }
  function calcConductivity(): number {
    const ionic = selectedChemicals.filter(id => {
      const c = CHEMICALS.find(ch => ch.id === id);
      return c && ['acid', 'base', 'salt'].includes(c.category);
    }).length;
    return ionic * 280;
  }
  function calcMass(): number {
    return selectedChemicals
      .map(id => CHEMICALS.find(c => c.id === id)?.molecularWeight ?? 0)
      .reduce((a, b) => a + b, 0);
  }

  const pH   = calcPH();
  const temp = calcTemp();
  const cond = calcConductivity();
  const mass = calcMass();

  const showInstruments = (hasPH || hasThermo || hasConductivity || hasBalance) && selectedChemicals.length > 0;

  const filteredChemicals = CHEMICALS.filter(c => {
    const q = searchQuery.toLowerCase();
    return (c.name.toLowerCase().includes(q) || c.formula.toLowerCase().includes(q))
      && (selectedCategory === 'all' || c.category === selectedCategory);
  });

  const categories = ['all', ...Array.from(new Set(CHEMICALS.map(c => c.category)))];

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

  const handleDrip = useCallback(() => {
    if (buretteVol <= 0 || isDripping) return;
    setIsDripping(true);
    const newVol = Math.max(0, buretteVol - 1);
    setBuretteVol(newVol);
    const added = 50 - newVol;
    if (added % 5 === 0 || newVol === 0) {
      const msg = newVol === 0
        ? `All 50 mL of titrant added. Refill burette to continue.`
        : `${added} mL of titrant added. Volume remaining: ${newVol} mL.`;
      addMessage({ role: 'assistant', content: msg });
    }
    setTimeout(() => setIsDripping(false), 500);
  }, [buretteVol, isDripping, addMessage]);

  const selectedChemicalObjects = selectedChemicals
    .map(id => CHEMICALS.find(c => c.id === id))
    .filter(Boolean) as Chemical[];

  /* ── Shared Panels ───────────────────────────────────────────────── */

  const ChemicalPanel = (
    <div className="flex flex-col h-full">
      {/* inner tabs */}
      <div className="flex border-b border-indigo-500/15 flex-shrink-0">
        {(['chemicals', 'equipment'] as const).map(t => (
          <button key={t} onClick={() => setChemTab(t)}
            className={`flex-1 py-3 text-sm font-medium transition-colors
              ${chemTab === t ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}>
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
          <div className="px-3 pb-3 flex gap-1.5 flex-wrap flex-shrink-0">
            {categories.slice(0, 7).map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className="px-2 py-1 rounded-md text-xs font-medium capitalize transition-all"
                style={{
                  background: selectedCategory === cat ? 'rgba(99,102,241,0.3)' : 'rgba(30,41,59,0.6)',
                  border: `1px solid ${selectedCategory === cat ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.1)'}`,
                  color:  selectedCategory === cat ? '#a5b4fc' : '#94a3b8',
                }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
            {filteredChemicals.map(chem => {
              const isSelected = selectedChemicals.includes(chem.id);
              const isExpanded = expandedChemical === chem.id;
              const hc = HAZARD_COLORS[chem.hazardLevel];
              return (
                <div key={chem.id} className="rounded-lg overflow-hidden transition-all"
                  style={{
                    background: isSelected ? 'rgba(99,102,241,0.12)' : 'rgba(30,41,59,0.4)',
                    border: isSelected ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(99,102,241,0.1)',
                  }}>
                  <div className="flex items-center justify-between p-2.5 cursor-pointer"
                    onClick={() => setExpandedChemical(isExpanded ? null : chem.id)}>
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
                      {isExpanded ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-2.5 pb-2 border-t border-indigo-500/10">
                      <p className="text-xs text-slate-400 mt-2 mb-2 leading-relaxed">{chem.description}</p>
                      {chem.properties.pH !== undefined && (
                        <div className="text-xs text-slate-400 mb-2">pH: <span className="text-white">{chem.properties.pH}</span></div>
                      )}
                    </div>
                  )}
                  <div className="px-2.5 pb-2.5">
                    <button onClick={e => { e.stopPropagation(); isSelected ? removeChemical(chem.id) : addChemical(chem.id); }}
                      className="w-full py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-all"
                      style={{
                        background: isSelected ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.2)',
                        border:     isSelected ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(99,102,241,0.3)',
                        color:      isSelected ? '#fca5a5' : '#a5b4fc',
                      }}>
                      {isSelected ? (<><X className="w-3 h-3" />Remove</>) : (<><Plus className="w-3 h-3" />Add to Lab</>)}
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
          <p className="text-xs text-slate-500 pb-2">Select equipment to activate instruments and tools in the lab.</p>
          {EQUIPMENT.map(eq => {
            const isSel = selectedEquipment.includes(eq.id);
            const isActive =
              (eq.id === 'bunsen_burner' || eq.id === 'hot_plate') ? isHeating :
              eq.id === 'magnetic_stirrer' ? isStirring : false;
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
                    <div className="text-xs text-slate-400 capitalize">{eq.category}</div>
                  </div>
                  {isSel && (
                    <div className="flex items-center gap-1">
                      {isActive && <span className="text-xs text-emerald-400 font-medium">ON</span>}
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const LabBench = (
    <div className="flex flex-col h-full">
      {/* Selected chemicals row */}
      {selectedChemicalObjects.length > 0 && (
        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 flex-shrink-0">
          {selectedChemicalObjects.map(chem => (
            <div key={chem.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm"
              style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
              <span className="font-mono font-bold text-xs">{chem.formula}</span>
              <button onClick={() => removeChemical(chem.id)} className="text-slate-500 hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Instrument readings bar */}
      {showInstruments && (
        <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-indigo-500/10 flex-shrink-0"
          style={{ background: 'rgba(10,14,26,0.6)' }}>
          {hasPH && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <span className="text-sm">📊</span>
              <span className="text-xs text-slate-400">pH</span>
              <span className="text-sm font-mono font-bold text-white">{pH.toFixed(1)}</span>
              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.8)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(pH / 14) * 100}%`,
                    background: pH < 3 ? '#ef4444' : pH < 6 ? '#f97316' : pH < 8 ? '#10b981' : pH < 11 ? '#6366f1' : '#8b5cf6',
                  }} />
              </div>
            </div>
          )}
          {hasThermo && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <span className="text-sm">🌡️</span>
              <span className="text-xs text-slate-400">Temp</span>
              <span className="text-sm font-mono font-bold"
                style={{ color: temp > 60 ? '#f87171' : temp < 20 ? '#93c5fd' : '#fcd34d' }}>
                {temp}°C
              </span>
            </div>
          )}
          {hasConductivity && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <span className="text-sm">⚡</span>
              <span className="text-xs text-slate-400">Cond.</span>
              <span className="text-sm font-mono font-bold text-amber-300">{cond} mS/cm</span>
            </div>
          )}
          {hasBalance && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span className="text-sm">⚖️</span>
              <span className="text-xs text-slate-400">Avg MW</span>
              <span className="text-sm font-mono font-bold text-emerald-300">{mass.toFixed(1)} g/mol</span>
            </div>
          )}
        </div>
      )}

      {/* Main reaction area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(10,14,26,0.95) 0%, rgba(15,23,42,0.9) 100%)' }}>
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        {/* Lab bench with burette + flask side by side */}
        <div className="relative z-10 flex items-end justify-center gap-8">

          {/* Burette (shown when burette equipment selected) */}
          {hasBurette && (
            <div className="flex flex-col items-center gap-1 pb-4">
              <div className="text-xs text-slate-400 font-mono mb-1"
                style={{ color: buretteVol < 10 ? '#fca5a5' : '#94a3b8' }}>
                {buretteVol.toFixed(0)} mL
              </div>
              <svg width="36" height="140" viewBox="0 0 36 140" className="overflow-visible">
                {/* Burette body */}
                <rect x="13" y="2" width="10" height="110" rx="3"
                  fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
                {/* Liquid in burette */}
                <clipPath id="burette-clip">
                  <rect x="13.5" y="2.5" width="9" height="109" rx="2" />
                </clipPath>
                <rect x="13.5" y={111.5 - buretteVol * 1.09} width="9" height={buretteVol * 1.09}
                  fill="rgba(99,102,241,0.4)"
                  clipPath="url(#burette-clip)"
                  style={{ transition: 'all 0.4s ease' }} />
                {/* Graduation marks */}
                {[22, 44, 66, 88].map((y, i) => (
                  <g key={y}>
                    <line x1="18" y1={y} x2="23" y2={y} stroke="rgba(99,102,241,0.5)" strokeWidth="1" />
                    <text x="25" y={y + 3} fontSize="5" fill="rgba(148,163,184,0.7)">{(i + 1) * 10}</text>
                  </g>
                ))}
                {/* Stopcock */}
                <rect x="11" y="112" width="14" height="5" rx="2"
                  fill="rgba(99,102,241,0.3)" stroke="rgba(99,102,241,0.6)" strokeWidth="1" />
                {/* Tip */}
                <path d="M16 117 L20 117 L18 132 Z"
                  fill="rgba(99,102,241,0.3)" stroke="rgba(99,102,241,0.5)" strokeWidth="1" />
                {/* Drip drop */}
                {isDripping && (
                  <ellipse cx="18" cy="135" rx="2.5" ry="3.5"
                    fill="rgba(99,102,241,0.7)"
                    style={{ animation: 'bubble-rise 0.5s ease-in forwards' }} />
                )}
              </svg>
              <button
                onClick={handleDrip}
                disabled={buretteVol <= 0}
                className="mt-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
                Drip
              </button>
              {buretteVol <= 0 && (
                <button onClick={() => setBuretteVol(50)}
                  className="text-xs px-2 py-1 rounded-md transition-all"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}>
                  Refill
                </button>
              )}
            </div>
          )}

          {/* Main flask area */}
          <div className="relative">
            {/* Flame under flask when heating */}
            {isHeating && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-0"
                style={{ filter: 'blur(1px)' }}>
                <span className="text-2xl animate-pulse" style={{ animationDuration: '0.4s' }}>🔥</span>
                <span className="text-xl animate-pulse" style={{ animationDuration: '0.3s', animationDelay: '0.1s' }}>🔥</span>
                <span className="text-2xl animate-pulse" style={{ animationDuration: '0.5s', animationDelay: '0.05s' }}>🔥</span>
              </div>
            )}

            <div className="relative z-10">
              <ReactionVessel reaction={currentReaction} chemicals={selectedChemicals} isRunning={isRunning} />
            </div>

            {/* Stirring indicator at bottom of flask */}
            {isStirring && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20">
                <div className="w-14 h-2 rounded-full animate-spin"
                  style={{ background: 'rgba(6,182,212,0.6)', animationDuration: '0.4s' }} />
              </div>
            )}
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 z-10 relative">
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
          <p className="mt-3 text-slate-500 text-sm text-center z-10 relative">Add at least 2 chemicals to run a reaction</p>
        )}
      </div>

      {/* Reaction result */}
      {currentReaction && (
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
            const isOn =
              (id === 'bunsen_burner' || id === 'hot_plate') ? isHeating :
              id === 'magnetic_stirrer' ? isStirring :
              id === 'burette' ? true : false;
            return (
              <div key={id} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                style={{
                  background: isOn ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)',
                  border: isOn ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(16,185,129,0.2)',
                }}
                onClick={() => {
                  if (id === 'bunsen_burner' || id === 'hot_plate') setIsHeating(v => !v);
                  else if (id === 'magnetic_stirrer') setIsStirring(v => !v);
                }}>
                <span className="text-base">{eq.icon}</span>
                <span className="text-xs text-slate-300 whitespace-nowrap">{eq.name}</span>
                {isOn && <span className="text-xs text-emerald-400 font-bold">●</span>}
                <button onClick={e => { e.stopPropagation(); removeEquipment(id); }} className="text-slate-500 hover:text-red-400 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ── MOBILE BOTTOM TAB BAR ─────────────────────────────────────────── */
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
            {mobileTab === tab.id && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-indigo-500" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );

  /* ── RENDER ─────────────────────────────────────────────────────────── */
  return (
    <div className="h-screen flex flex-col" style={{ background: '#0a0e1a', color: '#e2e8f0' }}>

      {/* ── Top Header ── */}
      <header className="flex-shrink-0 border-b border-indigo-500/15 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <div className="w-px h-4 bg-slate-600 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white text-sm">Free Laboratory</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* desktop panel toggles */}
          <button onClick={() => setLeftOpen(v => !v)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
            style={{ background: leftOpen ? 'rgba(99,102,241,0.2)' : 'rgba(30,41,59,0.4)', color: leftOpen ? '#a5b4fc' : '#64748b', border: '1px solid rgba(99,102,241,0.15)' }}>
            <Settings2 className="w-3.5 h-3.5" />
            Chemicals
          </button>
          <button onClick={() => setRightOpen(v => !v)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
            style={{ background: rightOpen ? 'rgba(99,102,241,0.2)' : 'rgba(30,41,59,0.4)', color: rightOpen ? '#a5b4fc' : '#64748b', border: '1px solid rgba(99,102,241,0.15)' }}>
            <Bot className="w-3.5 h-3.5" />
            AI
          </button>

          <span className="text-xs text-slate-500 hidden sm:inline">
            {selectedChemicals.length} chem.
          </span>
          <button
            onClick={() => { selectedChemicals.forEach(id => removeChemical(id)); setCurrentReaction(null); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 transition-colors"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      {/* ── Main area ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ── LEFT PANEL (desktop) ── */}
        <div className={`
          hidden lg:flex flex-col flex-shrink-0 border-r border-indigo-500/15 overflow-hidden
          transition-all duration-300
          ${leftOpen ? 'w-72' : 'w-0 border-0'}
        `}
          style={{ background: 'rgba(10,14,26,0.9)' }}>
          {leftOpen && ChemicalPanel}
        </div>

        {/* ── CENTER / MOBILE TAB CONTENT ── */}
        <div className="flex-1 overflow-hidden min-w-0">

          {/* Mobile: one tab at a time */}
          <div className="lg:hidden h-full flex flex-col overflow-hidden"
            style={{ background: 'rgba(10,14,26,0.9)' }}>
            {mobileTab === 'chemicals' && ChemicalPanel}
            {mobileTab === 'lab'       && LabBench}
            {mobileTab === 'ai'        && (
              <AIAssistant
                context={currentReaction ? { reaction: currentReaction, chemicals: selectedChemicals } : undefined}
                className="flex-1"
              />
            )}
          </div>

          {/* Desktop: always show lab bench */}
          <div className="hidden lg:flex h-full flex-col">
            {LabBench}
          </div>
        </div>

        {/* ── RIGHT PANEL (desktop) ── */}
        <div className={`
          hidden lg:flex flex-col flex-shrink-0 border-l border-indigo-500/15 overflow-hidden
          transition-all duration-300
          ${rightOpen ? 'w-80' : 'w-0 border-0'}
        `}
          style={{ background: 'rgba(10,14,26,0.9)' }}>
          {rightOpen && (
            <AIAssistant
              context={currentReaction ? { reaction: currentReaction, chemicals: selectedChemicals } : undefined}
              className="flex-1"
            />
          )}
        </div>
      </div>

      {/* ── Mobile Bottom Tab Bar ── */}
      {MobileTabBar}
    </div>
  );
}
