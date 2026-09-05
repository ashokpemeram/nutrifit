import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Zap, Droplet, Leaf } from 'lucide-react';

export const MacroCards: React.FC = () => {
  const { dailyLog, profile } = useApp();

  const macros = [
    {
      label: 'Protein',
      current: dailyLog.totalProteinG || 0,
      target: profile.proteinTargetG || 120,
      unit: 'g',
      color: 'from-blue-500 to-indigo-500',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      icon: Shield,
    },
    {
      label: 'Carbs',
      current: dailyLog.totalCarbsG || 0,
      target: profile.carbTargetG || 220,
      unit: 'g',
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      icon: Zap,
    },
    {
      label: 'Fat',
      current: dailyLog.totalFatG || 0,
      target: profile.fatTargetG || 65,
      unit: 'g',
      color: 'from-pink-500 to-rose-500',
      textColor: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30',
      icon: Droplet,
    },
    {
      label: 'Fiber',
      current: dailyLog.totalFiberG || 0,
      target: profile.fiberTargetG || 30,
      unit: 'g',
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      icon: Leaf,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {macros.map((m) => {
        const Icon = m.icon;
        const pct = Math.min(100, Math.round((m.current / m.target) * 100));

        return (
          <div
            key={m.label}
            className={`bg-slate-900/90 border ${m.borderColor} rounded-2xl p-3.5 shadow-lg flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={`p-1.5 rounded-lg ${m.bgColor}`}>
                  <Icon className={`w-3.5 h-3.5 ${m.textColor}`} />
                </div>
                <span className="text-xs font-bold text-slate-200">{m.label}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">{pct}%</span>
            </div>

            <div className="my-2">
              <div className="text-base font-extrabold text-white">
                {m.current}
                <span className="text-xs font-medium text-slate-400">
                  {' '}/ {m.target} {m.unit}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${m.color} transition-all duration-700 ease-out`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
