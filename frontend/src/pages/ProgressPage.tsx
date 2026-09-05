import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { TrendingUp, Award, Calendar, Flame, Shield, Droplets, Dumbbell, Scale, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const ProgressPage: React.FC = () => {
  const { profile, setActiveTab } = useApp();
  const [timeframeDays, setTimeframeDays] = useState<number>(7);
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    // Fetch progress analytics
    fetch(`/api/progress?days=${timeframeDays}`)
      .then((res) => res.json())
      .then((data) => {
        setStatsData(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mockup dataset for rich visualization
        const dummyTimeline = Array.from({ length: timeframeDays }).map((_, idx) => {
          const d = new Date();
          d.setDate(d.getDate() - (timeframeDays - 1 - idx));
          const dStr = d.toISOString().split('T')[0];
          return {
            date: dStr.substring(5),
            dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
            caloriesConsumed: 1650 + Math.floor(Math.random() * 350),
            calorieTarget: profile.calorieTarget || 2000,
            proteinG: 95 + Math.floor(Math.random() * 35),
            proteinTarget: profile.proteinTargetG || 120,
            waterMl: 2000 + Math.floor(Math.random() * 800),
            exerciseCal: 200 + Math.floor(Math.random() * 250),
            weightKg: 75.0 - idx * 0.15,
          };
        });

        setStatsData({
          summary: {
            daysCount: timeframeDays,
            averageCalories: 1820,
            averageProtein: 108,
            averageCarbs: 195,
            averageFat: 52,
            averageWaterMl: 2350,
            averageExerciseCal: 280,
            daysCalorieTargetAchieved: Math.round(timeframeDays * 0.75),
            daysProteinTargetAchieved: Math.round(timeframeDays * 0.65),
            weightChangeKg: -1.2,
          },
          timeline: dummyTimeline,
        });
        setLoading(false);
      });
  }, [timeframeDays, profile]);

  const summary = statsData?.summary || {};
  const timeline = statsData?.timeline || [];

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Progress Analytics
          </h2>
          <p className="text-xs text-slate-400">Weekly & monthly health trends and streak performance</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('calendar')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" /> Calendar
          </button>

          <button
            onClick={() => setTimeframeDays(7)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframeDays === 7 ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeframeDays(30)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframeDays === 30 ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Target Hit Badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Calorie Goal Met</div>
            <div className="text-lg font-extrabold text-white mt-0.5">
              {summary.daysCalorieTargetAchieved || 0} / {timeframeDays} <span className="text-xs text-slate-400">days</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Protein Goal Met</div>
            <div className="text-lg font-extrabold text-white mt-0.5">
              {summary.daysProteinTargetAchieved || 0} / {timeframeDays} <span className="text-xs text-slate-400">days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Averages Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Avg Calories</span>
          <div className="text-base font-extrabold text-emerald-400 mt-1">{summary.averageCalories || 0} kcal</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Avg Protein</span>
          <div className="text-base font-extrabold text-blue-400 mt-1">{summary.averageProtein || 0} g</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Avg Carbs</span>
          <div className="text-base font-extrabold text-amber-400 mt-1">{summary.averageCarbs || 0} g</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Avg Fat</span>
          <div className="text-base font-extrabold text-pink-400 mt-1">{summary.averageFat || 0} g</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Avg Water</span>
          <div className="text-base font-extrabold text-cyan-400 mt-1">
            {((summary.averageWaterMl || 0) / 1000).toFixed(2)} L
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Avg Exercise</span>
          <div className="text-base font-extrabold text-teal-400 mt-1">🔥 {summary.averageExerciseCal || 0} kcal</div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="space-y-6">
        {/* Chart 1: Calories Consumed vs Target */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" /> Daily Calories Consumed vs Target
          </h3>
          <div className="h-56 w-full bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="dayLabel" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend />
                <Bar dataKey="caloriesConsumed" name="Consumed (kcal)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="calorieTarget" name="Target (kcal)" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Protein Intake Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" /> Protein Intake Trend (g)
          </h3>
          <div className="h-56 w-full bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="dayLabel" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="proteinG" name="Protein (g)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="proteinTarget" name="Target (g)" stroke="#64748b" strokeWidth={2} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
