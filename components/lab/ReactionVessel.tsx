"use client";

import { useState, useEffect } from "react";
import { FlaskConical, Thermometer, Droplets, Wind, AlertTriangle } from "lucide-react";
import { ReactionResult } from "@/store/labStore";

interface ReactionVesselProps {
  reaction: ReactionResult | null;
  chemicals: string[];
  isRunning?: boolean;
  totalMmol?: number;
}

const COLOR_MAP: Record<string, string> = {
  'colorless': 'rgba(200,220,255,0.15)',
  'blue': 'rgba(59,130,246,0.5)',
  'deep blue': 'rgba(29,78,216,0.6)',
  'purple': 'rgba(147,51,234,0.5)',
  'violet': 'rgba(139,92,246,0.5)',
  'green': 'rgba(16,185,129,0.4)',
  'yellow': 'rgba(234,179,8,0.4)',
  'orange': 'rgba(249,115,22,0.4)',
  'red': 'rgba(239,68,68,0.4)',
  'brown': 'rgba(120,53,15,0.5)',
  'black': 'rgba(17,24,39,0.8)',
  'white': 'rgba(255,255,255,0.2)',
  'pale blue': 'rgba(147,197,253,0.3)',
};

export default function ReactionVessel({ reaction, chemicals, isRunning = false, totalMmol }: ReactionVesselProps) {
  const [bubbles, setBubbles] = useState<{ id: number; left: string; delay: string }[]>([]);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (reaction?.gasProduced) {
      const newBubbles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${15 + Math.random() * 70}%`,
        delay: `${Math.random() * 1.5}s`,
      }));
      setBubbles(newBubbles);
      const timer = setTimeout(() => setBubbles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [reaction]);

  useEffect(() => {
    if (reaction) {
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [reaction]);

  const liquidColor = reaction?.colorChange
    ? COLOR_MAP[reaction.colorChange.toLowerCase()] || 'rgba(200,220,255,0.4)'
    : chemicals.length > 0
      ? 'rgba(147,197,253,0.35)'
      : 'rgba(100,150,255,0.05)';

  // Flask fill level: y position of liquid surface
  // Maps 0–50 mmol to the full flask height range (108=empty bottom, 51=near full)
  const mmol = totalMmol ?? (chemicals.length > 0 ? 2.5 : 0);
  const fillY = chemicals.length > 0
    ? Math.max(51, Math.round(108 - (Math.min(mmol, 50) / 50) * 57))
    : 110;

  return (
    <div className="relative flex flex-col items-center">
      {/* Flask SVG */}
      <div className="relative w-48 h-56">
        {/* Flask shape */}
        <svg viewBox="0 0 100 120" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.3))' }}>
          {/* Flask body */}
          <path
            d="M35 10 L35 50 L10 100 Q10 110 20 110 L80 110 Q90 110 90 100 L65 50 L65 10 Z"
            fill="rgba(99,102,241,0.05)"
            stroke="rgba(99,102,241,0.4)"
            strokeWidth="2"
          />
          {/* Flask neck */}
          <rect x="30" y="5" width="40" height="10" rx="3"
            fill="rgba(99,102,241,0.05)"
            stroke="rgba(99,102,241,0.4)"
            strokeWidth="2"
          />

          {/* Liquid fill */}
          {chemicals.length > 0 && (
            <clipPath id="flask-clip">
              <path d="M36 10 L36 50 L12 100 Q12 108 20 108 L80 108 Q88 108 88 100 L64 50 L64 10 Z" />
            </clipPath>
          )}
          {chemicals.length > 0 && (
            <rect
              x="0" y={fillY} width="100" height={120 - fillY}
              fill={liquidColor}
              clipPath="url(#flask-clip)"
              style={{ transition: 'fill 1s ease, y 0.5s ease' }}
            />
          )}

          {/* Liquid surface */}
          {chemicals.length > 0 && (
            <ellipse
              cx="50" cy={fillY} rx="23" ry="4"
              fill={liquidColor}
              clipPath="url(#flask-clip)"
              style={{ transition: 'cy 0.5s ease' }}
            />
          )}

          {/* Bubbles */}
          {bubbles.map((bubble) => (
            <circle
              key={bubble.id}
              cx={bubble.left.replace('%', '')}
              cy="90"
              r="2"
              fill="rgba(255,255,255,0.4)"
              className="bubble"
              style={{ animationDelay: bubble.delay }}
            />
          ))}

          {/* Precipitate */}
          {reaction?.precipitate && (
            <rect
              x="15" y="100" width="70" height="8"
              rx="2"
              fill="rgba(255,255,255,0.3)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1"
            />
          )}
        </svg>

        {/* Flash effect */}
        {showFlash && (
          <div
            className="absolute inset-0 rounded-full opacity-50"
            style={{
              background: reaction?.isExothermic
                ? 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
              animation: 'pulse-glow 0.5s ease-in-out'
            }}
          />
        )}

        {/* Gas rising */}
        {reaction?.gasProduced && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-slate-400 animate-bounce">
            💨 {reaction.gasProduced}↑
          </div>
        )}
      </div>

      {/* Reaction indicators */}
      {reaction && (
        <div className="mt-4 w-full max-w-48 space-y-2">
          {reaction.isExothermic && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <Thermometer className="w-3 h-3 text-red-400" />
              <span className="text-red-300">Exothermique - Chaleur libérée</span>
            </div>
          )}
          {reaction.precipitate && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'rgba(248,250,252,0.05)', border: '1px solid rgba(248,250,252,0.2)' }}>
              <Droplets className="w-3 h-3 text-slate-300" />
              <span className="text-slate-300">Précipité : {reaction.precipitate}</span>
            </div>
          )}
          {reaction.gasProduced && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
              <Wind className="w-3 h-3 text-blue-400" />
              <span className="text-blue-300">Gaz : {reaction.gasProduced}↑</span>
            </div>
          )}
          {reaction.pHChange !== null && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <span className="text-indigo-300">pH: {reaction.pHChange}</span>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {chemicals.length === 0 && !isRunning && (
        <div className="mt-4 text-center">
          <FlaskConical className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-600 text-xs">Ajoutez des produits chimiques pour commencer</p>
        </div>
      )}

      {/* Warning for hazardous */}
      {chemicals.length >= 2 && !reaction && (
        <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
          <AlertTriangle className="w-3 h-3" />
          <span>Cliquez sur &apos;Lancer la réaction&apos; pour simuler</span>
        </div>
      )}
    </div>
  );
}
