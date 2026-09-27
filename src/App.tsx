import { useState, useEffect } from "react";
import { Compass, Sparkles, AlertCircle, RefreshCw, Layers, ArrowLeft } from "lucide-react";
import { CareerRoadmap, UserPreferences } from "./types";
import LandingHero from "./components/LandingHero";
import SetupForm from "./components/SetupForm";
import DashboardOverview from "./components/DashboardOverview";

export default function App() {
  // Navigation states: 'landing' | 'setup' | 'dashboard'
  const [viewState, setViewState] = useState<'landing' | 'setup' | 'dashboard'>('landing');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Roadmap & User persistence
  const [activeRoadmap, setActiveRoadmap] = useState<CareerRoadmap | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<CareerRoadmap[]>([]);
  const [completedMap, setCompletedMap] = useState<{ [key: string]: boolean }>({});
  
  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
    currentRole: "",
    targetRole: "",
    yearsExperience: 2,
    hoursPerWeek: 10,
    learningBudget: 0,
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedSaved = localStorage.getItem("ai_career_roadmaps");
      if (storedSaved) {
        const parsed = JSON.parse(storedSaved);
        setSavedRoadmaps(parsed);
      }

      const storedActiveId = localStorage.getItem("ai_career_active_roadmap_id");
      const storedCompleted = localStorage.getItem("ai_career_completed_map");
      if (storedCompleted) {
        setCompletedMap(JSON.parse(storedCompleted));
      }

      if (storedSaved && storedActiveId) {
        const parsed = JSON.parse(storedSaved) as CareerRoadmap[];
        const matched = parsed.find(item => item.id === storedActiveId);
        if (matched) {
          setActiveRoadmap(matched);
          setViewState('dashboard');
        }
      }
    } catch (err) {
      console.error("Failed to load local storage state:", err);
    }
  }, []);

  // Save to localStorage when lists update
  const saveRoadmapsToLocalStorage = (list: CareerRoadmap[]) => {
    localStorage.setItem("ai_career_roadmaps", JSON.stringify(list));
  };

  const handleToggleItem = (itemId: string) => {
    setCompletedMap(prev => {
      const updated = { ...prev, [itemId]: !prev[itemId] };
      localStorage.setItem("ai_career_completed_map", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectPreset = (current: string, target: string) => {
    setUserPrefs(prev => ({
      ...prev,
      currentRole: current,
      targetRole: target
    }));
    setViewState('setup');
  };

  const handleSelectActiveRoadmap = (roadmap: CareerRoadmap) => {
    setActiveRoadmap(roadmap);
    localStorage.setItem("ai_career_active_roadmap_id", roadmap.id);
    setViewState('dashboard');
  };

  const handleDeleteRoadmap = (id: string) => {
    const updated = savedRoadmaps.filter(rm => rm.id !== id);
    setSavedRoadmaps(updated);
    saveRoadmapsToLocalStorage(updated);

    if (activeRoadmap?.id === id) {
      if (updated.length > 0) {
        handleSelectActiveRoadmap(updated[0]);
      } else {
        setActiveRoadmap(null);
        localStorage.removeItem("ai_career_active_roadmap_id");
        setViewState('landing');
      }
    }
  };

  const handleGenerateRoadmap = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setErrorMsg(null);
    setUserPrefs(prefs);

    try {
      const apiBase = (import.meta as any).env?.VITE_API_URL || "";
      const response = await fetch(`${apiBase}/api/generate-roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unexpected error occurred during generation.");
      }

      // Prepend to saved roadmaps
      const newRoadmapList = [data, ...savedRoadmaps];
      setSavedRoadmaps(newRoadmapList);
      saveRoadmapsToLocalStorage(newRoadmapList);

      // Set as active
      setActiveRoadmap(data);
      localStorage.setItem("ai_career_active_roadmap_id", data.id);
      setViewState('dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate roadmap due to connection issues.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="main-app-container" className="min-h-screen flex flex-col bg-slate-50/40">
      
      {/* SaaS Master Header */}
      <header id="saas-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/80 px-4 sm:px-6 lg:px-8 py-4 shadow-2xl shadow-blue-500/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            id="brand-logo" 
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => {
              if (activeRoadmap) {
                setViewState('dashboard');
              } else {
                setViewState('landing');
              }
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/15">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-800 font-display tracking-tight">AI Career Switch</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Roadmap Advisor</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {viewState !== 'landing' && (
              <button
                id="btn-nav-home"
                onClick={() => setViewState('landing')}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Landing Info
              </button>
            )}

            {savedRoadmaps.length > 0 && activeRoadmap && viewState !== 'dashboard' && (
              <button
                id="btn-nav-dashboard"
                onClick={() => setViewState('dashboard')}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
              >
                <span>Back to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Stage Area */}
      <main id="app-stage" className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Global Connection / API Key error notices */}
          {errorMsg && (
            <div id="error-boundary-banner" className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-800 shadow-2xl shadow-rose-500/5">
              <AlertCircle className="h-5.5 w-5.5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-bold text-rose-900">Roadmap Generation Interrupted</h4>
                <p className="text-xs text-rose-600 leading-relaxed font-light">{errorMsg}</p>
                <div className="flex gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleGenerateRoadmap(userPrefs)}
                    className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Retry Generation
                  </button>
                  <button
                    type="button"
                    onClick={() => setErrorMsg(null)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2 py-1 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View Controller */}
          {viewState === 'landing' && (
            <LandingHero
              onStart={() => setViewState('setup')}
              onSelectPreset={handleSelectPreset}
            />
          )}

          {viewState === 'setup' && (
            <div className="space-y-6">
              <button
                id="btn-back-to-landing"
                onClick={() => setViewState(activeRoadmap ? 'dashboard' : 'landing')}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </button>
              
              <SetupForm
                initialValues={userPrefs}
                onSubmit={handleGenerateRoadmap}
                isLoading={isLoading}
              />
            </div>
          )}

          {viewState === 'dashboard' && activeRoadmap && (
            <DashboardOverview
              activeRoadmap={activeRoadmap}
              savedRoadmaps={savedRoadmaps}
              onSelectRoadmap={handleSelectActiveRoadmap}
              onDeleteRoadmap={handleDeleteRoadmap}
              onNewRoadmap={() => setViewState('setup')}
              completedMap={completedMap}
              onToggleItem={handleToggleItem}
            />
          )}

        </div>
      </main>

      {/* SaaS Master Footer */}
      <footer id="saas-footer" className="bg-white border-t border-slate-100 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AI Career Switch Roadmap. Powering professional transitions with certainty.</p>
          <div className="flex gap-4">
            <span className="font-semibold text-slate-400">White & Blue theme</span>
            <span>•</span>
            <span className="font-semibold text-slate-400">Responsive Dashboard</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
