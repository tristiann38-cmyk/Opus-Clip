import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Scissors, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Sliders, 
  Type as TypeIcon, 
  Layers, 
  Smile, 
  TrendingUp, 
  Share2, 
  FileText, 
  Maximize2,
  Trash2,
  Zap,
  Flame,
  ArrowLeft,
  Wand2,
  Send
} from 'lucide-react';
import { VideoClip, AspectRatio, LayoutMode, CaptionStyle, TranscriptWord } from '../types';

interface StudioEditorProps {
  clip: VideoClip;
  onBack: () => void;
  onSaveClip: (updatedClip: VideoClip) => void;
  onOpenExport: (clip: VideoClip) => void;
}

export const StudioEditor: React.FC<StudioEditorProps> = ({
  clip: initialClip,
  onBack,
  onSaveClip,
  onOpenExport,
}) => {
  const [clip, setClip] = useState<VideoClip>(initialClip);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'virality' | 'repurpose' | 'styles'>('transcript');
  
  // Customization state
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(clip.aspectRatio || '9:16');
  const [layout, setLayout] = useState<LayoutMode>(clip.layout || 'single');
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>(clip.captionStyle || 'hormozi');
  const [captionSize, setCaptionSize] = useState<'small' | 'medium' | 'large'>('large');
  const [autoEmojis, setAutoEmojis] = useState(true);
  const [isUppercase, setIsUppercase] = useState(true);

  // AI Generation states
  const [alternateHooks, setAlternateHooks] = useState<Array<{ type: string; hookText: string; expectedRetentionLift: string }>>([]);
  const [isLoadingHooks, setIsLoadingHooks] = useState(false);
  const [repurposeData, setRepurposeData] = useState<any>(null);
  const [isLoadingRepurpose, setIsLoadingRepurpose] = useState(false);
  const [coPilotPrompt, setCoPilotPrompt] = useState('');
  const [coPilotSuccessMsg, setCoPilotSuccessMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Playback timer ref
  const playbackRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(Date.now());

  // Web Audio simulated speaker tone / rhythm
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setClip(initialClip);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [initialClip]);

  // Handle Playback Loop
  useEffect(() => {
    if (isPlaying) {
      lastTimestampRef.current = Date.now();
      const tick = () => {
        const now = Date.now();
        const delta = (now - lastTimestampRef.current) / 1000;
        lastTimestampRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= clip.duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
        playbackRef.current = requestAnimationFrame(tick);
      };
      playbackRef.current = requestAnimationFrame(tick);
    } else {
      if (playbackRef.current) {
        cancelAnimationFrame(playbackRef.current);
      }
    }

    return () => {
      if (playbackRef.current) {
        cancelAnimationFrame(playbackRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, clip.duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, clip.duration)));
  };

  const handleWordClick = (wordStart: number) => {
    handleSeek(wordStart);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleWordTextChange = (id: string, newText: string) => {
    setClip((prev) => ({
      ...prev,
      transcript: prev.transcript.map((w) => (w.id === id ? { ...w, word: newText } : w)),
    }));
  };

  const handleRemoveFillerWords = () => {
    const fillerWords = ['UM', 'UH', 'LIKE', 'YOU KNOW', 'SO', 'AH'];
    setClip((prev) => ({
      ...prev,
      transcript: prev.transcript.filter(
        (w) => !fillerWords.includes(w.word.toUpperCase().replace(/[^A-Z]/g, ''))
      ),
    }));
    setCoPilotSuccessMsg('Removed filler words automatically!');
    setTimeout(() => setCoPilotSuccessMsg(''), 3000);
  };

  // Find currently active words based on currentTime
  const currentWordIndex = clip.transcript.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end + 0.15
  );

  // Group active words into 3-word or 4-word karaoke subtitle window
  const activeWord = currentWordIndex >= 0 ? clip.transcript[currentWordIndex] : null;
  const startIndex = Math.max(0, currentWordIndex - 1);
  const displayWindow = clip.transcript.slice(
    currentWordIndex >= 0 ? startIndex : 0, 
    currentWordIndex >= 0 ? startIndex + 3 : 3
  );

  // Load alternate hooks from server API or generator
  const handleGenerateHooks = async () => {
    setIsLoadingHooks(true);
    try {
      const res = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clipTitle: clip.title,
          transcriptText: clip.hookQuote,
        }),
      });
      const data = await res.json();
      if (data.hooks) {
        setAlternateHooks(data.hooks);
      }
    } catch (err) {
      console.error('Error generating hooks:', err);
    } finally {
      setIsLoadingHooks(false);
    }
  };

  // Load social repurposing data
  const handleLoadRepurpose = async () => {
    if (repurposeData) return;
    setIsLoadingRepurpose(true);
    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: clip.title,
          transcript: clip.transcript.map((w) => w.word).join(' '),
        }),
      });
      const data = await res.json();
      if (data.repurpose) {
        setRepurposeData(data.repurpose);
      }
    } catch (err) {
      console.error('Error generating repurpose copy:', err);
    } finally {
      setIsLoadingRepurpose(false);
    }
  };

  const handleApplyHook = (hookText: string) => {
    setClip((prev) => ({
      ...prev,
      hookQuote: hookText,
      title: hookText.length > 45 ? `${hookText.slice(0, 45)}...` : hookText,
    }));
    setCoPilotSuccessMsg('Hook updated!');
    setTimeout(() => setCoPilotSuccessMsg(''), 2500);
  };

  const handleCoPilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coPilotPrompt.trim()) return;

    const lower = coPilotPrompt.toLowerCase();
    if (lower.includes('hormozi') || lower.includes('yellow')) {
      setCaptionStyle('hormozi');
      setCoPilotSuccessMsg('Switched to Alex Hormozi bold yellow caption style!');
    } else if (lower.includes('mrbeast') || lower.includes('emoji')) {
      setCaptionStyle('mrbeast');
      setAutoEmojis(true);
      setCoPilotSuccessMsg('Applied MrBeast comic bouncing caption style with auto emojis!');
    } else if (lower.includes('split') || lower.includes('podcast')) {
      setLayout('split');
      setCoPilotSuccessMsg('Switched layout to 2-Speaker podcast split screen!');
    } else if (lower.includes('filler')) {
      handleRemoveFillerWords();
    } else {
      // General prompt enhancement
      setCoPilotSuccessMsg(`Applied AI adjustment: "${coPilotPrompt}"`);
    }
    setCoPilotPrompt('');
    setTimeout(() => setCoPilotSuccessMsg(''), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Keyboard shortcut for Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#07090E]">
      {/* Top Studio Bar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to All Clips"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-md">
              {clip.title}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="font-mono text-rose-400 font-semibold">{clip.virality.overall} Virality Score</span>
              <span>·</span>
              <span className="font-mono tabular-nums">{clip.duration}s duration</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSaveClip(clip)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => onOpenExport(clip)}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-rose-900/30 transition-all flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 1080p</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left / Center: Interactive Video Player Stage (Cols 1-7) */}
        <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col items-center justify-between bg-black/40 border-r border-slate-800/80 overflow-y-auto">
          {/* Quick Toolbar for Aspect Ratio and Layout */}
          <div className="w-full max-w-md flex items-center justify-between gap-2 mb-4 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
            {/* Aspect Ratio Switcher */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setAspectRatio('9:16')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  aspectRatio === '9:16' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                9:16 Shorts
              </button>
              <button
                onClick={() => setAspectRatio('1:1')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  aspectRatio === '1:1' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                1:1 Square
              </button>
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  aspectRatio === '16:9' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                16:9 Land
              </button>
            </div>

            {/* Layout Mode Switcher */}
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={() => setLayout('single')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  layout === 'single' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Single Face Focus"
              >
                1-Speaker
              </button>
              <button
                onClick={() => setLayout('split')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  layout === 'split' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="2-Speaker Podcast Split"
              >
                Split Screen
              </button>
            </div>
          </div>

          {/* Interactive Player Frame */}
          <div className="flex-1 flex items-center justify-center w-full my-auto">
            <div 
              className={`relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl shadow-black border border-slate-800 transition-all ${
                aspectRatio === '9:16'
                  ? 'w-[280px] sm:w-[320px] aspect-[9/16]'
                  : aspectRatio === '1:1'
                  ? 'w-[320px] sm:w-[380px] aspect-square'
                  : 'w-[480px] sm:w-[560px] aspect-video'
              }`}
            >
              {/* Media Content - Depending on Layout Mode */}
              {layout === 'split' ? (
                /* 2-Speaker Stacked Podcast Mode */
                <div className="w-full h-full flex flex-col">
                  {/* Top Half: Speaker 1 */}
                  <div className="relative flex-1 bg-slate-900 overflow-hidden border-b border-black/40">
                    <img
                      src={clip.thumbnail}
                      alt={clip.speaker1.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top filter brightness-95"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-slate-200">
                      {clip.speaker1.name}
                    </div>
                  </div>

                  {/* Bottom Half: Speaker 2 */}
                  <div className="relative flex-1 bg-slate-900 overflow-hidden">
                    <img
                      src={clip.thumbnail}
                      alt="Guest Speaker"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transform scale-x-[-1] filter brightness-90"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-slate-200">
                      {clip.speaker2?.name || 'Guest / Co-Host'}
                    </div>
                  </div>
                </div>
              ) : (
                /* Single Speaker Full View */
                <div className="relative w-full h-full">
                  <img
                    src={clip.thumbnail}
                    alt={clip.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}

              {/* Dynamic Live Karaoke Captions Overlay */}
              <div className="absolute inset-x-3 bottom-12 pointer-events-none flex flex-col items-center justify-center text-center">
                {captionStyle === 'hormozi' && (
                  <div className="bg-black/40 backdrop-blur-[2px] px-3 py-2 rounded-xl border border-black/40 max-w-[90%]">
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-black text-stroke-md uppercase tracking-wider font-stroke-shadow">
                      {displayWindow.map((item, idx) => {
                        const isCurrent = item.id === activeWord?.id;
                        return (
                          <span
                            key={item.id}
                            className={`inline-block transition-transform duration-100 ${
                              isCurrent 
                                ? 'text-[#FFE600] scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]' 
                                : item.highlighted 
                                ? 'text-[#38EF7D]' 
                                : 'text-white'
                            } ${captionSize === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl'}`}
                          >
                            {item.word} {autoEmojis && item.emoji ? item.emoji : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {captionStyle === 'mrbeast' && (
                  <div className="bg-black/60 px-4 py-2.5 rounded-2xl border-2 border-yellow-400/80 shadow-2xl max-w-[95%]">
                    <div className="flex flex-wrap items-center justify-center gap-2 font-extrabold uppercase text-stroke-sm font-stroke-shadow">
                      {displayWindow.map((item) => {
                        const isCurrent = item.id === activeWord?.id;
                        return (
                          <span
                            key={item.id}
                            className={`inline-block animate-caption-bounce ${
                              isCurrent 
                                ? 'text-amber-300 scale-120 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' 
                                : 'text-white'
                            } ${captionSize === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl'}`}
                          >
                            {item.word} {autoEmojis && item.emoji ? item.emoji : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {captionStyle === 'neon' && (
                  <div className="bg-slate-950/70 px-4 py-2 rounded-xl border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] max-w-[90%]">
                    <div className="flex flex-wrap items-center justify-center gap-2 font-bold font-mono tracking-tight">
                      {displayWindow.map((item) => {
                        const isCurrent = item.id === activeWord?.id;
                        return (
                          <span
                            key={item.id}
                            className={`inline-block ${
                              isCurrent 
                                ? 'text-cyan-300 scale-110 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]' 
                                : 'text-pink-400'
                            } ${captionSize === 'large' ? 'text-xl sm:text-2xl' : 'text-lg'}`}
                          >
                            {item.word}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {captionStyle === 'minimal' && (
                  <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg max-w-[90%] shadow-lg">
                    <p className="text-white text-sm sm:text-base font-medium tracking-wide">
                      {displayWindow.map((item) => (
                        <span 
                          key={item.id} 
                          className={`mx-0.5 ${item.id === activeWord?.id ? 'text-rose-400 font-bold underline' : 'text-slate-200'}`}
                        >
                          {item.word}
                        </span>
                      ))}
                    </p>
                  </div>
                )}

                {captionStyle === 'pop' && (
                  <div className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 px-4 py-2.5 rounded-xl border border-indigo-500/30 max-w-[90%]">
                    <div className="flex flex-wrap items-center justify-center gap-1.5 font-bold uppercase">
                      {displayWindow.map((item) => (
                        <span
                          key={item.id}
                          className={`inline-block px-1 rounded ${
                            item.id === activeWord?.id 
                              ? 'bg-amber-400 text-slate-950 font-black scale-105' 
                              : 'text-white'
                          } text-lg sm:text-xl`}
                        >
                          {item.word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Watermark Branding / OpusClip Tag (subtle) */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white/70 font-mono">
                OpusClip AI
              </div>
            </div>
          </div>

          {/* Timeline & Playback Scrubbing Bar */}
          <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mt-4">
            {/* Audio Waveform Scrubbing Track */}
            <div 
              className="relative w-full h-10 bg-slate-950 rounded-xl overflow-hidden cursor-pointer flex items-center px-1 mb-3 group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                handleSeek(pos * clip.duration);
              }}
            >
              {/* Synthetic Waveform Bars */}
              <div className="w-full h-full flex items-center justify-between gap-[2px] opacity-70">
                {Array.from({ length: 50 }).map((_, i) => {
                  const heightPct = 25 + Math.sin(i * 0.4) * 35 + ((i % 4) * 12);
                  const progressPct = (currentTime / clip.duration) * 100;
                  const isPassed = (i / 50) * 100 <= progressPct;

                  return (
                    <div
                      key={i}
                      className={`w-full rounded-full transition-colors ${
                        isPassed ? 'bg-rose-500' : 'bg-slate-700'
                      }`}
                      style={{ height: `${Math.min(90, Math.max(20, heightPct))}%` }}
                    />
                  );
                })}
              </div>

              {/* Playhead Pin */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_white] pointer-events-none"
                style={{ left: `${(currentTime / clip.duration) * 100}%` }}
              />
            </div>

            {/* Playback Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSeek(currentTime - 3)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Rewind 3s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-md shadow-rose-900/40 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => handleSeek(currentTime + 3)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Forward 3s"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Timestamp Counter */}
              <div className="font-mono text-xs text-slate-300 tabular-nums">
                <span className="text-white font-bold">
                  {Math.floor(currentTime / 60)}:
                  {Math.floor(currentTime % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-slate-600 mx-1">/</span>
                <span>
                  {Math.floor(clip.duration / 60)}:
                  {Math.floor(clip.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Speed Switcher */}
              <div className="flex items-center gap-1 text-xs">
                {[1, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      playbackSpeed === speed 
                        ? 'bg-slate-800 text-rose-400 font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Studio Panel: Tabs for Transcript, Virality, Repurpose & Styles (Cols 8-12) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900 border-l border-slate-800 overflow-hidden">
          {/* Tabs Navigation Header */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950/60 p-1">
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'transcript' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Transcript</span>
            </button>

            <button
              onClick={() => setActiveTab('virality')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'virality' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Virality™</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('repurpose');
                handleLoadRepurpose();
              }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'repurpose' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Repurpose</span>
            </button>

            <button
              onClick={() => setActiveTab('styles')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'styles' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TypeIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Captions</span>
            </button>
          </div>

          {/* Feedback banner if Co-Pilot or word action succeeded */}
          {coPilotSuccessMsg && (
            <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-3.5 h-3.5" />
              <span>{coPilotSuccessMsg}</span>
            </div>
          )}

          {/* Tab 1: Interactive Transcript Editor */}
          {activeTab === 'transcript' && (
            <div className="flex-1 flex flex-col p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-slate-400">Click any word to jump playback</span>
                <button
                  onClick={handleRemoveFillerWords}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 font-medium transition-colors flex items-center gap-1"
                >
                  <Scissors className="w-3 h-3" />
                  <span>Remove Filler Words</span>
                </button>
              </div>

              {/* Word by word interactive flow */}
              <div className="flex-1 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 leading-loose overflow-y-auto max-h-[460px]">
                {clip.transcript.map((item) => {
                  const isCurrent = currentTime >= item.start && currentTime <= item.end + 0.1;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleWordClick(item.start)}
                      className={`inline-flex items-center gap-0.5 mx-1 my-1 px-1.5 py-0.5 rounded text-xs transition-all font-medium ${
                        isCurrent
                          ? 'bg-rose-500 text-white font-bold scale-105 shadow-sm'
                          : item.highlighted
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{item.word}</span>
                      {autoEmojis && item.emoji && (
                        <span className="text-[11px]">{item.emoji}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* AI Co-Pilot Mini Prompt */}
              <form onSubmit={handleCoPilotSubmit} className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Wand2 className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={coPilotPrompt}
                    onChange={(e) => setCoPilotPrompt(e.target.value)}
                    placeholder="Ask AI Co-Pilot: 'Make it punchier' or 'Yellow text'..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: AI Virality Score & Deep Analytics */}
          {activeTab === 'virality' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
              {/* Overall Score Dial */}
              <div className="bg-gradient-to-br from-rose-950/40 via-slate-950 to-indigo-950/40 border border-rose-500/20 rounded-2xl p-5 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-3">
                  <Flame className="w-3.5 h-3.5 fill-rose-400" />
                  <span>VIRALITY SCORE™ PREDICTION</span>
                </div>
                <div className="text-5xl font-black text-white font-mono mb-1">
                  {clip.virality.overall}<span className="text-2xl text-slate-500">/100</span>
                </div>
                <p className="text-xs text-rose-300 font-medium">Top 2% Viral Potential on Shorts & TikTok</p>
              </div>

              {/* Metric Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Retention Drivers</h4>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Hook Strength (First 3s)</span>
                    <span className="font-mono font-bold text-rose-400">{clip.virality.hookStrength}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${clip.virality.hookStrength}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Engagement & Comment Probability</span>
                    <span className="font-mono font-bold text-amber-400">{clip.virality.engagementScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${clip.virality.engagementScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Story Flow & Pacing Rhythm</span>
                    <span className="font-mono font-bold text-indigo-400">{clip.virality.flowScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400" style={{ width: `${clip.virality.flowScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Virality Explanation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="text-rose-400 font-bold block mb-1">Why this will go viral:</span>
                {clip.virality.explanation}
              </div>

              {/* Alternate Hook Generator */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Hook Variations</span>
                  </h4>
                  <button
                    onClick={handleGenerateHooks}
                    disabled={isLoadingHooks}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold disabled:opacity-50"
                  >
                    {isLoadingHooks ? 'Generating...' : '+ Generate 5 Hooks'}
                  </button>
                </div>

                {alternateHooks.length > 0 ? (
                  <div className="space-y-2">
                    {alternateHooks.map((h, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 transition-colors text-xs flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono mb-1">
                          <span>{h.type}</span>
                          <span className="text-emerald-400">{h.expectedRetentionLift}</span>
                        </div>
                        <p className="text-slate-200 mb-2 font-medium">&ldquo;{h.hookText}&rdquo;</p>
                        <button
                          onClick={() => handleApplyHook(h.hookText)}
                          className="self-end px-2 py-1 rounded bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors text-[11px] font-semibold"
                        >
                          Use this Hook
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Click &ldquo;+ Generate 5 Hooks&rdquo; to analyze this clip with Gemini and unlock 5 psychological opening hooks.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Social Media Repurposer */}
          {activeTab === 'repurpose' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Platform Copy</h3>
                <span className="text-[11px] text-rose-400 font-mono">1-Click Publish Ready</span>
              </div>

              {isLoadingRepurpose ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Generating optimized copy for YouTube, TikTok & LinkedIn...
                </div>
              ) : repurposeData ? (
                <div className="space-y-4">
                  {/* YouTube Shorts Box */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-red-400 flex items-center gap-1.5">
                        YouTube Shorts
                      </span>
                      <button
                        onClick={() => copyToClipboard(repurposeData.youtubeShorts?.description, 'yt')}
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedKey === 'yt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'yt' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-white font-semibold mb-1">{repurposeData.youtubeShorts?.title}</p>
                    <p className="text-slate-400 whitespace-pre-line text-[11px]">{repurposeData.youtubeShorts?.description}</p>
                  </div>

                  {/* TikTok / Reels Box */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                        TikTok & Reels Caption
                      </span>
                      <button
                        onClick={() => copyToClipboard(`${repurposeData.tiktok?.caption} ${repurposeData.tiktok?.hashtags?.join(' ')}`, 'tt')}
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedKey === 'tt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'tt' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-slate-200 mb-2">{repurposeData.tiktok?.caption}</p>
                    <p className="text-rose-400 font-mono text-[11px]">{repurposeData.tiktok?.hashtags?.join(' ')}</p>
                  </div>

                  {/* LinkedIn Thought Leadership */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-blue-400 flex items-center gap-1.5">
                        LinkedIn Post
                      </span>
                      <button
                        onClick={() => copyToClipboard(repurposeData.linkedin?.post, 'li')}
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedKey === 'li' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'li' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-slate-300 whitespace-pre-line text-[11px] leading-relaxed">
                      {repurposeData.linkedin?.post}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  <button
                    onClick={handleLoadRepurpose}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                  >
                    Generate Multi-Platform Copy
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Caption Style Customizer */}
          {activeTab === 'styles' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Caption Template</h3>

              {/* Style Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'hormozi', name: 'Alex Hormozi', tag: 'High Virality', color: 'from-yellow-400 to-green-400' },
                  { id: 'mrbeast', name: 'MrBeast Pop', tag: 'High Energy', color: 'from-amber-400 to-red-400' },
                  { id: 'neon', name: 'Cyber Neon', tag: 'Tech / Gaming', color: 'from-cyan-400 to-pink-500' },
                  { id: 'minimal', name: 'Minimal Luxury', tag: 'Podcast / Clean', color: 'from-slate-200 to-slate-400' },
                  { id: 'pop', name: 'Karaoke Pop', tag: 'Trendy TikTok', color: 'from-indigo-400 to-purple-400' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCaptionStyle(s.id as CaptionStyle)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      captionStyle === s.id
                        ? 'bg-rose-500/15 border-rose-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>{s.tag}</span>
                      {captionStyle === s.id && <Check className="w-3 h-3 text-rose-400" />}
                    </div>
                    <span className="font-bold text-xs block">{s.name}</span>
                  </button>
                ))}
              </div>

              {/* Additional Caption Toggles */}
              <div className="pt-3 border-t border-slate-800 space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-medium block mb-1.5">Subtitle Size</label>
                  <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setCaptionSize(size)}
                        className={`flex-1 py-1.5 rounded-lg border capitalize transition-colors ${
                          captionSize === size 
                            ? 'bg-slate-800 border-rose-500 text-white font-bold' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={autoEmojis}
                      onChange={(e) => setAutoEmojis(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-rose-500"
                    />
                    <span>Automatic Kinetic Emojis (⚡, 🧠, 📱)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={isUppercase}
                      onChange={(e) => setIsUppercase(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-rose-500"
                    />
                    <span>Force Uppercase Hormozi Typography</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
