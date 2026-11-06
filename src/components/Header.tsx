import React from 'react';
import { Sparkles, Video, Film, Zap, Crown } from 'lucide-react';

interface HeaderProps {
  onNewProject: () => void;
  activeView: 'dashboard' | 'studio' | 'templates' | 'virality' | 'free-info';
  setActiveView: (view: 'dashboard' | 'studio' | 'templates' | 'virality' | 'free-info') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewProject,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B0E14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-95 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tracking-tight text-white">OpusClip</span>
            <span className="text-xs font-semibold text-rose-400 font-mono">AI</span>
          </div>
        </button>

        {/* Zone 2: 4-5 Clean Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeView === 'dashboard' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            My Projects
          </button>
          <button
            onClick={() => setActiveView('virality')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5 ${
              activeView === 'virality' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            <span>AI Virality Score™</span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">99.2%</span>
          </button>
          <button
            onClick={() => setActiveView('templates')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeView === 'templates' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            Caption Styles
          </button>
          <button
            onClick={() => setActiveView('free-info' as any)}
            className="whitespace-nowrap text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Quick Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Free Forever</span>
            <span className="text-emerald-400/70">· Unlimited AI</span>
          </div>

          <button
            onClick={onNewProject}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-indigo-600 rounded-lg hover:from-rose-500 hover:to-indigo-500 transition-all shadow-md shadow-rose-900/30 whitespace-nowrap active:scale-[0.98]"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Repurpose Video</span>
          </button>
        </div>
      </div>
    </header>
  );
};
