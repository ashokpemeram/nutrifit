import React from 'react';
import { useApp, getTodayDateString } from '../context/AppContext';
import { Calendar, Camera, Flame, Sparkles, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    setIsPhotoScannerOpen,
    toastMessage,
    setActiveTab,
    isBackendConnected,
    isCheckingBackend,
    checkBackendConnection,
  } = useApp();

  const isToday = selectedDate === getTodayDateString();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
    }
  };

  const formattedDisplayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                NutriFit
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Calorie & Macro Tracker</p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Backend Connection Status Button */}
            <button
              onClick={() => checkBackendConnection(true)}
              disabled={isCheckingBackend}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-sm active:scale-95 cursor-pointer ${
                isCheckingBackend
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : isBackendConnected
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}
              title={
                isCheckingBackend
                  ? 'Checking connection to Express API backend...'
                  : isBackendConnected
                  ? 'Backend API is connected & active. Click to re-test.'
                  : 'Backend API is offline. Operating in local storage mode. Click to re-check.'
              }
            >
              {isCheckingBackend ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />
                  <span className="hidden sm:inline">Checking...</span>
                </>
              ) : isBackendConnected ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Backend</span>
                  <span className="text-[11px] font-bold">Online</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Backend</span>
                  <span className="text-[11px] font-bold">Offline</span>
                </>
              )}
            </button>

            {/* AI Photo Scan Button */}
            <button
              onClick={() => setIsPhotoScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95"
              title="AI Meal Photo Scanner"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Photo</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-bounce" />
            </button>

            {/* Date Selector */}
            <div className="relative flex items-center">
              <label className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 cursor-pointer transition-all">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isToday ? 'Today' : formattedDisplayDate}</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-slate-800/95 text-emerald-300 border border-emerald-500/40 text-xs font-medium px-4 py-2 rounded-full shadow-xl shadow-black/40 flex items-center gap-2 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </div>
        </div>
      )}
    </>
  );
};
