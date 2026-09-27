import { motion } from "motion/react";
import { Award, CheckCircle2, TrendingUp, AlertCircle, Info } from "lucide-react";
import { SkillGapItem } from "../types";

interface SkillsGapAnalysisProps {
  skills: SkillGapItem[];
}

export default function SkillsGapAnalysis({ skills }: SkillsGapAnalysisProps) {
  
  // Helper to color importance tags
  const getImportanceStyles = (importance: string) => {
    switch (importance?.toLowerCase()) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "low":
        default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  // Helper to color category tags
  const getCategoryStyles = (category: string) => {
    switch (category?.toLowerCase()) {
      case "technical":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "soft":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "domain":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  // Turn text representation of level into numeric percentage for visual gauge
  const getLevelPercent = (level: string) => {
    const l = level?.toLowerCase() || "";
    if (l.includes("none") || l.includes("zero") || l.includes("no experience")) return 5;
    if (l.includes("basic") || l.includes("beginner") || l.includes("novice")) return 35;
    if (l.includes("intermediate") || l.includes("competent") || l.includes("some")) return 65;
    if (l.includes("advanced") || l.includes("expert") || l.includes("senior") || l.includes("high")) return 95;
    return 40; // fallback default
  };

  return (
    <div id="skills-gap-container" className="space-y-6">
      <div id="gap-header-box" className="bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-2xl shadow-blue-500/5 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800">Transferrable Skills & Critical Gaps</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Our advisor has audited your current profile to map complemental transferrable skills while highlightling core technical deficiencies you must actively close during your study hours.
          </p>
        </div>
      </div>

      <div id="skills-gap-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {skills.map((skill, idx) => {
          const currentPct = getLevelPercent(skill.currentLevel);
          const targetPct = getLevelPercent(skill.targetLevel);
          
          return (
            <motion.div
              id={`skill-card-${idx}`}
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xl shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all relative overflow-hidden"
            >
              <div id="skill-meta-row" className="flex items-center justify-between mb-3.5">
                <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${getCategoryStyles(skill.category)}`}>
                  {skill.category}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getImportanceStyles(skill.importance)}`}>
                  {skill.importance} Priority
                </span>
              </div>

              <div id="skill-content" className="space-y-3.5">
                <div>
                  <h4 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                    {skill.skillName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-light">
                    {skill.gapDescription}
                  </p>
                </div>

                {/* Level Gauge bars */}
                <div id="level-gauges" className="space-y-2.5 pt-3 border-t border-slate-100">
                  
                  {/* Current starting point */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-400">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-slate-300" /> Current Level:
                      </span>
                      <span className="font-bold text-slate-600">{skill.currentLevel}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-300 rounded-full transition-all duration-500"
                        style={{ width: `${currentPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Target level goal */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-400">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-blue-500" /> Target Job-Ready Level:
                      </span>
                      <span className="font-bold text-blue-600">{skill.targetLevel}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${targetPct}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
