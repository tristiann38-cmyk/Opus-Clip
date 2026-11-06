import React, { useState } from 'react';
import { Header } from './components/Header';
import { VideoImportSection } from './components/VideoImportSection';
import { ClipCard } from './components/ClipCard';
import { StudioEditor } from './components/StudioEditor';
import { AIProcessingModal } from './components/AIProcessingModal';
import { ExportModal } from './components/ExportModal';
import { FreeInfoModal } from './components/FreeInfoModal';
import { ViralityExplainerView } from './components/ViralityExplainerView';
import { TemplatesGalleryView } from './components/TemplatesGalleryView';
import { SAMPLE_PROJECTS } from './data/mockVideos';
import { VideoProject, VideoClip, ClippingPreferences, CaptionStyle } from './types';
import { Sparkles, Film, ArrowRight, Layers, Flame, RefreshCw, FileVideo } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<VideoProject[]>(SAMPLE_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj_neuroscience');
  const [activeClip, setActiveClip] = useState<VideoClip | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'studio' | 'templates' | 'virality' | 'free-info'>('dashboard');

  // Modal states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTitle, setProcessingTitle] = useState('New Video Ingestion');
  const [exportClip, setExportClip] = useState<VideoClip | null>(null);
  const [isFreeInfoOpen, setIsFreeInfoOpen] = useState(false);

  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleStartProcessing = async (
    videoUrl: string, 
    preferences: ClippingPreferences, 
    customFile?: File
  ) => {
    const title = customFile ? customFile.name.replace(/\.[^/.]+$/, "") : (videoUrl.includes('youtube') ? 'YouTube Viral Short' : 'Imported Video Studio');
    setProcessingTitle(title);
    setIsProcessing(true);

    try {
      // Call backend API with Gemini analysis
      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: title,
          topic: preferences.topicPrompt || 'Viral content hooks',
          transcriptSample: 'Discussion on focus, high performance, and eliminating distractions.',
        }),
      });
      const resData = await res.json();
      
      if (resData.success && resData.data?.clips) {
        // Build new dynamic project with the generated clips
        const newProject: VideoProject = {
          id: `proj_${Date.now()}`,
          title: title,
          sourceUrl: videoUrl,
          duration: 1800,
          thumbnail: currentProject.thumbnail,
          createdAt: 'Just now',
          clipsCount: resData.data.clips.length,
          clips: resData.data.clips.map((c: any, i: number) => ({
            id: `clip_${Date.now()}_${i}`,
            title: c.title,
            hookQuote: c.hookQuote,
            duration: c.durationSeconds || 30,
            startTime: i * 40,
            endTime: i * 40 + (c.durationSeconds || 30),
            aspectRatio: preferences.autoReframe,
            layout: preferences.splitScreen ? 'split' : 'single',
            captionStyle: preferences.captionPreset,
            virality: {
              overall: c.viralityScore || 96,
              hookStrength: c.hookStrength || 95,
              engagementScore: c.engagementScore || 94,
              flowScore: 92,
              trendScore: c.trendScore || 95,
              explanation: c.explanation || 'High organic engagement with strong retention rate.',
            },
            hashtags: c.hashtags || ['#viral', '#shorts', '#mindset'],
            thumbnail: currentProject.thumbnail,
            speaker1: { name: 'Host Speaker', role: 'Speaker' },
            transcript: c.hookQuote.split(' ').map((word: string, wIdx: number) => ({
              id: `w_${wIdx}`,
              word: word.toUpperCase(),
              start: wIdx * 0.4,
              end: (wIdx + 1) * 0.4,
              highlighted: wIdx % 3 === 0,
              emoji: wIdx === 2 ? '🔥' : wIdx === 5 ? '⚡' : undefined,
            })),
          })),
        };

        setProjects((prev) => [newProject, ...prev]);
        setActiveProjectId(newProject.id);
      }
    } catch (err) {
      console.error('Error during AI analysis:', err);
    }
  };

  const handleSelectSample = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveView('dashboard');
  };

  const handleEditClip = (clip: VideoClip) => {
    setActiveClip(clip);
    setActiveView('studio');
  };

  const handleSaveClip = (updatedClip: VideoClip) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === activeProjectId) {
          return {
            ...p,
            clips: p.clips.map((c) => (c.id === updatedClip.id ? updatedClip : c)),
          };
        }
        return p;
      })
    );
    setActiveClip(updatedClip);
  };

  const handleApplyCaptionStyleToCurrent = (style: CaptionStyle) => {
    if (currentProject.clips.length > 0) {
      const updatedClips = currentProject.clips.map((c) => ({
        ...c,
        captionStyle: style,
      }));
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProjectId ? { ...p, clips: updatedClips } : p))
      );
      if (activeClip) {
        setActiveClip({ ...activeClip, captionStyle: style });
      }
    }
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100">
      {/* Top Header conforming to contract */}
      <Header
        onNewProject={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setActiveView('dashboard');
        }}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeView === 'studio' && activeClip ? (
          /* Flagship Studio Editor View */
          <StudioEditor
            clip={activeClip}
            onBack={() => {
              setActiveView('dashboard');
              setActiveClip(null);
            }}
            onSaveClip={handleSaveClip}
            onOpenExport={(clip) => setExportClip(clip)}
          />
        ) : activeView === 'virality' ? (
          /* Virality Score Algorithm View */
          <ViralityExplainerView onBackToDashboard={() => setActiveView('dashboard')} />
        ) : activeView === 'templates' ? (
          /* Caption Styles Gallery View */
          <TemplatesGalleryView
            onSelectStyle={handleApplyCaptionStyleToCurrent}
            onBackToDashboard={() => setActiveView('dashboard')}
          />
        ) : (
          /* Dashboard & Clips View */
          <div className="flex-1 flex flex-col">
            {/* Top Import Hero */}
            <VideoImportSection
              onStartProcessing={handleStartProcessing}
              onSelectSample={handleSelectSample}
            />

            {/* Generated Clips Section */}
            <section className="max-w-7xl mx-auto w-full px-6 py-8">
              {/* Project Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs text-rose-400 font-mono mb-1">
                    <FileVideo className="w-3.5 h-3.5" />
                    <span>ACTIVE PROJECT</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{currentProject.createdAt}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {currentProject.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Project Switcher Dropdown */}
                  <div className="text-xs">
                    <span className="text-slate-500 mr-2">Switch Video:</span>
                    <select
                      value={activeProjectId}
                      onChange={(e) => setActiveProjectId(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-rose-500"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title.length > 35 ? `${p.title.slice(0, 35)}...` : p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid of Generated Viral Clips */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
                      <span>{currentProject.clips.length} Viral Shorts Extracted</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ranked by OpusClip Virality Score™ with auto-reframe, speaker face tracking, and dynamic captions.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProject.clips.map((clip) => (
                    <ClipCard
                      key={clip.id}
                      clip={clip}
                      onEdit={handleEditClip}
                      onPreview={handleEditClip}
                      onQuickExport={(c) => setExportClip(c)}
                    />
                  ))}
                </div>
              </div>

              {/* Feature Highlights Grid (Clean Anti-Slop Bento Layout) */}
              <div className="mt-12 pt-12 border-t border-slate-800/80">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                    Engineered for Video Dominance
                  </h3>
                  <p className="text-xs text-slate-400">
                    Why the top 1% of content creators use OpusClip to produce 100+ viral shorts per month.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                      <Flame className="w-4 h-4 fill-rose-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">AI Virality Score™</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Automatically evaluates hook strength, audience engagement velocity, and trending audio indicators to surface the top clips.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">Active Speaker Reframe</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Intelligent computer vision tracks active speakers and centers faces automatically in 9:16 vertical crop with zero cut artifacts.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">Dynamic Karaoke Subtitles</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      97% accuracy speech recognition generates word-by-word animated captions styled after Alex Hormozi and MrBeast with auto emojis.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#07090E] py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">OpusClip AI</span>
            <span>·</span>
            <span>Generative AI Video Repurposing Studio</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => setActiveView('virality')} className="hover:text-white transition-colors">
              Virality Algorithm
            </button>
            <button onClick={() => setActiveView('templates')} className="hover:text-white transition-colors">
              Caption Styles
            </button>
            <button 
              onClick={() => setIsFreeInfoOpen(true)} 
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>100% Free Guarantee</span>
            </button>
            <span>© 2026 OpusClip AI. Free & Open.</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AIProcessingModal
        isOpen={isProcessing}
        videoTitle={processingTitle}
        onComplete={() => setIsProcessing(false)}
      />

      <ExportModal
        isOpen={!!exportClip}
        clip={exportClip}
        onClose={() => setExportClip(null)}
      />

      <FreeInfoModal
        isOpen={isFreeInfoOpen || activeView === 'free-info'}
        onClose={() => {
          setIsFreeInfoOpen(false);
          if (activeView === 'free-info') setActiveView('dashboard');
        }}
        onStartRepurposing={() => {
          setIsFreeInfoOpen(false);
          setActiveView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
