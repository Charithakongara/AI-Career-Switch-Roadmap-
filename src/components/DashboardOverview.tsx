import { useState } from "react";
import { 
  Sparkles, Calendar, BookOpen, Briefcase, Award, ArrowLeft, 
  Trash2, Download, Printer, CheckCircle2, TrendingUp, ChevronRight 
} from "lucide-react";
import { CareerRoadmap } from "../types";
import SkillsGapAnalysis from "./SkillsGapAnalysis";
import TimelineVisualizer from "./TimelineVisualizer";
import WeeklyRoutine from "./WeeklyRoutine";
import JobSearchPrepCard from "./JobSearchPrepCard";

interface DashboardOverviewProps {
  activeRoadmap: CareerRoadmap;
  savedRoadmaps: CareerRoadmap[];
  onSelectRoadmap: (roadmap: CareerRoadmap) => void;
  onDeleteRoadmap: (id: string) => void;
  onNewRoadmap: () => void;
  completedMap: { [key: string]: boolean };
  onToggleItem: (itemId: string) => void;
}

export default function DashboardOverview({
  activeRoadmap,
  savedRoadmaps,
  onSelectRoadmap,
  onDeleteRoadmap,
  onNewRoadmap,
  completedMap,
  onToggleItem
}: DashboardOverviewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'syllabus' | 'skills' | 'routine' | 'job'>('syllabus');

  // Calculate real progress percentage for the active roadmap
  const calculateOverallProgress = () => {
    let totalItems = 0;
    let completedItems = 0;

    activeRoadmap.phases.forEach(phase => {
      phase.topics.forEach(t => {
        totalItems++;
        if (completedMap[`${activeRoadmap.id}_topic_${t.id}`]) completedItems++;
      });

      phase.milestones.forEach(m => {
        m.checklist.forEach((_, idx) => {
          totalItems++;
          if (completedMap[`${activeRoadmap.id}_ms_${m.id}_${idx}`]) completedItems++;
        });
      });
    });

    return totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  };

  const progressPct = calculateOverallProgress();

  // Export to JSON helper
  const handleExportJSON = () => {
    const filename = `AI-Career-Roadmap-${activeRoadmap.targetRole.replace(/\s+/g, "-")}.json`;
    const jsonStr = JSON.stringify(activeRoadmap, null, 2);
    const element = document.createElement("a");
    const file = new Blob([jsonStr], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Print helper
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="dashboard-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Sidebar: Saved Roadmaps & Navigation */}
      <div id="dashboard-sidebar" className="lg:col-span-3 space-y-6 lg:sticky lg:top-6">
        
        {/* Generate New CTA */}
        <button
          id="btn-sidebar-new-roadmap"
          onClick={onNewRoadmap}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/15 hover:bg-blue-700 transition cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>New Custom Switch</span>
        </button>

        {/* Saved List Panel */}
        <div id="saved-roadmaps-list-card" className="bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-blue-500/5 overflow-hidden">
          <div className="bg-white border-b border-slate-100 px-4 py-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Stored Roadmaps</h4>
          </div>
          
          <div className="divide-y divide-slate-50 max-h-[320px] overflow-y-auto">
            {savedRoadmaps.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No saved roadmaps yet.
              </div>
            ) : (
              savedRoadmaps.map((rm) => {
                const isActive = rm.id === activeRoadmap.id;
                return (
                  <div
                    key={rm.id}
                    id={`sidebar-item-${rm.id}`}
                    className={`group flex items-center justify-between p-3.5 text-left transition-colors cursor-pointer ${
                      isActive ? "bg-blue-50/45" : "hover:bg-slate-50"
                    }`}
                    onClick={() => onSelectRoadmap(rm)}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <h5 className={`text-xs font-bold truncate ${isActive ? "text-blue-700" : "text-slate-800"}`}>
                        {rm.targetRole}
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        from {rm.currentRole}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        id={`btn-delete-roadmap-${rm.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRoadmap(rm.id);
                        }}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Delete Roadmap"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Global Progress Widget */}
        <div id="progress-indicator-card" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xl shadow-blue-500/5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            <span>Overall Progress</span>
            <span className="text-blue-600 font-mono text-sm">{progressPct}%</span>
          </div>
          
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            Check off core topics and milestones in the curriculum syllabus to update your progress.
          </p>
        </div>

      </div>

      {/* Main Dashboard Panel */}
      <div id="dashboard-main" className="lg:col-span-9 space-y-8">
        
        {/* Dashboard Title Block */}
        <div id="dashboard-header-panel" className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xl shadow-blue-500/5 space-y-5 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" /> AI Career Switch Advisor
              </span>
              <h2 className="text-2xl font-extrabold text-slate-850 font-display mt-2 leading-tight">
                {activeRoadmap.title}
              </h2>
            </div>

            {/* Utility exports buttons */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
              <button
                id="btn-export-json"
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition cursor-pointer"
                title="Export Roadmap as JSON file"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export</span>
              </button>

              <button
                id="btn-print"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="h-3.5 w-3.5 text-slate-500" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-550 leading-relaxed font-light">
            {activeRoadmap.summary}
          </p>

          {/* Core Stats Grid */}
          <div id="stats-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div id="stat-current" className="p-3.5 bg-slate-50 border border-slate-100/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Current Role</span>
              <span className="text-xs font-bold text-slate-700 truncate block mt-0.5">{activeRoadmap.currentRole}</span>
            </div>
            <div id="stat-target" className="p-3.5 bg-blue-50/30 border border-blue-100/30 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-blue-500 block tracking-wider">Target Goal</span>
              <span className="text-xs font-bold text-blue-900 truncate block mt-0.5">{activeRoadmap.targetRole}</span>
            </div>
            <div id="stat-duration" className="p-3.5 bg-slate-50 border border-slate-100/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Duration</span>
              <span className="text-xs font-bold text-slate-700 truncate block mt-0.5">{activeRoadmap.estimatedTimeMonths} Months</span>
            </div>
            <div id="stat-difficulty" className="p-3.5 bg-slate-50 border border-slate-100/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Difficulty</span>
              <span className="text-xs font-bold text-slate-700 truncate block mt-0.5">{activeRoadmap.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Selector */}
        <div id="sub-tabs-container" className="flex border border-slate-100 bg-white rounded-2xl p-1.5 shadow-2xl shadow-blue-500/5">
          <button
            id="tab-btn-syllabus"
            onClick={() => setActiveSubTab('syllabus')}
            className={`flex-1 py-3 px-2 text-center rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'syllabus'
                ? "bg-blue-50 text-blue-700"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Curriculum Syllabus
          </button>
          
          <button
            id="tab-btn-skills"
            onClick={() => setActiveSubTab('skills')}
            className={`flex-1 py-3 px-2 text-center rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'skills'
                ? "bg-blue-50 text-blue-700"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Skills Gap Analysis
          </button>

          <button
            id="tab-btn-routine"
            onClick={() => setActiveSubTab('routine')}
            className={`flex-1 py-3 px-2 text-center rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'routine'
                ? "bg-blue-50 text-blue-700"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Weekly Routine ({activeRoadmap.hoursPerWeek}h/wk)
          </button>

          <button
            id="tab-btn-job"
            onClick={() => setActiveSubTab('job')}
            className={`flex-1 py-3 px-2 text-center rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'job'
                ? "bg-blue-50 text-blue-700"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Job Placement Prep
          </button>
        </div>

        {/* Dynamic Inner Tab Component Rendering */}
        <div id="dashboard-tab-content" className="min-h-[400px]">
          {activeSubTab === 'syllabus' && (
            <TimelineVisualizer
              roadmapId={activeRoadmap.id}
              phases={activeRoadmap.phases}
              completedMap={completedMap}
              onToggleItem={onToggleItem}
            />
          )}

          {activeSubTab === 'skills' && (
            <SkillsGapAnalysis skills={activeRoadmap.skillsGapAnalysis} />
          )}

          {activeSubTab === 'routine' && (
            <WeeklyRoutine schedule={activeRoadmap.weeklySchedule} />
          )}

          {activeSubTab === 'job' && (
            <JobSearchPrepCard prep={activeRoadmap.jobSearchPreparation} />
          )}
        </div>

        {/* Budget Allocation Strategies */}
        <div id="budget-allocation-strategy-card" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xl shadow-blue-500/5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <h4 className="text-[11px] font-bold text-slate-450 uppercase tracking-wide">Learning Budget Advice (Budget: ${activeRoadmap.learningBudget})</h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-550 leading-relaxed font-light">
            {activeRoadmap.learningBudgetStrategy}
          </p>
        </div>

      </div>

    </div>
  );
}
