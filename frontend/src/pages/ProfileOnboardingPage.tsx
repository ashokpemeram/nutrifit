import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateBMR, calculateTDEE, calculateTargets } from '../utils/calculations';
import { User, Flame, Shield, Zap, Droplet, Check, Edit3, Settings, Calculator } from 'lucide-react';

export const ProfileOnboardingPage: React.FC = () => {
  const { user, profile, updateProfile, showToast } = useApp();

  const [name, setName] = useState(user?.name || 'Alex Johnson');
  const [age, setAge] = useState(profile.age || 26);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(profile.gender || 'male');
  const [heightCm, setHeightCm] = useState(profile.heightCm || 175);
  const [currentWeightKg, setCurrentWeightKg] = useState(profile.currentWeightKg || 75);
  const [targetWeightKg, setTargetWeightKg] = useState(profile.targetWeightKg || 70);
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel || 'moderate');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>(profile.goal || 'lose');
  const [weeklyTargetKg, setWeeklyTargetKg] = useState(profile.weeklyTargetKg || 0.5);

  // Manual Calorie Target Override
  const [customCalorieTarget, setCustomCalorieTarget] = useState<string>(
    profile.customCalorieTarget ? String(profile.customCalorieTarget) : ''
  );

  const calculated = calculateTargets({
    currentWeightKg,
    heightCm,
    age,
    gender,
    activityLevel,
    goal,
    weeklyTargetKg,
    customCalorieTarget: customCalorieTarget ? Number(customCalorieTarget) : null,
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateProfile(
      {
        age: Number(age),
        gender,
        heightCm: Number(heightCm),
        currentWeightKg: Number(currentWeightKg),
        targetWeightKg: Number(targetWeightKg),
        activityLevel,
        goal,
        weeklyTargetKg: Number(weeklyTargetKg),
        customCalorieTarget: customCalorieTarget ? Number(customCalorieTarget) : null,
        bmr: calculated.bmr,
        tdee: calculated.tdee,
        calorieTarget: customCalorieTarget ? Number(customCalorieTarget) : (calculated.calorieTarget || 2000),
        proteinTargetG: calculated.proteinTargetG || 120,
        carbTargetG: calculated.carbTargetG || 220,
        fatTargetG: calculated.fatTargetG || 65,
        fiberTargetG: calculated.fiberTargetG || 30,
        waterTargetMl: calculated.waterTargetMl || 2500,
      },
      name
    );
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" /> User Profile & Calorie Target Calculator
        </h2>
        <p className="text-xs text-slate-400">Uses Mifflin-St Jeor equation to compute exact BMR, TDEE & macro goals</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Edit3 className="w-4 h-4 text-emerald-400" /> Personal Stats
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Gender</label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      gender === g
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentWeightKg}
                  onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Goal & Activity Level */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Calculator className="w-4 h-4 text-amber-400" /> Fitness Goal & Activity Level
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Primary Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'lose', label: 'Lose Weight' },
                { id: 'maintain', label: 'Maintain Weight' },
                { id: 'gain', label: 'Gain Weight' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id as any)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    goal === item.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Weekly Rate Target</label>
            <select
              value={weeklyTargetKg}
              onChange={(e) => setWeeklyTargetKg(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="0.25">0.25 kg / week (Gentle)</option>
              <option value="0.5">0.50 kg / week (Recommended)</option>
              <option value="0.75">0.75 kg / week (Active)</option>
              <option value="1.0">1.00 kg / week (Aggressive)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Daily Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="sedentary">Sedentary (Little or no exercise)</option>
              <option value="light">Lightly Active (1-3 days/week workout)</option>
              <option value="moderate">Moderately Active (3-5 days/week workout)</option>
              <option value="active">Very Active (6-7 days/week hard workout)</option>
              <option value="extra">Extra Active (Physical job or 2x daily training)</option>
            </select>
          </div>
        </div>

        {/* Calculated Results & Manual Override Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
            <span>Calculated Mifflin-St Jeor Results</span>
            <span className="text-emerald-400">BMR: {calculated.bmr} kcal | TDEE: {calculated.tdee} kcal</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-emerald-500/30">
              <div className="text-[10px] text-emerald-400 font-semibold uppercase">Calorie Target</div>
              <div className="font-extrabold text-white text-base mt-0.5">{calculated.calorieTarget} kcal</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-blue-500/30">
              <div className="text-[10px] text-blue-400 font-semibold uppercase">Protein</div>
              <div className="font-extrabold text-white text-base mt-0.5">{calculated.proteinTargetG} g</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-amber-500/30">
              <div className="text-[10px] text-amber-400 font-semibold uppercase">Carbs</div>
              <div className="font-extrabold text-white text-base mt-0.5">{calculated.carbTargetG} g</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-pink-500/30">
              <div className="text-[10px] text-pink-400 font-semibold uppercase">Fat</div>
              <div className="font-extrabold text-white text-base mt-0.5">{calculated.fatTargetG} g</div>
            </div>
          </div>

          {/* Manual Calorie Override */}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Manual Calorie Target Override (Optional)
            </label>
            <input
              type="number"
              placeholder={`Leave blank to use calculated ${calculated.calorieTarget} kcal`}
              value={customCalorieTarget}
              onChange={(e) => setCustomCalorieTarget(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold py-3.5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5 stroke-[3]" /> Save Profile & Recalculate Goals
        </button>
      </form>
    </div>
  );
};
