import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Target, CheckCircle2, Bell, Shield, Droplets, Dumbbell, Scale, Flame } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { profile, updateProfile, showToast } = useApp();

  const [goalsList, setGoalsList] = useState([
    { id: '1', title: 'Reach Target Weight (70 kg)', category: 'Weight', target: 70, current: profile.currentWeightKg || 73.8, unit: 'kg', isCompleted: false },
    { id: '2', title: 'Stay Below Calorie Target (2,000 kcal)', category: 'Calorie', target: profile.calorieTarget || 2000, current: 1850, unit: 'kcal', isCompleted: true },
    { id: '3', title: 'Eat Enough Protein Daily (120g)', category: 'Protein', target: profile.proteinTargetG || 120, current: 108, unit: 'g', isCompleted: false },
    { id: '4', title: 'Drink Daily Water Goal (2.5L)', category: 'Water', target: (profile.waterTargetMl || 2500) / 1000, current: 2.25, unit: 'L', isCompleted: false },
    { id: '5', title: 'Exercise 4 Days / Week', category: 'Exercise', target: 4, current: 3, unit: 'days', isCompleted: false },
  ]);

  const [notifications, setNotifications] = useState({
    breakfastReminder: true,
    lunchReminder: true,
    dinnerReminder: true,
    waterReminder: true,
    exerciseReminder: true,
    weightReminder: true,
  });

  const toggleGoal = (id: string) => {
    setGoalsList((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isCompleted: !g.isCompleted } : g))
    );
    showToast('Goal status updated!');
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    showToast('Notification settings saved!');
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" /> Active Fitness Goals & Reminders
        </h2>
        <p className="text-xs text-slate-400">Track progress toward weight loss, protein, water and workout milestones</p>
      </div>

      {/* Goals Tracker List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200">Personal Milestones</h3>
        <div className="space-y-2.5">
          {goalsList.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));

            return (
              <div
                key={g.id}
                onClick={() => toggleGoal(g.id)}
                className={`bg-slate-900/90 border ${
                  g.isCompleted ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
                } rounded-2xl p-4 cursor-pointer transition-all hover:border-slate-700 flex flex-col justify-between space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                        g.isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-700 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h4 className={`text-sm font-bold ${g.isCompleted ? 'text-emerald-300 line-through' : 'text-white'}`}>
                      {g.title}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-amber-400">{pct}%</span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Notifications Reminders */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bell className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Daily Reminders & Notifications</h3>
            <p className="text-xs text-slate-400">Receive optional logging reminders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: 'breakfastReminder', label: '🍳 Breakfast Logging Reminder' },
            { key: 'lunchReminder', label: '🍛 Lunch Logging Reminder' },
            { key: 'dinnerReminder', label: '🍗 Dinner Logging Reminder' },
            { key: 'waterReminder', label: '💧 Water Intake Hydration Alert' },
            { key: 'exerciseReminder', label: '🔥 Workout & Exercise Reminder' },
            { key: 'weightReminder', label: '⚖️ Morning Weight Check Reminder' },
          ].map((item) => {
            const isEnabled = notifications[item.key as keyof typeof notifications];
            return (
              <div
                key={item.key}
                onClick={() => toggleNotification(item.key as any)}
                className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
              >
                <span className="text-xs font-semibold text-slate-300">{item.label}</span>
                <div
                  className={`w-10 h-5 rounded-full transition-all relative p-0.5 ${
                    isEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-all ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
