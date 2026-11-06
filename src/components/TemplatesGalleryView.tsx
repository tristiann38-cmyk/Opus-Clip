import React, { useState, useEffect } from 'react';
import { Type as TypeIcon, Sparkles, Check, ArrowRight, Play } from 'lucide-react';
import { CaptionStyle } from '../types';

interface TemplatesGalleryViewProps {
  onSelectStyle: (style: CaptionStyle) => void;
  onBackToDashboard: () => void;
}

export const TemplatesGalleryView: React.FC<TemplatesGalleryViewProps> = ({
  onSelectStyle,
  onBackToDashboard,
}) => {
  const [activeWordIdx, setActiveWordIdx] = useState(0);

  // Animate sample words loop for live karaoke preview
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWordIdx((prev) => (prev + 1) % 4);
    }, 450);
    return () => clearInterval(timer);
  }, []);

  const templates = [
    {
      id: 'hormozi' as CaptionStyle,
      creator: 'Alex Hormozi Style',
      badge: '#1 Most Viral',
      description: 'Bold uppercase font, yellow keyword highlight, green second accent, and thick black stroke for maximum contrast.',
      sampleWords: ['MOST', 'PEOPLE', 'QUIT', 'TODAY'],
      render: (words: string[]) => (
        <div className="bg-black/90 p-4 rounded-xl border border-yellow-500/30 text-center font-black uppercase text-2xl tracking-wider text-stroke-sm font-stroke-shadow">
          {words.map((w, i) => (
            <span
              key={i}
              className={`inline-block mx-1.5 transition-all ${
                i === activeWordIdx ? 'text-[#FFE600] scale-110 drop-shadow-[0_2px_10px_rgba(255,230,0,0.8)]' : i === 2 ? 'text-[#38EF7D]' : 'text-white'
              }`}
            >
              {w} {i === activeWordIdx && '⚡'}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'mrbeast' as CaptionStyle,
      creator: 'MrBeast Viral Pop',
      badge: 'High Energy',
      description: 'Energetic bouncy pop with kinetic zoom animations and auto-injected situational emojis on action words.',
      sampleWords: ['I', 'GAVE', 'AWAY', 'A ROLEX'],
      render: (words: string[]) => (
        <div className="bg-black/80 p-4 rounded-xl border border-amber-500/40 text-center font-extrabold uppercase text-2xl text-stroke-sm">
          {words.map((w, i) => (
            <span
              key={i}
              className={`inline-block mx-1.5 animate-caption-bounce ${
                i === activeWordIdx ? 'text-amber-300 scale-120 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]' : 'text-white'
              }`}
            >
              {w} {i === 3 && '💰'}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'neon' as CaptionStyle,
      creator: 'Cyber Neon Glow',
      badge: 'Tech & Gaming',
      description: 'Electric cyan and neon magenta glowing aura designed for dark backgrounds and futuristic soundbites.',
      sampleWords: ['ARTIFICIAL', 'INTELLIGENCE', 'TAKES', 'OVER'],
      render: (words: string[]) => (
        <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-center font-mono font-bold text-xl">
          {words.map((w, i) => (
            <span
              key={i}
              className={`inline-block mx-1.5 transition-colors ${
                i === activeWordIdx ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]' : 'text-pink-400'
              }`}
            >
              {w}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'minimal' as CaptionStyle,
      creator: 'Minimalist Clean',
      badge: 'Executive & Podcast',
      description: 'Sophisticated typography on a soft translucent backdrop. Clean, professional, and elegant.',
      sampleWords: ['Mastery', 'requires', 'unforgiving', 'discipline'],
      render: (words: string[]) => (
        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 text-center font-medium text-base text-white">
          {words.map((w, i) => (
            <span
              key={i}
              className={`inline-block mx-1 ${
                i === activeWordIdx ? 'text-rose-400 font-bold underline' : 'text-slate-300'
              }`}
            >
              {w}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'pop' as CaptionStyle,
      creator: 'Karaoke Pop Highlight',
      badge: 'TikTok Trendy',
      description: 'Smooth animated pill fill following speaker velocity. Perfect for fast-paced talk and comedy.',
      sampleWords: ['DON’T', 'LOOK', 'BACK', 'NOW'],
      render: (words: string[]) => (
        <div className="bg-purple-950/80 p-4 rounded-xl border border-purple-500/30 text-center font-bold text-xl uppercase">
          {words.map((w, i) => (
            <span
              key={i}
              className={`inline-block mx-1 px-1.5 py-0.5 rounded transition-all ${
                i === activeWordIdx ? 'bg-amber-400 text-slate-950 font-black scale-105' : 'text-white'
              }`}
            >
              {w}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
          <TypeIcon className="w-3.5 h-3.5" />
          <span>Dynamic Caption Styles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Viral Subtitle Presets That Hook Viewers
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Over 75% of short-form videos are watched on mute. OpusClip dynamic animated captions ensure viewers never scroll past your clips.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">{tpl.creator}</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  {tpl.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                {tpl.description}
              </p>

              {/* Live Preview Box */}
              <div className="mb-6 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                {tpl.render(tpl.sampleWords)}
              </div>
            </div>

            <button
              onClick={() => onSelectStyle(tpl.id)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>Apply to Current Video</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors inline-flex items-center gap-2"
        >
          <span>Return to Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
