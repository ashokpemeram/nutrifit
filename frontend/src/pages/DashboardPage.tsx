import React from 'react';
import { useApp } from '../context/AppContext';
import { CalorieRing } from '../components/CalorieRing';
import { MacroCards } from '../components/MacroCards';
import { DietRecommendationsCard } from '../components/DietRecommendationsCard';
import { Utensils, Flame, Droplets, Scale, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const DashboardPage: React.FC = () => {
  const {
    user,
    profile,
    dailyLog,
    totalExerciseCal,
    weightSummary,
    setActiveTab,
    setIsQuickAddOpen,
    setQuickAddMealType,
    refreshDailyLog,
    selectedDate,
    showToast,
  } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const mealsList = [
    { type: 'Breakfast', icon: '🍳', section: dailyLog.meals.Breakfast },
    { type: 'Lunch', icon: '🍛', section: dailyLog.meals.Lunch },
    { type: 'Snacks', icon: '🍎', section: dailyLog.meals.Snacks },
    { type: 'Dinner', icon: '🍗', section: dailyLog.meals.Dinner },
  ];

  const waterConsumedL = ((dailyLog.waterIntakeMl || 0) / 1000).toFixed(2);
  const waterGoalL = ((profile.waterTargetMl || 2500) / 1000).toFixed(1);

  const handleQuickAddWater = async (amountMl: number) => {
    await api.updateWater(selectedDate, amountMl, 'add');
    await refreshDailyLog();
    showToast(`Added +${amountMl}ml water intake 💧`);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Top Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">{getGreeting()}</h2>
          <p className="text-xs text-slate-400">Track your daily food, calories & fitness progress</p>
        </div>
        <button
          onClick={() => setActiveTab('goals')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-xs font-semibold text-slate-300"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Goals
        </button>
      </div>

      {/* Main Circular Calorie Ring */}
      <CalorieRing />

      {/* Macro Cards Grid */}
      <MacroCards />

      {/* Today's Meals Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-400" /> Today's Meals
          </h3>
          <button
            onClick={() => setActiveTab('food')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {mealsList.map((m) => {
            const hasItems = m.section && m.section.items.length > 0;
            return (
              <div
                key={m.type}
                onClick={() => {
                  setQuickAddMealType(m.type);
                  setIsQuickAddOpen(true);
                }}
                className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{m.icon}</span>
                    <div className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center text-slate-400 transition-all">
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-2 group-hover:text-emerald-300">{m.type}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {hasItems
                      ? m.section.items.map((i) => i.name).join(', ')
                      : 'No items logged yet'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Total</span>
                  <span className="text-xs font-extrabold text-emerald-400">
                    {m.section?.totalCalories || 0} kcal
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fitness & Wellness Row (Exercise, Water, Weight) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Exercise Calories Card */}
        <div
          onClick={() => setActiveTab('exercise')}
          className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold">
              <Flame className="w-4 h-4 fill-teal-400" /> Exercise
            </div>
            <div className="text-lg font-extrabold text-white mt-1">
              🔥 {totalExerciseCal} <span className="text-xs font-normal text-slate-400">kcal</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Tap to log workout</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
            +
          </div>
        </div>

        {/* Water Intake Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                <Droplets className="w-4 h-4 fill-cyan-400" /> Water Intake
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                {waterConsumedL}L / {waterGoalL}L
              </span>
            </div>
            <div className="text-lg font-extrabold text-white mt-1">
              💧 {waterConsumedL} <span className="text-xs font-normal text-slate-400">Lters</span>
            </div>
          </div>

          <div className="flex gap-1.5 mt-3">
            <button
              onClick={() => handleQuickAddWater(250)}
              className="flex-1 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-[10px] font-bold transition-all"
            >
              +250ml
            </button>
            <button
              onClick={() => handleQuickAddWater(500)}
              className="flex-1 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-[10px] font-bold transition-all"
            >
              +500ml
            </button>
          </div>
        </div>

        {/* Weight Tracker Card */}
        <div
          onClick={() => setActiveTab('progress')}
          className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold">
              <Scale className="w-4 h-4" /> Current Weight
            </div>
            <div className="text-lg font-extrabold text-white mt-1">
              ⚖️ {weightSummary?.summary?.currentWeightKg || profile.currentWeightKg || 75}{' '}
              <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Target: {profile.targetWeightKg || 70} kg
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
        </div>
      </div>

      {/* Smart Diet Recommendations */}
      <DietRecommendationsCard />
    </div>
  );
};
