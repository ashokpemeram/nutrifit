import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { QuickAddModal } from './components/QuickAddModal';
import { FoodPhotoScannerModal } from './components/FoodPhotoScannerModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { FoodTrackerPage } from './pages/FoodTrackerPage';
import { ExercisePage } from './pages/ExercisePage';
import { WaterAndWeightPage } from './pages/WaterAndWeightPage';
import { ProgressPage } from './pages/ProgressPage';
import { CalendarPage } from './pages/CalendarPage';
import { ProfileOnboardingPage } from './pages/ProfileOnboardingPage';
import { GoalsPage } from './pages/GoalsPage';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="max-w-4xl mx-auto px-4 py-4 min-h-[calc(100vh-60px)]">
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'food' && <FoodTrackerPage />}
      {activeTab === 'exercise' && <ExercisePage />}
      {activeTab === 'progress' && <ProgressPage />}
      {activeTab === 'water-weight' && <WaterAndWeightPage />}
      {activeTab === 'calendar' && <CalendarPage />}
      {activeTab === 'profile' && <ProfileOnboardingPage />}
      {activeTab === 'goals' && <GoalsPage />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
        <Header />
        <MainContent />
        <BottomNav />
        <QuickAddModal />
        <FoodPhotoScannerModal />
      </div>
    </AppProvider>
  );
}

export default App;
