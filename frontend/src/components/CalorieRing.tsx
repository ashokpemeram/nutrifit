import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Award, AlertCircle } from 'lucide-react';

export const CalorieRing: React.FC = () => {
  const { dailyLog, profile, totalExerciseCal } = useApp();

  const consumed = dailyLog.totalCaloriesConsumed || 0;
  const target = profile.calorieTarget || 2000;
  const remaining = target - consumed;
  const percentage = Math.min(100, Math.round((consumed / target) * 100));

  // Circular SVG math
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let motivationMessage = '';
  let motivationColor = 'text-emerald-400';

  if (remaining < 0) {
    motivationMessage = `You are ${Math.abs(remaining)} kcal over target today.`;
    motivationColor = 'text-rose-400';
  } else if (remaining === 0) {
    motivationMessage = 'Bullseye! Perfect calorie target hit!';
    motivationColor = 'text-emerald-400';
  } else if (percentage >= 80) {
    motivationMessage = `You're on track today. ${remaining} kcal remaining.`;
    motivationColor = 'text-emerald-400';
  } else {
    motivationMessage = `You have ${remaining} kcal remaining today.`;
    motivationColor = 'text-teal-400';
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center justify-center text-center">
        {/* Ring Gauge Container */}
        <div className="relative w-52 h-52 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background Track */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className="text-slate-800"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className={`${remaining < 0 ? 'text-rose-500' : 'text-emerald-400'} transition-all duration-1000 ease-out`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-emerald-400" /> Consumed
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
              {consumed.toLocaleString()}{' '}
              <span className="text-sm font-semibold text-slate-400">kcal</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Target: <span className="text-slate-200 font-bold">{target.toLocaleString()}</span> kcal
            </div>
          </div>
        </div>

        {/* Stats Row Below Ring */}
        <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Consumed</span>
            <span className="text-sm font-bold text-slate-100">{consumed} kcal</span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Remaining</span>
            <span className={`text-sm font-extrabold ${remaining < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {remaining} kcal
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Burned</span>
            <span className="text-sm font-bold text-teal-400">+{totalExerciseCal} kcal</span>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="mt-4 px-4 py-2 bg-slate-800/50 border border-slate-800 rounded-full flex items-center gap-2">
          {remaining < 0 ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className={`text-xs font-semibold ${motivationColor}`}>{motivationMessage}</span>
        </div>
      </div>
    </div>
  );
};
