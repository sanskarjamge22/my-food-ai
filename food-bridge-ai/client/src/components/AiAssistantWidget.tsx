import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistantWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [safetyNotice, setSafetyNotice] = useState<string>(
    '⚠️ Food Bridge AI Safety Standard: Never donate spoiled food. Cooked food must be kept outside the danger zone (5°C–60°C).'
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello ${user ? user.name.split(' ')[0] : 'friend'}! 🌿 I am your **Food Bridge AI Assistant**.
      
I can assist you with:
- 🛡️ **Food Safety & Temperature Standards**
- 📦 **Packaging & Allergen Rules**
- ⚡ **AI Smart Matching Engine calculations**
- ✍️ **Drafting attractive surplus donation descriptions**

Ask me anything or tap one of the suggested prompts below!`,
    },
  ]);

  const [suggestions, setSuggestions] = useState<string[]>([
    'Food safety & temperature danger zone',
    'How do I list surplus cooked meals?',
    'How does the AI matching score work?',
    'Generate description for 30 Veg Biryani boxes',
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.sendAiAssistantMessage(newMessages, {
        role: user?.role,
        name: user?.name,
      });

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: response.reply,
        },
      ]);

      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }

      if (response.safetyNotice) {
        setSafetyNotice(response.safetyNotice);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue processing your request. Please try asking again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-forest-800 text-white shadow-xl shadow-forest-900/30 hover:bg-forest-900 hover:scale-105 transition-all group"
          aria-label="Open AI Food Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-400 text-forest-900 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-wide">AI Food Rescue Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      )}

      {/* Slide-over / Modal Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-200 ${
            isExpanded ? 'w-[90vw] md:w-[650px] h-[85vh]' : 'w-[92vw] sm:w-[420px] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="bg-forest-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs tracking-wide">FOOD BRIDGE AI AGENT</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.2 rounded border border-emerald-400/20">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">Food Safety & Redistribution Advisor</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-forest-800 transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-forest-800 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Safety Notice Warning Banner */}
          <div className="bg-amber-50 px-3.5 py-2 border-b border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span className="leading-tight">{safetyNotice}</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-forest-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-forest-700" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-forest-800 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.content}
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5 text-emerald-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>AI Agent is analyzing food rescue database...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 flex-nowrap scrollbar-none">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-forest-800 text-[11px] font-medium text-slate-600 border border-slate-200/60 transition-colors flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3 text-amber-500" />
                <span>{s}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about storage, urgency, safety, or listing advice..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-forest-800"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-forest-800 text-white hover:bg-forest-900 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
