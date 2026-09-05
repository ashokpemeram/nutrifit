import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Droplets, Scale, Plus, TrendingDown, Calendar, Check, Info } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const WaterAndWeightPage: React.FC = () => {
  const {
    dailyLog,
    profile,
    selectedDate,
    refreshDailyLog,
    weightSummary,
    refreshWeightLogs,
    showToast,
  } = useApp();

  const [customWaterMl, setCustomWaterMl] = useState('');
  const [newWeightKg, setNewWeightKg] = useState('');
  const [weightNotes, setWeightNotes] = useState('');
  const [isLogWeightOpen, setIsLogWeightOpen] = useState(false);

  const waterConsumedMl = dailyLog.waterIntakeMl || 0;
  const waterTargetMl = profile.waterTargetMl || 2500;
  const waterPct = Math.min(100, Math.round((waterConsumedMl / waterTargetMl) * 100));

  const handleAddWater = async (amount: number) => {
    await api.updateWater(selectedDate, amount, 'add');
    await refreshDailyLog();
    showToast(`Added +${amount}ml water! 💧`);
  };

  const handleCustomWaterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWaterMl) return;
    await api.updateWater(selectedDate, Number(customWaterMl), 'add');
    await refreshDailyLog();
    setCustomWaterMl('');
    showToast(`Added +${customWaterMl}ml water! 💧`);
  };

  const handleLogWeightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeightKg) return;

    await api.logWeight(selectedDate, Number(newWeightKg), weightNotes);
    await refreshWeightLogs();
    showToast(`Logged weight: ${newWeightKg} kg ⚖️`);
    setNewWeightKg('');
    setWeightNotes('');
    setIsLogWeightOpen(false);
  };

  const weightLogsData = weightSummary?.logs || [
    { date: '09-01', weightKg: 75.0, weeklyAverageKg: 75.0 },
    { date: '09-02', weightKg: 74.7, weeklyAverageKg: 74.85 },
    { date: '09-03', weightKg: 74.4, weeklyAverageKg: 74.7 },
    { date: '09-04', weightKg: 74.2, weeklyAverageKg: 74.57 },
    { date: '09-05', weightKg: 73.8, weeklyAverageKg: 74.42 },
  ];

  const summary = weightSummary?.summary || {
    startingWeightKg: 75.0,
    currentWeightKg: 73.8,
    targetWeightKg: 70.0,
    totalChangeKg: -1.2,
    remainingToTargetKg: 3.8,
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* 1. Water Tracker Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Droplets className="w-5 h-5 fill-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Daily Water Tracker</h2>
              <p className="text-xs text-slate-400">Target: {(waterTargetMl / 1000).toFixed(1)} Liters / day</p>
            </div>
          </div>
          <span className="text-sm font-extrabold text-cyan-400">{waterPct}%</span>
        </div>

        {/* Water Progress Gauge Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>{(waterConsumedMl / 1000).toFixed(2)} L</span>
            <span>{(waterTargetMl / 1000).toFixed(1)} L</span>
          </div>
          <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 shadow-md shadow-cyan-500/30"
              style={{ width: `${waterPct}%` }}
            />
          </div>
        </div>

        {/* Visual Glass Counter (1 glass = 250ml) */}
        <div className="flex items-center justify-center gap-2 py-2 overflow-x-auto">
          {Array.from({ length: 10 }).map((_, idx) => {
            const isFilled = (idx + 1) * 250 <= waterConsumedMl;
            return (
              <div
                key={idx}
                onClick={() => handleAddWater(250)}
                className={`w-7 h-10 rounded-b-lg border cursor-pointer transition-all flex items-end justify-center pb-1 ${
                  isFilled
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'
                }`}
                title={`Glass ${idx + 1} (250ml)`}
              >
                <Droplets className="w-3.5 h-3.5" />
              </div>
            );
          })}
        </div>

        {/* Quick Water Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleAddWater(250)}
            className="py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all"
          >
            +250 ml (1 Glass)
          </button>
          <button
            onClick={() => handleAddWater(500)}
            className="py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all"
          >
            +500 ml (1 Bottle)
          </button>

          <form onSubmit={handleCustomWaterSubmit} className="flex items-center gap-1">
            <input
              type="number"
              placeholder="+ Custom ml"
              value={customWaterMl}
              onChange={(e) => setCustomWaterMl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
            />
          </form>
        </div>
      </div>

      {/* 2. Weight Tracking & 7-Day Moving Average Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Body Weight Tracker</h2>
              <p className="text-xs text-slate-400">Track weight loss & 7-day weekly trend</p>
            </div>
          </div>

          <button
            onClick={() => setIsLogWeightOpen(!isLogWeightOpen)}
            className="px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Log Weight
          </button>
        </div>

        {/* Log Weight Form */}
        {isLogWeightOpen && (
          <form onSubmit={handleLogWeightSubmit} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 animate-slide-up">
            <h3 className="text-xs font-bold text-white">Log Weight for {selectedDate}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 74.5"
                  value={newWeightKg}
                  onChange={(e) => setNewWeightKg(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Morning, fasted..."
                  value={weightNotes}
                  onChange={(e) => setWeightNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all"
            >
              Save Weight Entry
            </button>
          </form>
        )}

        {/* Weight Metrics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Starting</div>
            <div className="text-base font-extrabold text-slate-200 mt-0.5">{summary.startingWeightKg} kg</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-indigo-500/30">
            <div className="text-[10px] text-indigo-400 uppercase font-semibold">Current</div>
            <div className="text-base font-extrabold text-white mt-0.5">{summary.currentWeightKg} kg</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Target Goal</div>
            <div className="text-base font-extrabold text-emerald-400 mt-0.5">{summary.targetWeightKg} kg</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Lost So Far</div>
            <div className="text-base font-extrabold text-teal-400 mt-0.5">
              {Math.abs(summary.totalChangeKg)} kg
            </div>
          </div>
        </div>

        {/* Line Chart showing Weight over time & Weekly Moving Average */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>Weight Progress & 7-Day Moving Average</span>
            <span className="text-[10px] text-indigo-400">Reduces daily fluctuation noise</span>
          </div>

          <div className="h-56 w-full bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightLogsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="weightKg" name="Daily Weight (kg)" stroke="#818cf8" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="weeklyAverageKg" name="7-Day Avg (kg)" stroke="#34d399" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
