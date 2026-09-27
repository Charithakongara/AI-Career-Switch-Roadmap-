import { useState } from "react";
import { FileText, Briefcase, Users, HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { JobSearchPrep } from "../types";

interface JobSearchPrepCardProps {
  prep: JobSearchPrep;
}

export default function JobSearchPrepCard({ prep }: JobSearchPrepCardProps) {
  const [activeTab, setActiveTab] = useState<'resume' | 'portfolio' | 'networking' | 'interview'>('resume');

  const tabs = [
    { id: 'resume' as const, label: 'Resume & Branding', icon: FileText },
    { id: 'portfolio' as const, label: 'Portfolio Strategy', icon: Briefcase },
    { id: 'networking' as const, label: 'Networking & Outreach', icon: Users },
    { id: 'interview' as const, label: 'Interview Preparation', icon: HelpCircle },
  ];

  const getActiveList = () => {
    switch (activeTab) {
      case 'resume':
        return prep.resumeAdvice;
      case 'portfolio':
        return prep.portfolioStrategy;
      case 'networking':
        return prep.networkingActions;
      case 'interview':
        return prep.interviewPrep;
    }
  };

  const getTabColor = (id: string) => {
    return activeTab === id
      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 rounded-2xl"
      : "bg-white text-slate-700 border border-slate-200/80 hover:border-slate-300 rounded-2xl";
  };

  return (
    <div id="job-search-prep-container" className="space-y-6">
      {/* Tabs navigation */}
      <div id="prep-tabs" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              id={`prep-tab-btn-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 p-3.5 text-xs font-bold transition-all text-left cursor-pointer ${getTabColor(tab.id)}`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      <div id="prep-content-panel" className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-2xl shadow-blue-500/5">
        <div id="panel-header" className="border-b border-slate-100 pb-4 mb-6">
          <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>Critical Actions</span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100/55 px-2 py-0.5 rounded uppercase tracking-wide">
              {activeTab}
            </span>
          </h4>
          <p className="text-xs text-slate-400 mt-1 font-light">AI-generated checklist custom-tuned to land conversations for this role switch.</p>
        </div>

        <div id="action-items-list" className="space-y-4">
          {getActiveList().map((item, idx) => (
            <div 
              key={idx}
              id={`prep-action-item-${idx}`}
              className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100/60"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
