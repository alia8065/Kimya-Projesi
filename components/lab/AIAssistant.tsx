"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, X, MessageSquare } from "lucide-react";
import { useLabStore } from "@/store/labStore";

interface AIAssistantProps {
  context?: Record<string, unknown>;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function AIAssistant({ context, className = "", isOpen = true, onToggle }: AIAssistantProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chatHistory, addMessage, incrementAIQuestions, addXP } = useLabStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput("");
    addMessage({ role: "user", content: msg });
    incrementAIQuestions();
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          context,
          history: chatHistory.slice(-6),
        }),
      });

      const data = await res.json();
      addMessage({ role: "assistant", content: data.response || "I couldn't process that. Please try again." });
      addXP(5);
    } catch {
      addMessage({ role: "assistant", content: "Connection error. Please check your network and try again." });
    } finally {
      setLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    "What happened in this reaction?",
    "Why did the color change?",
    "What is the oxidation state?",
    "How do I balance this equation?",
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 transition-transform hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div className={`flex flex-col rounded-xl overflow-hidden ${className}`}
      style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.25)', backdropFilter: 'blur(16px)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-500/20"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">ChemBot AI</div>
            <div className="text-xs text-indigo-400">Chemistry Tutor</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-glow" />
          <span className="text-xs text-emerald-400">Online</span>
          {onToggle && (
            <button onClick={onToggle} className="ml-2 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '150px' }}>
        {chatHistory.length === 0 ? (
          <div className="text-center py-6">
            <Bot className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Ask me anything about chemistry!</p>
            <div className="mt-4 space-y-2">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 transition-all"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user'
                ? 'bg-indigo-600'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}>
                {msg.role === 'user'
                  ? <User className="w-3.5 h-3.5 text-white" />
                  : <Bot className="w-3.5 h-3.5 text-white" />
                }
              </div>
              <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${msg.role === 'user'
                ? 'text-white'
                : 'text-slate-200'
                }`}
                style={msg.role === 'user'
                  ? { background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.3)' }
                  : { background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.15)' }
                }
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-indigo-500/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about chemistry..."
            className="flex-1 px-3 py-2 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
