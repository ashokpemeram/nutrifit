import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Dumbbell, Flame, Plus, Trash2, Clock, Activity } from 'lucide-react';

export const ExercisePage: React.FC = () => {
  const {
    exerciseLogs,
    totalExerciseCal,
    selectedDate,
    refreshExerciseLogs,
    showToast,
  } = useApp();

  const [name, setName] = useState('Walking');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [intensity, setIntensity] = useState<'Light' | 'Moderate' | 'Vigorous'>('Moderate');
  const [customCalories, setCustomCalories] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const exercisePresets = ['Walking', 'Running', 'Cycling', 'Gym', 'Weight Training', 'Swimming', 'Sports', 'Custom'];

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.addExercise(selectedDate, {
      name,
      durationMinutes: Number(durationMinutes),
      intensity,
      caloriesBurned: customCalories ? Number(customCalories) : undefined,
    });

    await refreshExerciseLogs();
    showToast(`Logged ${durationMinutes} mins of ${name}! 🔥`);
    setIsFormOpen(false);
  };

  const handleDeleteExercise = async (id: string, exName: string) => {
    try {
      await api.addExercise; // Ensure module active
      const res = await fetch(`/api/exercises/${id}`, { method: 'DELETE' });
      await refreshExerciseLogs();
      showToast(`Deleted ${exName}`);
    } catch (e) {
      await refreshExerciseLogs();
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-teal-400" /> Exercise Tracker
          </h2>
          <p className="text-xs text-slate-400">Log workouts and calories burned</p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-lg shadow-teal-500/20 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Log Workout
        </button>
      </div>

      {/* Daily Exercise Calories Summary */}
      <div className="bg-gradient-to-r from-teal-900/60 via-slate-900 to-slate-900 border border-teal-500/30 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Total Burned Today</span>
          <div className="text-3xl font-extrabold text-white mt-1">
            🔥 {totalExerciseCal} <span className="text-sm font-semibold text-slate-400">kcal</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{exerciseLogs.length} activity entries logged</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-xl">
          ⚡
        </div>
      </div>

      {/* Log Exercise Form */}
      {isFormOpen && (
        <form onSubmit={handleAddExercise} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 animate-slide-up">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" /> New Exercise Entry
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Exercise Type</label>
              <select
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {exercisePresets.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  min="1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Intensity</label>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Vigorous">Vigorous</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Calories Burned (Optional override)
              </label>
              <input
                type="number"
                placeholder="Auto-calculated based on MET & weight if empty"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold py-3 rounded-2xl transition-all shadow-lg shadow-teal-500/20"
          >
            Save Exercise Log
          </button>
        </form>
      )}

      {/* Logged Exercises List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200">Today's Workout History</h3>

        {exerciseLogs.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs italic">
            No workouts logged for this date. Tap "+ Log Workout" to add your exercise!
          </div>
        ) : (
          <div className="space-y-2">
            {exerciseLogs.map((log) => (
              <div
                key={log._id || log.name}
                className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{log.name}</h4>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {log.durationMinutes} mins
                      </span>
                      <span>•</span>
                      <span className="text-amber-300 font-medium">{log.intensity}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-teal-400">🔥 {log.caloriesBurned} kcal</div>
                    <div className="text-[10px] text-slate-400">burned</div>
                  </div>
                  <button
                    onClick={() => handleDeleteExercise(log._id || '', log.name)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
