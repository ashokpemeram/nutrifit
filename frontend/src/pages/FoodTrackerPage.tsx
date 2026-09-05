import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MealItem } from '../types';
import { Utensils, Plus, Trash2, Copy, Flame, Shield, Zap, Droplet, Star, Camera } from 'lucide-react';

export const FoodTrackerPage: React.FC = () => {
  const {
    dailyLog,
    selectedDate,
    refreshDailyLog,
    setIsQuickAddOpen,
    setQuickAddMealType,
    setIsPhotoScannerOpen,
    showToast,
  } = useApp();

  const [duplicatingMeal, setDuplicatingMeal] = useState<string | null>(null);

  const mealTypes = [
    { name: 'Breakfast', icon: '🍳', section: dailyLog.meals.Breakfast },
    { name: 'Lunch', icon: '🍛', section: dailyLog.meals.Lunch },
    { name: 'Dinner', icon: '🍗', section: dailyLog.meals.Dinner },
    { name: 'Snacks', icon: '🍎', section: dailyLog.meals.Snacks },
  ];

  const handleDeleteItem = async (mealType: string, itemId: string, itemName: string) => {
    await api.deleteMealItem(selectedDate, mealType, itemId);
    await refreshDailyLog();
    showToast(`Removed ${itemName} from ${mealType}`);
  };

  const handleDuplicateYesterday = async (mealType: string) => {
    setDuplicatingMeal(mealType);

    const prevDateObj = new Date(selectedDate);
    prevDateObj.setDate(prevDateObj.getDate() - 1);
    const prevDateStr = prevDateObj.toISOString().split('T')[0];

    try {
      await api.addMealItem; // Ensure client ready
      await api.getDailyLog(prevDateStr).then(async (prevLog) => {
        const itemsToCopy = prevLog.meals[mealType as keyof typeof prevLog.meals]?.items;

        if (itemsToCopy && itemsToCopy.length > 0) {
          for (const item of itemsToCopy) {
            await api.addMealItem(selectedDate, mealType, {
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
              portionSizeName: item.portionSizeName,
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat,
              fiber: item.fiber,
            });
          }
          await refreshDailyLog();
          showToast(`Duplicated yesterday's ${mealType} (${itemsToCopy.length} items)!`);
        } else {
          showToast(`No items logged for ${mealType} on ${prevDateStr}`);
        }
      });
    } catch (e) {
      showToast('Could not duplicate meal from previous date.');
    } finally {
      setDuplicatingMeal(null);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-400" /> Daily Food Log
          </h2>
          <p className="text-xs text-slate-400">Log Breakfast, Lunch, Dinner & Snacks</p>
        </div>

        <button
          onClick={() => setIsPhotoScannerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
        >
          <Camera className="w-4 h-4" /> AI Photo Scan
        </button>
      </div>

      {/* Daily Totals Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Calories</div>
          <div className="text-lg font-extrabold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
            <Flame className="w-4 h-4 fill-emerald-400" /> {dailyLog.totalCaloriesConsumed || 0} kcal
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Protein</div>
          <div className="text-base font-extrabold text-blue-400 mt-0.5">
            {dailyLog.totalProteinG || 0}g
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Carbs</div>
          <div className="text-base font-extrabold text-amber-400 mt-0.5">
            {dailyLog.totalCarbsG || 0}g
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Fat</div>
          <div className="text-base font-extrabold text-pink-400 mt-0.5">
            {dailyLog.totalFatG || 0}g
          </div>
        </div>
      </div>

      {/* Meals Sections */}
      <div className="space-y-4">
        {mealTypes.map((m) => {
          const items = m.section?.items || [];
          const mealTotalCal = m.section?.totalCalories || 0;

          return (
            <div key={m.name} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
              {/* Meal Section Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-white">{m.name}</h3>
                    <div className="text-xs text-emerald-400 font-extrabold">{mealTotalCal} kcal</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDuplicateYesterday(m.name)}
                    disabled={duplicatingMeal === m.name}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                    title="Duplicate previous day's food"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Duplicate</span>
                  </button>

                  <button
                    onClick={() => {
                      setQuickAddMealType(m.name);
                      setIsQuickAddOpen(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Log Food
                  </button>
                </div>
              </div>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs italic">
                  No foods logged for {m.name} yet. Tap "+ Log Food" or "AI Photo Scan" to add items.
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item: MealItem) => (
                    <div
                      key={item._id || item.name}
                      className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between text-xs group hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          {item.name}
                          {item.portionSizeName && (
                            <span className="text-[9px] bg-amber-500/10 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/20">
                              {item.portionSizeName}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.quantity} {item.unit} • P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g | Fib: {item.fiber}g
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right font-extrabold text-emerald-400 text-sm">
                          {item.calories} kcal
                        </div>
                        <button
                          onClick={() => handleDeleteItem(m.name, item._id || '', item.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-70 group-hover:opacity-100"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
