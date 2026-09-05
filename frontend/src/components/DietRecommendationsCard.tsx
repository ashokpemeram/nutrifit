import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Plus, AlertCircle, Info } from 'lucide-react';

export const DietRecommendationsCard: React.FC = () => {
  const { dailyLog, profile, setIsQuickAddOpen, setQuickAddMealType } = useApp();

  const consumed = dailyLog.totalCaloriesConsumed || 0;
  const target = profile.calorieTarget || 2000;
  const remaining = target - consumed;

  const proteinConsumed = dailyLog.totalProteinG || 0;
  const proteinTarget = profile.proteinTargetG || 120;
  const proteinGap = proteinTarget - proteinConsumed;

  let recommendationTitle = '';
  let recommendationMessage = '';
  let suggestedFoods: { name: string; calories: number; protein: number; portion: string }[] = [];

  if (remaining <= 0 && proteinGap > 20) {
    recommendationTitle = 'Calorie target reached, but low on protein';
    recommendationMessage =
      'You have hit your daily calorie target, but are still under your protein goal. Consider a light high-protein snack if hungry.';
    suggestedFoods = [
      { name: 'Egg White (Boiled)', calories: 34, protein: 7.2, portion: '2 whites' },
      { name: 'Plain Curd / Dahi', calories: 67, protein: 3.7, portion: '1 cup' },
      { name: 'Grilled Chicken Breast', calories: 82, protein: 15.5, portion: '50g' },
    ];
  } else if (remaining > 300) {
    recommendationTitle = `You have ${remaining} kcal remaining today`;
    if (proteinGap > 30) {
      recommendationMessage = 'Prioritizing protein to meet your muscle & weight loss goals:';
      suggestedFoods = [
        { name: 'Boiled Eggs', calories: 156, protein: 12.6, portion: '2 pieces' },
        { name: 'Plain Curd / Dahi', calories: 100, protein: 5.5, portion: '1 bowl' },
        { name: 'Roasted Peanuts', calories: 165, protein: 7.3, portion: '1 handful' },
        { name: 'Banana', calories: 105, protein: 1.3, portion: '1 medium' },
      ];
    } else {
      recommendationMessage = 'Balanced options to complete your daily target:';
      suggestedFoods = [
        { name: 'Upma', calories: 210, protein: 4.5, portion: '1 bowl' },
        { name: 'Plain Dosa', calories: 130, protein: 3.5, portion: '1 piece' },
        { name: 'Almonds', calories: 160, protein: 6.0, portion: '10-12 pcs' },
      ];
    }
  } else {
    recommendationTitle = 'Great job staying on target today!';
    recommendationMessage = 'You are within your daily calorie range. Keep hydrated and get good rest.';
    suggestedFoods = [
      { name: 'Water / Green Tea', calories: 0, protein: 0, portion: '1 glass' },
      { name: 'Apple', calories: 95, protein: 0.5, portion: '1 piece' },
    ];
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-300" /> Smart Diet Recommendations
        </div>
        <span className="text-[10px] text-slate-500 font-medium uppercase">Personalized</span>
      </div>

      <div className="text-xs text-slate-200 font-semibold">{recommendationTitle}</div>
      <p className="text-xs text-slate-400">{recommendationMessage}</p>

      {/* Suggested Foods Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {suggestedFoods.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              setQuickAddMealType('Snacks');
              setIsQuickAddOpen(true);
            }}
            className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300">{item.name}</div>
              <div className="text-[10px] text-slate-400">
                {item.portion} • P: {item.protein}g
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400">{item.calories} kcal</span>
              <Plus className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Non-medical Disclaimer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-slate-500">
        <Info className="w-3 h-3 text-slate-400 shrink-0" />
        <span>Calorie and nutrition estimates are approximate. Not medical advice.</span>
      </div>
    </div>
  );
};
