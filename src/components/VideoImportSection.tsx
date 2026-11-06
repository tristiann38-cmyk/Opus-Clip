import React, { useState } from 'react';
import { 
  Link as LinkIcon, 
  Upload, 
  Sparkles, 
  SlidersHorizontal, 
  Check, 
  Youtube, 
  Play, 
  Clock, 
  Languages, 
  Layers, 
  Smile, 
  Type as TypeIcon,
  HelpCircle,
  FileVideo
} from 'lucide-react';
import { ClippingPreferences, CaptionStyle, AspectRatio } from '../types';

interface VideoImportSectionProps {
  onStartProcessing: (videoUrl: string, preferences: ClippingPreferences, customFile?: File) => void;
  onSelectSample: (projectId: string) => void;
}

export const VideoImportSection: React.FC<VideoImportSectionProps> = ({
  onStartProcessing,
  onSelectSample,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [preferences, setPreferences] = useState<ClippingPreferences>({
    clipLength: 'auto',
    topicPrompt: '',
    language: 'English (Auto-detect)',
    captionPreset: 'hormozi',
    autoReframe: '9:16',
    splitScreen: true,
    autoEmojis: true,
    highlightKeywords: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() && !uploadedFile) {
      // Default to the neuroscience podcast if nothing typed
      onSelectSample('proj_neuroscience');
      return;
    }
    onStartProcessing(urlInput, preferences, uploadedFile || undefined);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUrlInput(`local://${file.name}`);
    }
  };

  return (
    <div className="w-full relative overflow-hidden pt-8 pb-12 px-6">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-rose-600/15 via-indigo-600/15 to-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Editorial Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free Forever</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300">Unlimited AI Credits</span>
          <span className="text-slate-500">·</span>
          <span className="text-emerald-300 font-medium">No Watermark & No Card Needed</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 text-balance">
          1 long video into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">10 viral clips</span>.
          <br className="hidden sm:inline" />
          {' '}100% Free to Use.
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-9 text-balance">
          Enjoy unlimited AI video clipping with zero subscription fees. Automatically detect viral hooks, auto-reframe to 9:16, add dynamic Alex Hormozi captions, and export in 4K 60fps with full commercial rights.
        </p>

        {/* Main Input Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/80 backdrop-blur-xl mb-6 text-left">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative flex items-center">
              <div className="absolute left-4 text-slate-400 pointer-events-none">
                <Youtube className="w-5 h-5 text-rose-500" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Drop a YouTube, Vimeo, Zoom, Rumble, or Google Drive link..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-300 text-xs font-medium transition-colors whitespace-nowrap">
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Upload Video</span>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowPreferences(!showPreferences)}
                className={`p-3.5 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  showPreferences 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                }`}
                title="AI Clipping Settings"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden md:inline">Options</span>
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-rose-900/40 active:scale-[0.98] whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Free Viral Clips</span>
              </button>
            </div>
          </form>

          {/* Uploaded File Pill Indicator */}
          {uploadedFile && (
            <div className="mt-2.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-between text-xs text-rose-300">
              <div className="flex items-center gap-2 truncate">
                <FileVideo className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Selected File: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(1)} MB)</span>
              </div>
              <button 
                onClick={() => { setUploadedFile(null); setUrlInput(''); }} 
                className="text-slate-400 hover:text-white ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Preferences Dropdown Panel */}
          {showPreferences && (
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Length Preference */}
              <div>
                <label className="block text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Clip Duration
                </label>
                <select
                  value={preferences.clipLength}
                  onChange={(e) => setPreferences({ ...preferences, clipLength: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="auto">Auto (Smart AI selection)</option>
                  <option value="short">&lt; 30s (Ultra-short / TikTok)</option>
                  <option value="standard">30s - 60s (Shorts standard)</option>
                  <option value="long">60s - 90s (In-depth Reels)</option>
                </select>
              </div>

              {/* Caption Style */}
              <div>
                <label className="block text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                  <TypeIcon className="w-3.5 h-3.5 text-slate-400" />
                  Caption Style
                </label>
                <select
                  value={preferences.captionPreset}
                  onChange={(e) => setPreferences({ ...preferences, captionPreset: e.target.value as CaptionStyle })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="hormozi">Alex Hormozi (Bold Yellow/Green)</option>
                  <option value="mrbeast">MrBeast (Animated Pop + Emojis)</option>
                  <option value="neon">Cyber Neon (Cyan Glow)</option>
                  <option value="minimal">Minimalist Luxury (Clean White)</option>
                  <option value="pop">Karaoke Pop (Smooth fill)</option>
                </select>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Auto-Reframe
                </label>
                <select
                  value={preferences.autoReframe}
                  onChange={(e) => setPreferences({ ...preferences, autoReframe: e.target.value as AspectRatio })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="9:16">9:16 Vertical (Shorts/TikTok/Reels)</option>
                  <option value="1:1">1:1 Square (Feed/Instagram)</option>
                  <option value="16:9">16:9 Landscape (YouTube)</option>
                </select>
              </div>

              {/* Topic Prompt */}
              <div>
                <label className="block text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-slate-400" />
                  Smart Features
                </label>
                <div className="flex flex-col gap-1.5 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={preferences.autoEmojis}
                      onChange={(e) => setPreferences({ ...preferences, autoEmojis: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-rose-500 focus:ring-0"
                    />
                    <span>Auto Emojis & Word Highlights</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={preferences.splitScreen}
                      onChange={(e) => setPreferences({ ...preferences, splitScreen: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-rose-500 focus:ring-0"
                    />
                    <span>2-Speaker Podcast Split Screen</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Test Samples (1-Click Tryout for Instant Delight) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-slate-400">
          <span className="font-medium text-slate-500 uppercase tracking-wider text-[11px]">Or test with sample video:</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => onSelectSample('proj_neuroscience')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center gap-1.5 text-slate-300"
            >
              <span>🧠 Dr. Huberman Sleep Protocol</span>
            </button>
            <button
              onClick={() => onSelectSample('proj_tech_founder')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center gap-1.5 text-slate-300"
            >
              <span>🤖 AI Lab Future Keynote</span>
            </button>
            <button
              onClick={() => onSelectSample('proj_creator_gear')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center gap-1.5 text-slate-300"
            >
              <span>📸 Creator Studio Truth</span>
            </button>
            <button
              onClick={() => onSelectSample('proj_finance_masterclass')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center gap-1.5 text-slate-300"
            >
              <span>💰 $10M SaaS Pricing Masterclass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
