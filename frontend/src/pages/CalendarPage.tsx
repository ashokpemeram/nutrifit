import React, { useState } from 'react';
import { useApp, getTodayDateString } from '../context/AppContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { setSelectedDate, setActiveTab, profile } = useApp();
  const [currentYearMonth, setCurrentYearMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const { year, month } = currentYearMonth;
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (month === 0) {
      setCurrentYearMonth({ year: year - 1, month: 11 });
    } else {
      setCurrentYearMonth({ year, month: month - 1 });
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setCurrentYearMonth({ year: year + 1, month: 0 });
    } else {
      setCurrentYearMonth({ year, month: month + 1 });
    }
  };

  const handleSelectDay = (dayNum: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const fullDate = `${year}-${formattedMonth}-${formattedDay}`;
    setSelectedDate(fullDate);
    setActiveTab('dashboard');
  };

  // Generate day status indicator mock logic for demonstration visual consistency
  const getDayStatus = (dayNum: number) => {
    if (dayNum > new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
      return null; // Future
    }
    // Random mock simulation for historical calendar status
    const mod = dayNum % 5;
    if (mod === 0) return 'red'; // Significantly above
    if (mod === 1) return 'yellow'; // Slightly above
    return 'green'; // Target achieved
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-400" /> Interactive History Calendar
        </h2>
        <p className="text-xs text-slate-400">Tap any previous date to view meal breakdown and status badge</p>
      </div>

      {/* Legend Badges */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-around gap-2 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          🟢 Target Achieved
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          🟡 Slightly Above
        </div>
        <div className="flex items-center gap-1.5 text-rose-400">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          🔴 Significantly Above
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-base font-extrabold text-white">{monthName}</h3>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-500 uppercase pb-2 border-b border-slate-800">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty padding slots */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty_${idx}`} className="h-14 rounded-2xl bg-transparent" />
          ))}

          {/* Day Slots */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const status = getDayStatus(dayNum);
            const isToday =
              dayNum === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <button
                key={dayNum}
                onClick={() => handleSelectDay(dayNum)}
                className={`h-14 rounded-2xl border p-1.5 flex flex-col justify-between items-center transition-all hover:scale-105 ${
                  isToday
                    ? 'bg-emerald-500/20 border-emerald-500 text-white font-extrabold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-xs font-bold">{dayNum}</span>

                {status === 'green' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/60" />
                )}
                {status === 'yellow' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/60" />
                )}
                {status === 'red' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/60" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
