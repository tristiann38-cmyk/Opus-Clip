import React, { useState } from 'react';
import { Flame, Sparkles, TrendingUp, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

interface ViralityExplainerViewProps {
  onBackToDashboard: () => void;
}

export const ViralityExplainerView: React.FC<ViralityExplainerViewProps> = ({
  onBackToDashboard,
}) => {
  const [testHook, setTestHook] = useState('If you touch your phone in the first 15 minutes of waking up, you lose.');
  const [calculatedScore, setCalculatedScore] = useState<number | null>(98);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleTestHook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testHook.trim()) return;

    setIsCalculating(true);
    setTimeout(() => {
      // Intelligent score heuristic based on hook words
      const words = testHook.toLowerCase();
      let score = 84;
      if (words.includes('never') || words.includes('stop') || words.includes('secret') || words.includes('if you')) score += 7;
      if (words.includes('dopamine') || words.includes('money') || words.includes('brain') || words.includes('mistake')) score += 5;
      if (words.length > 20 && words.length < 90) score += 3;
      setCalculatedScore(Math.min(99, score));
      setIsCalculating(false);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
          <Flame className="w-3.5 h-3.5 fill-rose-400" />
          <span>OpusClip Proprietary Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          How AI Virality Score™ Predicts Viral Hits
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Trained on over 100,000,000 viral shorts across TikTok, YouTube Shorts, and Instagram Reels, our multimodal AI evaluates every frame and soundbite for retention.
        </p>
      </div>

      {/* 4 Pillars of Virality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 fill-rose-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">01. 3-Second Hook Retention</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The first 3 seconds dictate 85% of short-form algorithm distribution. We scan speech for shock statements, cognitive curiosity gaps, contrarian theses, and immediate stakes.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">02. Pacing Rhythm & Silence Trimming</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dead pauses longer than 0.3s trigger instant viewer drop-off. OpusClip auto-trims filler breaths, hesitations, and optimizes cadence to match modern attention spans.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">03. Emotional & Comment Provocation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Algorithms reward videos that incite viewer debates. We measure controversy index, emotional surprise, and bookmark shareability to maximize organic reach.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">04. Visual Centering & Face Tracking</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our active-speaker computer vision continuously keeps faces centered in 9:16 vertical crop, eliminating awkward camera cuts and preserving high-fidelity intimacy.
          </p>
        </div>
      </div>

      {/* Interactive Virality Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-2">Test Any Opening Hook</h3>
        <p className="text-xs text-slate-400 mb-5">
          Type a 1-sentence video opening line to predict its retention score with our AI evaluator.
        </p>

        <form onSubmit={handleTestHook} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={testHook}
            onChange={(e) => setTestHook(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
            placeholder="Type your opening sentence..."
          />
          <button
            type="submit"
            disabled={isCalculating}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {isCalculating ? 'Evaluating...' : 'Score Hook'}
          </button>
        </form>

        {calculatedScore !== null && (
          <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono block">Estimated Virality Score</span>
              <p className="text-white font-bold text-sm">
                {calculatedScore >= 90 ? '🔥 Viral Blockbuster Potential' : 'Solid Performance Hook'}
              </p>
            </div>
            <div className="text-3xl font-black font-mono text-rose-400 tabular-nums">
              {calculatedScore}/100
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors inline-flex items-center gap-2"
        >
          <span>Return to Studio Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
