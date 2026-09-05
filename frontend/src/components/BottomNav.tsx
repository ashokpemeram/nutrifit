import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Utensils, Dumbbell, TrendingUp, User, Plus, Calendar } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsQuickAddOpen } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'food', label: 'Food', icon: Utensils },
    { id: 'exercise', label: 'Exercise', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-3 py-1.5 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-emerald-400 font-semibold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}

        {/* Central Floating Quick Add Button */}
        <div className="relative -top-5">
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold p-3.5 shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-slate-950"
            title="Quick Add Food, Water or Exercise"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
          </button>
        </div>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-emerald-400 font-semibold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
