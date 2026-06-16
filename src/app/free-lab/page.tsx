'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CHEMICALS, Chemical, findReaction } from '@/lib/chemicals';
import { useStore } from '@/lib/store';

const EQUIPMENT = [
  { id: 'beaker', name: 'Beaker', icon: '🧪', desc: 'For mixing and holding liquids' },
  { id: 'erlenmeyer', name: 'Erlenmeyer Flask', icon: '⚗️', desc: 'For mixing with reduced evaporation' },
  { id: 'test_tube', name: 'Test Tube', icon: '🔬', desc: 'Small-scale reactions' },
  { id: 'pipette', name: 'Pipette', icon: '💧', desc: 'Precise liquid transfer' },
  { id: 'burette', name: 'Burette', icon: '📏', desc: 'Precise volume dispensing' },
  { id: 'thermometer', name: 'Thermometer', icon: '🌡️', desc: 'Temperature measurement' },
  { id: 'ph_meter', name: 'pH Meter', icon: '📊', desc: 'Precise pH measurement' },
  { id: 'balance', name: 'Analytical Balance', icon: '⚖️', desc: 'Precise mass measurement' },
  { id: 'hotplate', name: 'Hot Plate', icon: '🔥', desc: 'Controlled heating' },
  { id: 'bunsen', name: 'Bunsen Burner', icon: '🕯️', desc: 'Open flame heating' },
  { id: 'conductivity', name: 'Conductivity Meter', icon: '⚡', desc: 'Electrical conductivity' },
  { id: 'centrifuge', name: 'Centrifuge', icon: '🌀', desc: 'Separation by density' },
];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const CATEGORIES = ['all', 'acid', 'base', 'salt', 'organic', 'indicator', 'solvent'] as const;
type Category = typeof CATEGORIES[number];

const HAZARD_COLORS: Record<string, string> = {
  safe: '#10b981',
  low: '#f59e0b',
  medium: '#f97316',
  high: '#ef4444',
};

