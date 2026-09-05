import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { FoodItem } from '../types';
import { Search, X, Plus, Star, Utensils, Check, Flame } from 'lucide-react';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    quickAddMealType,
    setQuickAddMealType,
    selectedDate,
    refreshDailyLog,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'search' | 'frequent' | 'custom'>('search');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<string>('serving');

  // Custom Food Form state
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Custom');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [customFiber, setCustomFiber] = useState('');

  // Fetch foods on search query or category change
  useEffect(() => {
    if (isQuickAddOpen) {
      api.getFoods(query, selectedCategory).then((data) => {
        setFoods(data);
      });
    }
  }, [query, selectedCategory, isQuickAddOpen]);

  if (!isQuickAddOpen) return null;

  const categories = ['All', 'South Indian', 'Rice & Meals', 'Protein', 'Snacks'];
  const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setSelectedUnit(food.defaultUnit || 'serving');
    setQuantity(1);
  };

  const calculateCalculatedValues = () => {
    if (!selectedFood) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    const baseMult = quantity;
    return {
      calories: Math.round(selectedFood.calories * baseMult),
      protein: Math.round(selectedFood.protein * baseMult * 10) / 10,
      carbs: Math.round(selectedFood.carbs * baseMult * 10) / 10,
      fat: Math.round(selectedFood.fat * baseMult * 10) / 10,
      fiber: Math.round(selectedFood.fiber * baseMult * 10) / 10,
    };
  };

  const calculated = calculateCalculatedValues();

  const handleAddFoodToMeal = async () => {
    if (!selectedFood) return;

    const portionName = `${quantity} ${selectedUnit}`;

    await api.addMealItem(selectedDate, quickAddMealType, {
      foodId: selectedFood._id,
      name: selectedFood.name,
      quantity,
      unit: selectedUnit,
      portionSizeName: portionName,
      calories: calculated.calories,
      protein: calculated.protein,
      carbs: calculated.carbs,
      fat: calculated.fat,
      fiber: calculated.fiber,
    });

    await refreshDailyLog();
    showToast(`Added ${quantity}x ${selectedFood.name} (${calculated.calories} kcal) to ${quickAddMealType}`);
    setSelectedFood(null);
    setIsQuickAddOpen(false);
  };

  const handleSaveCustomFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customCalories) return;

    const created = await api.createCustomFood({
      name: customName,
      category: customCategory as any,
      defaultUnit: 'serving',
      calories: Number(customCalories),
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fat: Number(customFat) || 0,
      fiber: Number(customFiber) || 0,
      isIndian: true,
    });

    showToast(`Created custom food: ${created.name}`);
    setSelectedFood(created);
    setActiveTab('search');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log Food Item</h2>
              <p className="text-xs text-slate-400">Fast logging for your daily meals</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedFood(null);
              setIsQuickAddOpen(false);
            }}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Type Selector Bar */}
        <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between gap-1 overflow-x-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase mr-2">Meal:</span>
          {mealOptions.map((m) => (
            <button
              key={m}
              onClick={() => setQuickAddMealType(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                quickAddMealType === m
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Selected Food Detail / Quantity Configurator Overlay */}
        {selectedFood ? (
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {selectedFood.category}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{selectedFood.name}</h3>
              </div>
              <button
                onClick={() => setSelectedFood(null)}
                className="text-xs text-slate-400 underline hover:text-slate-200"
              >
                Change Food
              </button>
            </div>

            {/* Quantity Config */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-semibold text-slate-300">Set Quantity</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                    className="px-3 py-2 text-lg font-bold text-slate-300 hover:bg-slate-700"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0.1, Number(e.target.value)))}
                    className="w-14 text-center bg-transparent font-extrabold text-white text-base focus:outline-none"
                    step="0.5"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 0.5)}
                    className="px-3 py-2 text-lg font-bold text-slate-300 hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>

                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 font-medium focus:outline-none"
                >
                  <option value="piece">piece(s)</option>
                  <option value="serving">serving</option>
                  <option value="bowl">bowl</option>
                  <option value="plate">plate</option>
                  <option value="cup">cup</option>
                  <option value="handful">handful</option>
                  <option value="100g">100g</option>
                  <option value="tablespoon">tbsp</option>
                  <option value="teaspoon">tsp</option>
                </select>
              </div>
            </div>

            {/* Live Calculated Macro Summary */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-xs font-semibold text-slate-400">Total Calculated Calories</span>
                <span className="text-xl font-extrabold text-emerald-400 flex items-center gap-1">
                  <Flame className="w-5 h-5 fill-emerald-400" /> {calculated.calories} kcal
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/20">
                  <div className="text-[10px] text-blue-400 font-medium">Protein</div>
                  <div className="font-bold text-white mt-0.5">{calculated.protein}g</div>
                </div>
                <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                  <div className="text-[10px] text-amber-400 font-medium">Carbs</div>
                  <div className="font-bold text-white mt-0.5">{calculated.carbs}g</div>
                </div>
                <div className="bg-pink-500/10 p-2 rounded-xl border border-pink-500/20">
                  <div className="text-[10px] text-pink-400 font-medium">Fat</div>
                  <div className="font-bold text-white mt-0.5">{calculated.fat}g</div>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                  <div className="text-[10px] text-emerald-400 font-medium">Fiber</div>
                  <div className="font-bold text-white mt-0.5">{calculated.fiber}g</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddFoodToMeal}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold py-3.5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Check className="w-5 h-5 stroke-[3]" /> Add to {quickAddMealType}
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Search Tabs & Input */}
            <div className="p-4 border-b border-slate-800 space-y-3">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 'Dosa', 'Egg', 'Rice', 'Chicken'..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent w-full text-xs text-white placeholder-slate-500 focus:outline-none"
                  autoFocus
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Categories Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                      selectedCategory === c
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {foods.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <p>No matching foods found for "{query}".</p>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className="mt-3 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold"
                  >
                    + Create Custom Food Item
                  </button>
                </div>
              ) : (
                foods.map((food) => (
                  <div
                    key={food._id || food.name}
                    onClick={() => handleSelectFood(food)}
                    className="bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/40 p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {food.name}
                        </span>
                        {food.isIndian && (
                          <span className="text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-medium">
                            Indian
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {food.category} • P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-emerald-400">{food.calories} kcal</div>
                        <div className="text-[10px] text-slate-400">per {food.defaultUnit || 'serving'}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center text-slate-400 transition-all">
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
