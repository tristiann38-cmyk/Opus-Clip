import React from 'react';
import { Play, Sparkles, TrendingUp, Clock, Scissors, Download, Share2, Flame } from 'lucide-react';
import { VideoClip } from '../types';

interface ClipCardProps {
  clip: VideoClip;
  onEdit: (clip: VideoClip) => void;
  onPreview: (clip: VideoClip) => void;
  onQuickExport: (clip: VideoClip) => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({
  clip,
  onEdit,
  onPreview,
  onQuickExport,
}) => {
  const isUltraViral = clip.virality.overall >= 95;

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/50 flex flex-col">
      {/* Top Preview Media Area */}
      <div className="relative aspect-[9/12] w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onEdit(clip)}>
        {/* Thumbnail Background */}
        <img
          src={clip.thumbnail}
          alt={clip.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Virality Score Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md font-mono text-xs font-bold border ${
            isUltraViral
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-950/50'
              : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
          }`}>
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="tabular-nums">{clip.virality.overall}</span>
            <span className="text-[10px] font-normal opacity-80">VIRAL SCORE</span>
          </div>

          {/* Duration Badge */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-mono text-slate-300">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="tabular-nums">{clip.duration}s</span>
          </div>
        </div>

        {/* Center Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
          <div className="w-13 h-13 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl shadow-rose-900/60 transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Simulated Dynamic Karaoke Caption Preview on bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-xl p-2.5 shadow-xl">
            <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Hook Quote
            </p>
            <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
              &ldquo;{clip.hookQuote}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clip Headline */}
          <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-rose-400 transition-colors">
            {clip.title}
          </h3>

          {/* AI Retention Rationale */}
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {clip.virality.explanation}
          </p>

          {/* Metric Indicators */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
            <div>
              <span className="text-slate-500 block">Hook Retention</span>
              <span className="text-white font-mono font-bold tabular-nums">
                {clip.virality.hookStrength}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Engagement Lift</span>
              <span className="text-emerald-400 font-mono font-bold tabular-nums">
                +{clip.virality.engagementScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => onEdit(clip)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors active:scale-[0.98]"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Edit in Studio</span>
          </button>

          <button
            onClick={() => onQuickExport(clip)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Export 1080p MP4"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
