import React from 'react';
import { X, CheckCircle2, Sparkles, Video, Flame, ShieldCheck, Zap } from 'lucide-react';

interface FreeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRepurposing: () => void;
}

export const FreeInfoModal: React.FC<FreeInfoModalProps> = ({
  isOpen,
  onClose,
  onStartRepurposing,
}) => {
  if (!isOpen) return null;

  const features = [
    {
      title: 'Unlimited AI Video Repurposing',
      desc: 'No minute caps, no credit limits, and no countdown timers. Repurpose as many podcasts, keynotes, and stream recordings as you want.',
    },
    {
      title: 'Watermark-Free 1080p & 4K Exports',
      desc: 'Export high-definition 60 FPS videos with zero forced watermarks. Keep 100% of your ad revenue and commercial rights.',
    },
    {
      title: 'All Viral Caption Styles Included',
      desc: 'Instant access to Alex Hormozi bold yellow/green presets, MrBeast animated comic bounce, Cyber Neon, and Minimalist Luxury subtitles.',
    },
    {
      title: 'Active Speaker 9:16 Face Tracking',
      desc: 'Smart computer vision tracks faces and centers speakers automatically, plus stacked 2-speaker podcast split-screen format.',
    },
    {
      title: 'Gemini-Powered AI Hooks & Social Repurposing',
      desc: 'Generate 5 high-converting psychological hooks, YouTube descriptions, TikTok hashtags, and LinkedIn posts with zero subscription.',
    },
    {
      title: 'Zero Sign-Up Paywalls & No Credit Card',
      desc: 'No credit card input, no trial expiration countdown, and no sneaky upgrade popups. Truly 100% free forever.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <span>Free Forever Guarantee</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">100% Free Video Repurposing</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
          We believe every creator, podcaster, educator, and entrepreneur should have access to world-class short-form video AI without being nickel-and-dimed by expensive monthly subscriptions.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white mb-1">{feat.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero hidden costs · Free forever</span>
          </span>
          <button
            onClick={() => {
              onClose();
              onStartRepurposing();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all active:scale-[0.98]"
          >
            Start Repurposing Free
          </button>
        </div>
      </div>
    </div>
  );
};
