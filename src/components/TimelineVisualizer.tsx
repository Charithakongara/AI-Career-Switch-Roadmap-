import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, Circle, Clock, ExternalLink, ChevronDown, ChevronUp, 
  BookOpen, Projector, HelpCircle, Award, CheckSquare, ListTodo 
} from "lucide-react";
import { RoadmapPhase, Topic, Milestone } from "../types";

interface TimelineVisualizerProps {
  roadmapId: string;
  phases: RoadmapPhase[];
  completedMap: { [key: string]: boolean };
  onToggleItem: (itemId: string) => void;
}

export default function TimelineVisualizer({
  roadmapId,
  phases,
  completedMap,
  onToggleItem
}: TimelineVisualizerProps) {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  const toggleTopic = (topicId: string) => {
    setExpandedTopicId(prev => (prev === topicId ? null : topicId));
  };

  const getPhaseCompletion = (phase: RoadmapPhase) => {
    let totalItems = 0;
    let completedItems = 0;

    phase.topics.forEach(t => {
      totalItems++;
      if (completedMap[`${roadmapId}_topic_${t.id}`]) completedItems++;
    });

    phase.milestones.forEach(m => {
      m.checklist.forEach((_, idx) => {
        totalItems++;
        if (completedMap[`${roadmapId}_ms_${m.id}_${idx}`]) completedItems++;
      });
    });

    return totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  };

  return (
    <div id="timeline-visualizer-container" className="space-y-8">
      {/* Phases tabs selector */}
      <div id="phases-tabs-container" className="flex flex-wrap gap-2.5 border-b border-slate-100 pb-4">
        {phases.map((phase, idx) => {
          const isSelected = activePhaseIndex === idx;
          const pct = getPhaseCompletion(phase);
          
          return (
            <button
              id={`phase-tab-btn-${idx}`}
              key={phase.phaseNumber}
              onClick={() => {
                setActivePhaseIndex(idx);
                setExpandedTopicId(null);
              }}
              className={`flex-1 min-w-[200px] text-left p-4 rounded-2xl border transition-all ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/10"
                  : "bg-white text-slate-700 border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                  isSelected ? "bg-blue-500 text-blue-50" : "bg-slate-100 text-slate-500"
                }`}>
                  Phase {phase.phaseNumber}
                </span>
                <span className="text-xs font-bold font-mono">
                  {pct}% Done
                </span>
              </div>
              <h4 className="text-sm font-bold truncate mt-1">{phase.title}</h4>
              <p className={`text-xs mt-0.5 font-medium ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                Duration: {phase.durationWeeks} {phase.durationWeeks === 1 ? "week" : "weeks"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail View */}
      {phases[activePhaseIndex] && (
        <motion.div
          id={`phase-detail-card-${activePhaseIndex}`}
          key={activePhaseIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Topics and Resources Section */}
          <div id="topics-and-syllabus" className="lg:col-span-7 space-y-6">
            <div id="phase-meta-summary" className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Active Curriculum Strategy</span>
              <h3 className="text-xl font-bold text-slate-800 font-display">
                Phase {phases[activePhaseIndex].phaseNumber}: {phases[activePhaseIndex].title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-light">
                {phases[activePhaseIndex].description}
              </p>
            </div>

            <div id="syllabus-topics-list" className="space-y-4 pt-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-blue-500" /> Recommended Core Topics
              </h4>

              {phases[activePhaseIndex].topics.map((topic) => {
                const isExpanded = expandedTopicId === topic.id;
                const isCompleted = completedMap[`${roadmapId}_topic_${topic.id}`];

                return (
                  <div
                    id={`topic-item-${topic.id}`}
                    key={topic.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isCompleted 
                        ? "bg-slate-50/40 border-slate-200/60" 
                        : "bg-white border-slate-100 shadow-xl shadow-blue-550/5"
                    }`}
                  >
                    {/* Header trigger */}
                    <div
                      id={`topic-trigger-${topic.id}`}
                      onClick={() => toggleTopic(topic.id)}
                      className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          id={`btn-complete-topic-${topic.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleItem(`${roadmapId}_topic_${topic.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-700 focus:outline-none"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5.5 w-5.5 fill-blue-50 text-blue-600" />
                          ) : (
                            <Circle className="h-5.5 w-5.5 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>
                        
                        <div>
                          <h5 className={`text-sm font-bold ${isCompleted ? "text-slate-400 line-through" : "text-slate-800"}`}>
                            {topic.name}
                          </h5>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-slate-300" />
                              {topic.estimatedHours} study hours
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>

                    {/* Extended collapse details */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-slate-100 bg-slate-50/30"
                        >
                          <div className="p-5 space-y-4">
                            <p className="text-xs text-slate-550 leading-relaxed font-light">
                              {topic.description}
                            </p>

                            {/* Resource Links inside topic */}
                            <div className="space-y-2">
                              <h6 className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">
                                Curated learning materials
                              </h6>
                              
                              <div className="space-y-2">
                                {topic.resources.map((resource, resIdx) => (
                                  <div
                                    key={resIdx}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm gap-3"
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold text-slate-800">
                                          {resource.title}
                                        </span>
                                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                                          resource.isFree 
                                            ? "bg-emerald-50 text-emerald-700" 
                                            : "bg-blue-50 text-blue-700"
                                        }`}>
                                          {resource.priceEst}
                                        </span>
                                      </div>
                                      {resource.description && (
                                        <p className="text-xs text-slate-400 font-light">{resource.description}</p>
                                      )}
                                    </div>

                                    <a
                                      href={resource.url.startsWith("http") ? resource.url : `https://${resource.url}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      referrerPolicy="no-referrer"
                                      className="inline-flex items-center justify-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 shrink-0"
                                    >
                                      <span>Go to Resource</span>
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase Milestones & Portfolio Deliverables Section */}
          <div id="milestones-and-portfolio" className="lg:col-span-5 space-y-6">
            
            {/* Practical Deliverable Box */}
            {phases[activePhaseIndex].milestones[0]?.deliverable && (
              <div id="deliverable-highlight-card" className="bg-slate-50 rounded-2xl border border-slate-100 p-5 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
                <div className="flex items-center gap-2 text-blue-600 mb-2.5">
                  <Award className="h-5 w-5 text-blue-600" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wide">Phase Portfolio Deliverable</h4>
                </div>
                <h5 className="text-sm font-bold text-slate-800">
                  {phases[activePhaseIndex].milestones[0].deliverable}
                </h5>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                  Complete this specific artifact to prove your technical capabilities. Host this directly in your repository to build an employer-facing showcase portfolio.
                </p>
              </div>
            )}

            {/* Checklists */}
            <div id="milestone-checklist-box" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xl shadow-blue-500/5 space-y-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-50 pb-3">
                <ListTodo className="h-4 w-4 text-blue-500" /> Milestone Checklists
              </h4>

              {phases[activePhaseIndex].milestones.map((milestone) => (
                <div id={`milestone-block-${milestone.id}`} key={milestone.id} className="space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {milestone.title}
                  </h5>

                  <div className="space-y-2.5">
                    {milestone.checklist.map((task, taskIdx) => {
                      const itemId = `${roadmapId}_ms_${milestone.id}_${taskIdx}`;
                      const isTaskCompleted = completedMap[itemId];

                      return (
                        <div
                          key={taskIdx}
                          id={`checklist-task-${milestone.id}-${taskIdx}`}
                          onClick={() => onToggleItem(itemId)}
                          className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition select-none"
                        >
                          <div className="shrink-0 mt-0.5 text-blue-600">
                            {isTaskCompleted ? (
                              <CheckSquare className="h-4.5 w-4.5 fill-blue-50 text-blue-600" />
                            ) : (
                              <div className="h-4.5 w-4.5 rounded border border-slate-200 bg-white" />
                            )}
                          </div>
                          <span className={`text-xs ${isTaskCompleted ? "text-slate-400 line-through" : "text-slate-600"}`}>
                            {task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
}
