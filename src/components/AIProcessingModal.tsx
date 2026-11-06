import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, ArrowRight, Video, Mic, UserCheck, TrendingUp, Zap } from 'lucide-react';

interface AIProcessingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  videoTitle?: string;
}

export const AIProcessingModal: React.FC<AIProcessingModalProps> = ({
  isOpen,
  onComplete,
  videoTitle = 'Long-Form Video Input',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(12);

  const steps = [
    {
      title: 'Downloading & Audio Extraction',
      desc: 'Demuxing high-fidelity stereo audio stream at 320kbps',
      icon: Video,
    },
    {
      title: 'Speech-to-Text & Word Alignment',
      desc: 'Transcribing 100% of speech with millisecond word timestamps',
      icon: Mic,
    },
    {
      title: 'Active Speaker Face Tracking',
      desc: 'AI visual segmentation & 9:16 vertical reframe centering',
      icon: UserCheck,
    },
    {
      title: 'Finding Viral Hooks & Virality Score™',
      desc: 'Scanning dopamine triggers, pacing rhythm, and emotional spikes',
      icon: TrendingUp,
    },
    {
      title: 'Generating Dynamic Animated Captions',
      desc: 'Applying Hormozi bold presets, auto-emojis, and sound cues',
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(12);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 6;
        if (next > 25 && currentStep < 1) setCurrentStep(1);
        if (next > 50 && currentStep < 2) setCurrentStep(2);
        if (next > 75 && currentStep < 3) setCurrentStep(3);
        if (next > 90 && currentStep < 4) setCurrentStep(4);

        return Math.min(next, 100);
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen, currentStep, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-rose-950/40 relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-500" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">OpusClip AI Processing</h3>
              <p className="text-xs text-slate-400 truncate max-w-[280px]">{videoTitle}</p>
            </div>
          </div>
          <span className="font-mono text-lg font-bold text-rose-400 tabular-nums">
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mb-6 border border-slate-800/80">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Pipeline Step List */}
        <div className="space-y-3.5 mb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStep > idx || progress === 100;
            const isCurrent = currentStep === idx && progress < 100;

            return (
              <div 
                key={idx}
                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                  isCurrent 
                    ? 'bg-slate-800/80 border border-rose-500/30' 
                    : isCompleted 
                    ? 'bg-slate-950/40 opacity-80' 
                    : 'opacity-30'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fast-Track CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-400">
            Powered by Whisper & Gemini Multimodal
          </span>
          <button
            onClick={onComplete}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <span>Skip to Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
