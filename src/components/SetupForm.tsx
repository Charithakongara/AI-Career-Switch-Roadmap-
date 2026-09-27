import React, { useState } from "react";
import { Compass, Clock, DollarSign, Briefcase, HelpCircle, GraduationCap, Sparkles, BookOpen } from "lucide-react";
import { UserPreferences } from "../types";

interface SetupFormProps {
  initialValues: UserPreferences;
  onSubmit: (values: UserPreferences) => void;
  isLoading: boolean;
}

export default function SetupForm({ initialValues, onSubmit, isLoading }: SetupFormProps) {
  const [formState, setFormState] = useState<UserPreferences>({ ...initialValues });
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const targetSuggestions = [
    "Frontend Web Developer",
    "Full Stack Software Engineer",
    "Data Analyst",
    "UI/UX Designer",
    "Python Developer",
    "DevOps Cloud Engineer",
    "Product Manager",
    "AI Prompt Engineer"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === "yearsExperience" || name === "hoursPerWeek" || name === "learningBudget"
        ? Math.max(0, parseInt(value) || 0)
        : value
    }));
  };

  const setTargetRole = (role: string) => {
    setFormState(prev => ({ ...prev, targetRole: role }));
  };

  const handleSliderChange = (name: string, value: number) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.currentRole.trim() || !formState.targetRole.trim()) return;
    onSubmit(formState);
  };

  return (
    <div id="setup-form-container" className="max-w-2xl mx-auto">
      <div id="form-card" className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-blue-500/5 overflow-hidden relative">
        
        <div id="form-card-header" className="p-8 sm:p-10 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Compass className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 font-display">Create Your Roadmap</h2>
              <p className="text-sm text-slate-400">Fill in your profile details for a custom, optimized career switch plan.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
          {/* Roles grid */}
          <div id="roles-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Current Role */}
            <div id="current-role-group" className="space-y-1.5 relative">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Current Role
              </label>
              <input
                id="inp-current-role"
                type="text"
                name="currentRole"
                value={formState.currentRole}
                onChange={handleInputChange}
                required
                placeholder="e.g. Marketing Manager"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 placeholder:text-slate-400"
              />
              <p className="text-[10px] text-slate-400/80">Helps identify your transferable skills.</p>
            </div>

            {/* Target Role */}
            <div id="target-role-group" className="space-y-1.5 relative">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Target Role
              </label>
              <input
                id="inp-target-role"
                type="text"
                name="targetRole"
                value={formState.targetRole}
                onChange={handleInputChange}
                required
                placeholder="e.g. UX Designer"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 placeholder:text-slate-400"
              />
              <p className="text-[10px] text-slate-400/80">The dream career path you want to break into.</p>
            </div>
          </div>

          {/* Quick Target Suggestions */}
          <div id="suggestions-box" className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/40">
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" /> Popular Target Roles
            </span>
            <div className="flex flex-wrap gap-2">
              {targetSuggestions.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    formState.targetRole.toLowerCase() === role.toLowerCase()
                      ? "bg-blue-600 text-white border-blue-600 font-bold shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders and Budget Grid */}
          <div id="sliders-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            
            {/* Years of Experience */}
            <div id="years-exp-group" className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  Years of Experience
                </label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {formState.yearsExperience} {formState.yearsExperience === 1 ? "Year" : "Years"}
                </span>
              </div>
              <div className="relative">
                <input
                  id="range-years-experience"
                  type="range"
                  min="0"
                  max="20"
                  value={formState.yearsExperience}
                  onChange={(e) => handleSliderChange("yearsExperience", parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                <span>0 (Junior/Graduate)</span>
                <span>10 (Mid Career)</span>
                <span>20+ (Senior)</span>
              </div>
            </div>

            {/* Hours available per week */}
            <div id="hours-week-group" className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  Hours / Week
                </label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {formState.hoursPerWeek} Hours
                </span>
              </div>
              <div>
                <input
                  id="range-hours-per-week"
                  type="range"
                  min="2"
                  max="40"
                  value={formState.hoursPerWeek}
                  onChange={(e) => handleSliderChange("hoursPerWeek", parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                <span>2 hrs (Casual)</span>
                <span>20 hrs (Part Time)</span>
                <span>40 hrs (Full Time)</span>
              </div>
            </div>
          </div>

          {/* Budget row */}
          <div id="budget-group" className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Learning Budget
              </label>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                {formState.learningBudget === 0 ? "Completely Free Route" : `$${formState.learningBudget} Total`}
              </span>
            </div>
            
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <span className="text-slate-400 text-sm">$</span>
                </div>
                <input
                  id="inp-learning-budget"
                  type="number"
                  name="learningBudget"
                  min="0"
                  max="50000"
                  value={formState.learningBudget}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 pl-8 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
              </div>

              {/* Fast budget templates */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSliderChange("learningBudget", 0)}
                  className={`text-xs px-3 py-2.5 rounded-xl border font-bold transition ${
                    formState.learningBudget === 0
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  $0 Free
                </button>
                <button
                  type="button"
                  onClick={() => handleSliderChange("learningBudget", 150)}
                  className={`text-xs px-3 py-2.5 rounded-xl border font-bold transition ${
                    formState.learningBudget === 150
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  $150
                </button>
                <button
                  type="button"
                  onClick={() => handleSliderChange("learningBudget", 1000)}
                  className={`text-xs px-3 py-2.5 rounded-xl border font-bold transition ${
                    formState.learningBudget === 1000
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  $1000
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div id="form-actions" className="pt-6 border-t border-slate-100">
            <button
              id="btn-generate-roadmap-submit"
              type="submit"
              disabled={isLoading || !formState.currentRole.trim() || !formState.targetRole.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-600/20 disabled:bg-slate-200 disabled:shadow-none transition duration-150 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating My Roadmap...</span>
                </span>
              ) : (
                <span>Generate My Roadmap</span>
              )}
            </button>
          </div>
        </form>

        {/* Loading overlay messages with encouraging text */}
        {isLoading && (
          <div id="loading-overlay" className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-8 text-center space-y-6 z-30">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
              <Compass className="h-7 w-7 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            
            <div className="space-y-2 max-w-md">
              <h3 className="text-lg font-bold text-slate-900 animate-pulse">Consulting Gemini Career Advisor...</h3>
              <p className="text-sm text-slate-500">We are cross-referencing industry skill maps, calculating study phase hours, and selecting cost-efficient learning platforms based on your parameters.</p>
            </div>
            
            <div className="w-full max-w-xs bg-slate-100 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-infinite-loading" />
            </div>
            <span className="text-xs text-slate-400">This usually takes about 10-15 seconds</span>
          </div>
        )}
      </div>
    </div>
  );
}
