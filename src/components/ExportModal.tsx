import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Check, 
  FileText, 
  Share2, 
  Sparkles, 
  Film, 
  Calendar, 
  Youtube, 
  Send, 
  Copy,
  Clock,
  Layers
} from 'lucide-react';
import { VideoClip } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clip: VideoClip | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  clip,
}) => {
  const [resolution, setResolution] = useState<'1080p' | '720p' | '4k'>('1080p');
  const [burnCaptions, setBurnCaptions] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'download' | 'social'>('download');
  const [schedulePlatform, setSchedulePlatform] = useState<'all' | 'tiktok' | 'shorts' | 'reels'>('all');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  if (!isOpen || !clip) return null;

  // Generate SRT format content
  const generateSrt = () => {
    return clip.transcript
      .map((item, idx) => {
        const formatTime = (sec: number) => {
          const h = Math.floor(sec / 3600);
          const m = Math.floor((sec % 3600) / 60);
          const s = Math.floor(sec % 60);
          const ms = Math.floor((sec % 1) * 1000);
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
        };
        return `${idx + 1}\n${formatTime(item.start)} --> ${formatTime(item.end)}\n${item.word}\n`;
      })
      .join('\n');
  };

  const handleDownloadSrt = () => {
    const srtText = generateSrt();
    const blob = new Blob([srtText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clip.title.replace(/[^a-zA-Z0-9]/g, '_')}_subtitles.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMp4 = () => {
    setIsExporting(true);
    setExportComplete(false);

    // Simulate high-speed cloud rendering of 1080p 60fps MP4
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);

      // Create a downloaded text metadata / video asset package
      const clipDetails = `OpusClip AI Viral Short Export
======================================
Title: ${clip.title}
Virality Score: ${clip.virality.overall}/100
Hook: ${clip.hookQuote}
Duration: ${clip.duration}s
Resolution: ${resolution === '4k' ? '2160x3840 (4K Ultra)' : resolution === '1080p' ? '1080x1920 (1080p 60fps)' : '720x1280 (720p HD)'}
Aspect Ratio: ${clip.aspectRatio}
Captions Burned-in: ${burnCaptions ? 'YES' : 'NO (Raw Master)'}
Caption Style: ${clip.captionStyle}
Hashtags: ${clip.hashtags.join(' ')}

Transcript:
${clip.transcript.map(w => w.word).join(' ')}
`;
      const blob = new Blob([clipDetails], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${clip.title.replace(/[^a-zA-Z0-9]/g, '_')}_1080p_OpusClip.mp4.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1800);
  };

  const handleSchedulePost = () => {
    setScheduleSuccess(true);
    setTimeout(() => {
      setScheduleSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export & Publish Short</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-sm">{clip.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher: Quick Download vs Auto Publish */}
        <div className="flex bg-slate-950 p-1 rounded-xl my-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'download' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download MP4 & SRT</span>
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'social' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Auto-Schedule Post</span>
          </button>
        </div>

        {activeTab === 'download' ? (
          <div className="space-y-4 text-xs">
            {/* Free Banner */}
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs text-emerald-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Free Export · No Watermark Added</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400">UNLIMITED</span>
            </div>

            {/* Resolution Selector */}
            <div>
              <label className="text-slate-400 font-medium block mb-2">Render Quality (All Unlocked Free)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '1080p', label: '1080p HD', desc: '60 FPS · Free & Fast' },
                  { id: '720p', label: '720p Fast', desc: 'Smaller file size · Free' },
                  { id: '4k', label: '4K Ultra', desc: 'Cinema Master · Free' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setResolution(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      resolution === item.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold block text-white">{item.label}</span>
                    <span className="text-[10px] text-emerald-400/90">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Captions Burn-In Toggle */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-white font-semibold block">Burn-in Dynamic Subtitles</span>
                <span className="text-[11px] text-slate-400">Renders animated {clip.captionStyle} captions directly onto video pixels</span>
              </div>
              <input
                type="checkbox"
                checked={burnCaptions}
                onChange={(e) => setBurnCaptions(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-rose-500"
              />
            </div>

            {/* Download SRT Button */}
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-white font-medium block">Export Subtitle File (.SRT)</span>
                  <span className="text-[10px] text-slate-400">Accurate word timestamps for YouTube/Premiere</span>
                </div>
              </div>
              <button
                onClick={handleDownloadSrt}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
              >
                Download .SRT
              </button>
            </div>

            {/* Main Download CTA */}
            <div className="pt-2">
              <button
                onClick={handleDownloadMp4}
                disabled={isExporting}
                className="w-full py-3 bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-rose-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Rendering 1080p 60fps MP4...</span>
                  </>
                ) : exportComplete ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Download Ready! (Saved to device)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Free MP4 (No Watermark)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Auto Social Media Publishing */
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-2">Select Channels</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
                  { id: 'shorts', name: 'YouTube Shorts', icon: '▶️' },
                  { id: 'reels', name: 'Instagram Reels', icon: '📸' },
                ].map((p) => (
                  <div key={p.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                    <span className="text-lg block mb-1">{p.icon}</span>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Connected</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1.5">Posting Schedule</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200">
                <option>Publish Immediately</option>
                <option>Today at 6:00 PM (Peak viral hour)</option>
                <option>Tomorrow at 9:00 AM</option>
                <option>Custom Date & Time</option>
              </select>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Generated Caption & Tags:</span>
              <p className="text-white font-medium line-clamp-2">{clip.title}</p>
              <p className="text-rose-400 font-mono text-[11px] mt-1">{clip.hashtags.join(' ')}</p>
            </div>

            <button
              onClick={handleSchedulePost}
              disabled={scheduleSuccess}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {scheduleSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Scheduled to All 3 Channels!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Schedule & Publish</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
