"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, FlaskConical, Atom, Play, Trash2, Plus, X, ChevronDown, ChevronUp, Search, Beaker } from "lucide-react";
import { CHEMICALS, Chemical } from "@/lib/chemicals";
import { EQUIPMENT } from "@/lib/equipment";
import { simulateReaction } from "@/lib/reactions";
import { useLabStore } from "@/store/labStore";
import AIAssistant from "@/components/lab/AIAssistant";
import ReactionVessel from "@/components/lab/ReactionVessel";

const HAZARD_COLORS = {
  low: { bg: 'rgba(16,185,129,0.15)', text: '#6ee7b7', border: 'rgba(16,185,129,0.3)' },
  medium: { bg: 'rgba(245,158,11,0.15)', text: '#fcd34d', border: 'rgba(245,158,11,0.3)' },
  high: { bg: 'rgba(239,68,68,0.15)', text: '#fca5a5', border: 'rgba(239,68,68,0.3)' },
};

const CATEGORY_COLORS: Record<string, string> = {
  acid: '#ef4444', base: '#6366f1', salt: '#10b981', metal: '#f59e0b',
  organic: '#8b5cf6', indicator: '#06b6d4', oxidizer: '#f97316', solvent: '#64748b', other: '#94a3b8',
};

export default function FreeLabPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showChemicalPanel, setShowChemicalPanel] = useState(true);
  const [showEquipmentPanel, setShowEquipmentPanel] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [expandedChemical, setExpandedChemical] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'chemicals' | 'equipment'>('chemicals');

  const {
    selectedChemicals, selectedEquipment, currentReaction,
    addChemical, removeChemical, addEquipment, removeEquipment,
    setCurrentReaction, addMessage, incrementExperiments, addDiscoveredReaction, addXP,
  } = useLabStore();

  const filteredChemicals = CHEMICALS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.formula.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

    const reactionKey = [...selectedChemicals].sort().join('+');
    addDiscoveredReaction(reactionKey);

    addMessage({
      role: 'assistant',
      content: `Reaction completed! ${result.equation}\n\n${result.description}\n\nObservations: ${result.observations.join(', ')}`
    });

    setIsRunning(false);
  }, [selectedChemicals, setCurrentReaction, incrementExperiments, addXP, addDiscoveredReaction, addMessage]);

  const selectedChemicalObjects = selectedChemicals.map(id => CHEMICALS.find(c => c.id === id)).filter(Boolean) as Chemical[];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0e1a', color: '#e2e8f0' }}>
      {/* Header */}
      <header className="border-b border-indigo-500/15 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <div className="w-px h-4 bg-slate-600" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Free Laboratory</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-400">
            {selectedChemicals.length} chemical{selectedChemicals.length !== 1 ? 's' : ''} selected
          </div>
          <button
            onClick={() => { removeChemical(selectedChemicals[0]); selectedChemicals.forEach(id => removeChemical(id)); setCurrentReaction(null); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:text-red-300 transition-colors"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Chemicals & Equipment */}
        <div className="w-72 flex-shrink-0 border-r border-indigo-500/15 flex flex-col overflow-hidden"
          style={{ background: 'rgba(10,14,26,0.9)' }}>

          {/* Tabs */}
          <div className="flex border-b border-indigo-500/15">
            <button
              onClick={() => setActiveTab('chemicals')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'chemicals' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}>
              🧪 Chemicals
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'equipment' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}>
              🔬 Equipment
            </button>
          </div>

          {activeTab === 'chemicals' && (
            <>
              {/* Search */}
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search chemicals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg text-white placeholder-slate-500 outline-none"
                    style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
                  />
                </div>
              </div>

              {/* Category filter */}
              <div className="px-3 pb-3 flex gap-1.5 flex-wrap">
                {categories.slice(0, 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-2 py-1 rounded-md text-xs font-medium capitalize transition-all"
                    style={{
                      background: selectedCategory === cat ? 'rgba(99,102,241,0.3)' : 'rgba(30,41,59,0.6)',
                      border: `1px solid ${selectedCategory === cat ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.1)'}`,
                      color: selectedCategory === cat ? '#a5b4fc' : '#94a3b8',
                    }}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Chemical list */}
              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
                {filteredChemicals.map(chem => {
                  const isSelected = selectedChemicals.includes(chem.id);
                  const isExpanded = expandedChemical === chem.id;
                  const hazardColor = HAZARD_COLORS[chem.hazardLevel];

                  return (
                    <div key={chem.id}
                      className="rounded-lg overflow-hidden transition-all"
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
                        <div className="flex items-center gap-1">
                          <span className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: hazardColor.bg, color: hazardColor.text, border: `1px solid ${hazardColor.border}` }}>
                            {chem.hazardLevel}
                          </span>
                          {isExpanded ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-2.5 pb-2.5 border-t border-indigo-500/10">
                          <p className="text-xs text-slate-400 mt-2 mb-2 leading-relaxed">{chem.description}</p>
                          {chem.properties.pH !== undefined && (
                            <div className="text-xs text-slate-400 mb-2">pH: <span className="text-white">{chem.properties.pH}</span></div>
                          )}
                        </div>
                      )}

                      <div className="px-2.5 pb-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSelected) removeChemical(chem.id);
                            else addChemical(chem.id);
                          }}
                          className="w-full py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-all"
                          style={{
                            background: isSelected ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.2)',
                            border: isSelected ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(99,102,241,0.3)',
                            color: isSelected ? '#fca5a5' : '#a5b4fc',
                          }}>
                          {isSelected ? (<><X className="w-3 h-3" /> Remove</>) : (<><Plus className="w-3 h-3" /> Add to Lab</>)}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === 'equipment' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {EQUIPMENT.map(eq => {
                const isSelected = selectedEquipment.includes(eq.id);
                return (
                  <div key={eq.id}
                    className="rounded-lg p-2.5 cursor-pointer transition-all"
                    style={{
                      background: isSelected ? 'rgba(16,185,129,0.1)' : 'rgba(30,41,59,0.4)',
                      border: isSelected ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(99,102,241,0.1)',
                    }}
                    onClick={() => {
                      if (isSelected) removeEquipment(eq.id);
                      else addEquipment(eq.id);
                    }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{eq.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-white">{eq.name}</div>
                        <div className="text-xs text-slate-400 capitalize">{eq.category}</div>
                      </div>
                      {isSelected && <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Center - Lab Bench */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Lab workspace */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, rgba(10,14,26,0.95) 0%, rgba(15,23,42,0.9) 100%)' }}>

            {/* Background grid */}
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

            {/* Selected chemicals display */}
            {selectedChemicalObjects.length > 0 && (
              <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                {selectedChemicalObjects.map(chem => (
                  <div key={chem.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                    style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
                    <span className="font-mono font-bold">{chem.formula}</span>
                    <button onClick={() => removeChemical(chem.id)} className="text-slate-500 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Main reaction vessel */}
            <div className="flex flex-col items-center">
              <ReactionVessel
                reaction={currentReaction}
                chemicals={selectedChemicals}
                isRunning={isRunning}
              />

              {/* Run button */}
              <button
                onClick={handleRunReaction}
                disabled={selectedChemicals.length < 2 || isRunning}
                className="mt-6 flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: selectedChemicals.length >= 2
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'rgba(30,41,59,0.6)',
                  boxShadow: selectedChemicals.length >= 2 ? '0 0 30px rgba(99,102,241,0.3)' : 'none',
                }}>
                <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
                {isRunning ? 'Simulating...' : 'Run Reaction'}
              </button>

              {selectedChemicals.length < 2 && (
                <p className="mt-3 text-slate-500 text-sm">Add at least 2 chemicals to run a reaction</p>
              )}
            </div>

            {/* Reaction result */}
            {currentReaction && (
              <div className="absolute bottom-4 left-4 right-4 rounded-xl p-4 max-h-48 overflow-y-auto"
                style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div className="flex items-start gap-3">
                  <Atom className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-indigo-300 text-sm font-bold mb-1">{currentReaction.equation}</div>
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
          </div>

          {/* Equipment strip */}
          {selectedEquipment.length > 0 && (
            <div className="px-4 py-3 border-t border-indigo-500/15 flex gap-3 overflow-x-auto"
              style={{ background: 'rgba(15,23,42,0.8)' }}>
              {selectedEquipment.map(id => {
                const eq = EQUIPMENT.find(e => e.id === id);
                if (!eq) return null;
                return (
                  <div key={id} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <span className="text-lg">{eq.icon}</span>
                    <span className="text-xs text-slate-300 whitespace-nowrap">{eq.name}</span>
                    <button onClick={() => removeEquipment(id)} className="text-slate-500 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Panel - AI Assistant */}
        <div className="w-80 flex-shrink-0 border-l border-indigo-500/15 flex flex-col"
          style={{ background: 'rgba(10,14,26,0.9)' }}>
          <AIAssistant
            context={currentReaction ? { reaction: currentReaction, chemicals: selectedChemicals } : undefined}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