export default function FreeLabPage() {
  const [selectedChemicals, setSelectedChemicals] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'chemicals' | 'equipment' | 'results' | 'ai'>('chemicals');
  const [category, setCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [reaction, setReaction] = useState<ReturnType<typeof findReaction>>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(25);
  const [isHeating, setIsHeating] = useState(false);
  const [showDetail, setShowDetail] = useState<Chemical | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { addXP, addToHistory } = useStore();

  const filteredChemicals = CHEMICALS.filter(c => {
    const matchCat = category === 'all' || c.category === category;
    const matchSearch = !search || c.formula.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nameTr.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleChemical = (id: string) => {
    setSelectedChemicals(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleEquipment = (id: string) => {
    setSelectedEquipment(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  useEffect(() => {
    if (selectedChemicals.length >= 2) {
      const r = findReaction(selectedChemicals);
      setReaction(r);
      if (r) {
        addXP(20);
        addToHistory(selectedChemicals.join('-'));
        setActiveTab('results');
      }
    } else {
      setReaction(null);
    }
  }, [selectedChemicals]);

  useEffect(() => {
    if (isHeating) {
      const interval = setInterval(() => {
        setTemperature(t => Math.min(t + 2, 150));
      }, 200);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        setTemperature(t => Math.max(t - 1, 20));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isHeating]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const context = selectedChemicals.length > 0
        ? `Selected chemicals: ${selectedChemicals.map(id => CHEMICALS.find(c => c.id === id)?.formula || id).join(', ')}. ${reaction ? `Current reaction: ${reaction.equation}` : ''}`
        : '';
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context, mode: 'free-lab' }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'I could not process that request.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearLab = () => {
    setSelectedChemicals([]);
    setSelectedEquipment([]);
    setReaction(null);
    setTemperature(25);
    setIsHeating(false);
    setActiveTab('chemicals');
  };

  const getReactionLiquidColor = () => {
    if (!reaction) {
      if (selectedChemicals.includes('cuso4')) return '#1a7abf';
      if (selectedChemicals.includes('cucl2')) return '#3ca0c8';
      if (selectedChemicals.includes('fecl3')) return '#8b4513';
      if (selectedChemicals.includes('methyl_orange')) return '#ff8800';
      return 'rgba(0,212,255,0.3)';
    }
    if (reaction.colorChange?.includes('Pink')) return 'rgba(255, 20, 147, 0.4)';
    if (reaction.colorChange?.includes('Blue')) return 'rgba(30, 144, 255, 0.5)';
    if (reaction.precipitate?.includes('White')) return 'rgba(220,220,220,0.6)';
    if (reaction.precipitate?.includes('Blue')) return 'rgba(30,144,255,0.5)';
    return 'rgba(100,200,180,0.4)';
  };

  const pH = reaction?.phChange ?? (selectedChemicals.includes('hcl') ? 1 : selectedChemicals.includes('naoh') ? 14 : 7);

  return (
    <div className="min-h-screen lab-bg flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xl" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
            🔭
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Free Laboratory</h1>
            <p className="text-xs text-gray-500">Open exploration — no restrictions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedChemicals.length > 0 && (
            <button onClick={clearLab} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              Clear Lab
            </button>
          )}
          <Link href="/curriculum" className="px-4 py-2 rounded-lg text-sm text-purple-300 hover:text-purple-200 transition-colors" style={{ border: '1px solid rgba(124,58,237,0.3)' }}>
            → Curriculum Lab
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Workspace */}
        <div className="flex-1 flex flex-col p-4 gap-4 min-w-0">
          {/* Virtual Beaker Visualization */}
          <div className="glass-card p-6 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white text-sm">Lab Workspace</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>🌡️ {temperature}°C</span>
                {pH !== undefined && (
                  <span style={{ color: pH < 7 ? '#ef4444' : pH > 7 ? '#7c3aed' : '#10b981' }}>
                    pH {pH.toFixed(1)}
                  </span>
                )}
                {reaction?.gasFormed && <span className="text-yellow-400">Gas: {reaction.gasFormed}↑</span>}
              </div>
            </div>

            <div className="flex items-end justify-center gap-6">
              {/* Main beaker */}
              <div className="relative" style={{ width: 120, height: 160 }}>
                <svg viewBox="0 0 120 160" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.2))' }}>
                  {/* Beaker shape */}
                  <path d="M20 10 L20 140 Q20 155 35 155 L85 155 Q100 155 100 140 L100 10 Z"
                    fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.4)" strokeWidth="2" />
                  {/* Liquid */}
                  {selectedChemicals.length > 0 && (
                    <rect x="21" y="80" width="78" height="73" rx="0"
                      fill={getReactionLiquidColor()}
                      style={{ transition: 'fill 1s ease' }} />
                  )}
                  {/* Bubbles */}
                  {(reaction?.gasFormed || isHeating) && selectedChemicals.length > 0 && (
                    <>
                      <circle cx="50" cy="90" r="3" fill="rgba(255,255,255,0.3)" className="animate-pulse" />
                      <circle cx="70" cy="100" r="2" fill="rgba(255,255,255,0.3)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <circle cx="40" cy="110" r="2.5" fill="rgba(255,255,255,0.3)" className="animate-pulse" style={{ animationDelay: '1s' }} />
                    </>
                  )}
                  {/* Precipitate */}
                  {reaction?.precipitate && (
                    <rect x="25" y="140" width="70" height="12" rx="2"
                      fill={reaction.precipitate.includes('White') ? 'rgba(240,240,255,0.7)' : reaction.precipitate.includes('Blue') ? 'rgba(30,144,255,0.6)' : 'rgba(200,200,200,0.5)'} />
                  )}
                  {/* Measurement marks */}
                  {[25, 50, 75].map(pct => (
                    <line key={pct} x1="95" y1={155 - pct * 1.2} x2="105" y2={155 - pct * 1.2} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  ))}
                  {/* Spout */}
                  <path d="M20 20 L10 10 M100 20 L110 10" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5" fill="none" />
                </svg>

                {/* Chemical labels */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {selectedChemicals.slice(0, 3).map(id => {
                      const c = CHEMICALS.find(ch => ch.id === id);
                      return c ? (
                        <span key={id} className="text-xs font-mono px-1.5 py-0.5 rounded text-white"
                          style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
                          {c.formula}
                        </span>
                      ) : null;
                    })}
                    {selectedChemicals.length > 3 && <span className="text-xs text-gray-500">+{selectedChemicals.length - 3}</span>}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsHeating(!isHeating)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isHeating ? 'text-red-400' : 'text-gray-400'}`}
                  style={{ background: isHeating ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isHeating ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                  {isHeating ? '🔥 Heating' : '🔥 Heat'}
                </button>
                <button
                  onClick={() => setTemperature(20)}
                  className="px-4 py-2 rounded-lg text-sm text-gray-400 transition-all hover:text-blue-300"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  ❄️ Cool
                </button>
                <button
                  onClick={() => { if (selectedChemicals.length >= 2) addXP(10); }}
                  className="px-4 py-2 rounded-lg text-sm text-gray-400 transition-all hover:text-cyan-300"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  🔄 Mix
                </button>
              </div>

              {/* Thermometer */}
              <div className="relative flex flex-col items-center" style={{ height: 120 }}>
                <svg viewBox="0 0 30 120" className="h-full">
                  <rect x="12" y="5" width="6" height="85" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <rect x="13" y={90 - temperature * 0.5} width="4" height={temperature * 0.5} rx="1"
                    fill={temperature > 80 ? '#ef4444' : temperature > 50 ? '#f59e0b' : '#3b82f6'}
                    style={{ transition: 'height 0.3s ease, y 0.3s ease' }} />
                  <circle cx="15" cy="100" r="8" fill={temperature > 80 ? '#ef4444' : temperature > 50 ? '#f59e0b' : '#3b82f6'} />
                  <text x="15" y="104" fontSize="6" fill="white" textAnchor="middle">{temperature}</text>
                </svg>
              </div>
            </div>

            {/* Reaction indicator */}
            {reaction && (
              <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400 font-mono font-bold">{reaction.equation}</span>
                  {reaction.temperatureChange === 'exothermic' && <span className="badge badge-red">Exothermic</span>}
                  {reaction.temperatureChange === 'endothermic' && <span className="badge badge-cyan">Endothermic</span>}
                </div>
                {reaction.precipitate && <p className="text-xs text-yellow-400">Precipitate: {reaction.precipitate}</p>}
                {reaction.gasFormed && <p className="text-xs text-blue-400">Gas: {reaction.gasFormed} formed</p>}
                {reaction.colorChange && <p className="text-xs text-pink-400">Color change: {reaction.colorChange}</p>}
              </div>
            )}

            {selectedChemicals.length === 0 && (
              <div className="text-center py-4 text-gray-600 text-sm">
                Select chemicals from the panel → to begin your experiment
              </div>
            )}
          </div>

          {/* Equipment display */}
          {selectedEquipment.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Selected Equipment</h3>
              <div className="flex flex-wrap gap-2">
                {selectedEquipment.map(id => {
                  const eq = EQUIPMENT.find(e => e.id === id);
                  return eq ? (
                    <div key={id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                      style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                      <span>{eq.icon}</span>
                      <span className="text-gray-300">{eq.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Control panel */}
        <div className="w-96 flex flex-col border-l" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
            {([
              { key: 'chemicals', label: 'Chemicals', icon: '🧪' },
              { key: 'equipment', label: 'Equipment', icon: '⚗️' },
              { key: 'results', label: 'Results', icon: '📊' },
              { key: 'ai', label: 'AI Tutor', icon: '🤖' },
            ] as const).map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === tab.key ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                style={{ borderBottom: activeTab === tab.key ? '2px solid #00d4ff' : '2px solid transparent' }}>
                <span className="hidden sm:inline">{tab.icon} </span>{tab.label}
                {tab.key === 'results' && reaction && <span className="ml-1 text-green-400">●</span>}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* CHEMICALS TAB */}
            {activeTab === 'chemicals' && (
              <div className="p-4">
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search chemicals..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    style={{ borderColor: 'rgba(0,212,255,0.2)' }}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-xs capitalize transition-colors ${category === cat ? 'text-black font-semibold' : 'text-gray-400'}`}
                      style={{ background: category === cat ? '#00d4ff' : 'rgba(255,255,255,0.05)' }}>
                      {cat}
                    </button>
                  ))}
                </div>

                {selectedChemicals.length > 0 && (
                  <div className="mb-3 p-2 rounded-lg text-xs" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <span className="text-gray-400">Selected: </span>
                    {selectedChemicals.map(id => CHEMICALS.find(c => c.id === id)?.formula).join(' + ')}
                  </div>
                )}

                <div className="space-y-2">
                  {filteredChemicals.map(chemical => (
                    <div key={chemical.id}>
                      <div
                        className={`chemical-card p-3 ${selectedChemicals.includes(chemical.id) ? 'selected' : ''}`}
                        onClick={() => toggleChemical(chemical.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-mono font-bold" style={{ color: '#00d4ff' }}>{chemical.formula}</span>
                            <div>
                              <div className="text-xs text-white">{chemical.nameTr}</div>
                              <div className="text-xs text-gray-500">{chemical.name}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="badge" style={{
                              background: `${HAZARD_COLORS[chemical.hazard]}22`,
                              color: HAZARD_COLORS[chemical.hazard],
                              border: `1px solid ${HAZARD_COLORS[chemical.hazard]}44`,
                              fontSize: '9px'
                            }}>{chemical.hazardLabel}</span>
                            <button onClick={(e) => { e.stopPropagation(); setShowDetail(showDetail?.id === chemical.id ? null : chemical); }}
                              className="text-xs text-gray-600 hover:text-cyan-400">
                              {showDetail?.id === chemical.id ? '▲' : '▼'}
                            </button>
                          </div>
                        </div>
                      </div>
                      {showDetail?.id === chemical.id && (
                        <div className="mt-1 p-3 rounded-lg text-xs space-y-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <p className="text-gray-300">{chemical.description}</p>
                          <div>
                            <span className="text-gray-500">State: </span>
                            <span className="text-white capitalize">{chemical.state}</span>
                          </div>
                          {chemical.pH !== undefined && (
                            <div><span className="text-gray-500">pH: </span><span className="text-white">{chemical.pH}</span></div>
                          )}
                          <div><span className="text-gray-500">Molar mass: </span><span className="text-white">{chemical.molarMass} g/mol</span></div>
                          {chemical.properties.map(p => (
                            <div key={p.label}><span className="text-gray-500">{p.label}: </span><span className="text-white">{p.value}</span></div>
                          ))}
                          <div>
                            <span className="text-gray-500">Uses: </span>
                            <span className="text-white">{chemical.uses.join(', ')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EQUIPMENT TAB */}
            {activeTab === 'equipment' && (
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-4">Select equipment to use in your experiment</p>
                <div className="grid grid-cols-2 gap-2">
                  {EQUIPMENT.map(eq => (
                    <div key={eq.id} className="equipment-item p-3 rounded-xl text-center cursor-pointer transition-all"
                      onClick={() => toggleEquipment(eq.id)}
                      style={{
                        background: selectedEquipment.includes(eq.id) ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selectedEquipment.includes(eq.id) ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      }}>
                      <div className="text-2xl mb-1">{eq.icon}</div>
                      <div className="text-xs text-white font-medium leading-tight">{eq.name}</div>
                      <div className="text-xs text-gray-600 mt-1 leading-tight">{eq.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESULTS TAB */}
            {activeTab === 'results' && (
              <div className="p-4">
                {reaction ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
                      <h3 className="text-sm font-semibold text-green-400 mb-2">Reaction Detected!</h3>
                      <p className="font-mono text-white text-sm mb-2">{reaction.equation}</p>
                      <span className="badge badge-cyan">{reaction.type}</span>
                    </div>

                    <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <h4 className="text-gray-300 font-medium mb-2">Description</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">{reaction.description}</p>
                    </div>

                    <div className="space-y-2">
                      {reaction.products.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="badge badge-green mt-0.5">Products</span>
                          <span className="text-sm text-white">{reaction.products.join(', ')}</span>
                        </div>
                      )}
                      {reaction.colorChange && (
                        <div className="flex items-start gap-2">
                          <span className="badge badge-purple mt-0.5">Color</span>
                          <span className="text-sm text-white">{reaction.colorChange}</span>
                        </div>
                      )}
                      {reaction.gasFormed && (
                        <div className="flex items-start gap-2">
                          <span className="badge badge-yellow mt-0.5">Gas</span>
                          <span className="text-sm text-white">{reaction.gasFormed} ↑</span>
                        </div>
                      )}
                      {reaction.precipitate && (
                        <div className="flex items-start gap-2">
                          <span className="badge badge-cyan mt-0.5">Precipitate</span>
                          <span className="text-sm text-white">{reaction.precipitate}</span>
                        </div>
                      )}
                      {reaction.temperatureChange !== 'none' && (
                        <div className="flex items-start gap-2">
                          <span className={`badge ${reaction.temperatureChange === 'exothermic' ? 'badge-red' : 'badge-cyan'} mt-0.5`}>
                            {reaction.temperatureChange}
                          </span>
                          <span className="text-sm text-white">
                            {reaction.temperatureChange === 'exothermic' ? 'Heat released to surroundings' : 'Heat absorbed from surroundings'}
                          </span>
                        </div>
                      )}
                      {reaction.phChange !== undefined && (
                        <div className="flex items-start gap-2">
                          <span className="badge badge-green mt-0.5">pH</span>
                          <span className="text-sm text-white">≈ {reaction.phChange}</span>
                        </div>
                      )}
                    </div>

                    <button onClick={() => { setActiveTab('ai'); setInput(`Explain the reaction: ${reaction.equation}`); }}
                      className="w-full py-2 rounded-xl text-sm text-cyan-400 transition-colors"
                      style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                      🤖 Ask AI to explain this reaction
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-600">
                    <div className="text-4xl mb-3">⚗️</div>
                    <p className="text-sm">Select at least 2 chemicals to see reaction results</p>
                  </div>
                )}

                {selectedChemicals.length > 0 && !reaction && (
                  <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <h3 className="text-sm font-semibold text-yellow-400 mb-2">No Reaction</h3>
                    <p className="text-xs text-gray-400">The selected chemicals do not react significantly under normal conditions.</p>
                    <p className="text-xs text-gray-500 mt-1">Try heating the mixture or adding a catalyst.</p>
                  </div>
                )}
              </div>
            )}

            {/* AI TUTOR TAB */}
            {activeTab === 'ai' && (
              <div className="flex flex-col h-full" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 200, maxHeight: 400 }}>
                  {messages.length === 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 text-center mb-4">Ask your AI chemistry tutor anything!</p>
                      {[
                        'Why did the solution turn blue?',
                        'What is the oxidation state of copper?',
                        'Explain acid-base neutralization',
                        'What gas is formed when HCl reacts with NaOH?',
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
                      <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-300'}`}
                        style={{
                          background: msg.role === 'user' ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.06)',
                          border: `1px solid ${msg.role === 'user' ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        }}>
                        {msg.role === 'assistant' && <span className="text-cyan-400 font-semibold block mb-1">🤖 AI Tutor</span>}
                        <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="px-3 py-2 rounded-xl text-xs" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <span className="text-cyan-400">🤖 AI Tutor</span>
                        <div className="flex gap-1 mt-1">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask a chemistry question..."
                      className="flex-1 px-3 py-2 rounded-lg text-sm bg-white/5 border text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                      style={{ borderColor: 'rgba(0,212,255,0.2)' }}
                    />
                    <button onClick={sendMessage} disabled={loading || !input.trim()}
                      className="px-3 py-2 rounded-lg text-sm transition-all disabled:opacity-40"
                      style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}>
                      →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
