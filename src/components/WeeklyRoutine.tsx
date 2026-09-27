import { Calendar, Clock, AlertCircle } from "lucide-react";
import { WeeklySchedule } from "../types";

interface WeeklyRoutineProps {
  schedule: WeeklySchedule;
}

export default function WeeklyRoutine({ schedule }: WeeklyRoutineProps) {
  return (
    <div id="weekly-routine-container" className="space-y-6">
      <div id="routine-overview-card" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xl shadow-blue-500/5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800">Recommended Pacing Strategy</h4>
            <p className="text-xs sm:text-sm text-slate-550 leading-relaxed font-light">
              {schedule.suggestedRoutine}
            </p>
          </div>
        </div>
      </div>

      <div id="daily-schedule-card" className="bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-blue-500/5 overflow-hidden">
        <div className="bg-white border-b border-slate-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Suggested Weekly Agenda</h4>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Customized Pacing</span>
        </div>

        <div className="divide-y divide-slate-50">
          {schedule.dailyBreakdown.map((day, idx) => (
            <div 
              key={idx}
              id={`routine-day-${idx}`}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm font-bold text-slate-800 w-24 sm:w-28 shrink-0">
                  {day.weekday}
                </span>
                <span className="text-xs text-slate-500 font-light">
                  {day.focus}
                </span>
              </div>
              
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-mono font-bold px-2.5 py-1 rounded-lg shrink-0 w-fit self-end sm:self-auto">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{day.hours} {day.hours === 1 ? "hour" : "hours"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="routine-tip" className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed font-light">
          <strong className="font-bold text-slate-700">Switch Tip:</strong> Consistency is far more valuable than marathon cram sessions. Carving out 1-2 hours daily keeps the neurological muscle memory active, leading to 3x higher retention.
        </p>
      </div>
    </div>
  );
}
