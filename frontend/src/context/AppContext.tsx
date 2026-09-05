import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile, DailyLog, ExerciseEntry, WeightEntry } from '../types';
import { DEFAULT_PROFILE } from '../utils/seedData';
import { api } from '../services/api';

interface AppContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>, name?: string) => Promise<void>;
  dailyLog: DailyLog;
  refreshDailyLog: () => Promise<void>;
  exerciseLogs: ExerciseEntry[];
  totalExerciseCal: number;
  refreshExerciseLogs: () => Promise<void>;
  weightSummary: any;
  refreshWeightLogs: () => Promise<void>;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isPhotoScannerOpen: boolean;
  setIsPhotoScannerOpen: (open: boolean) => void;
  quickAddMealType: string;
  setQuickAddMealType: (type: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  const [dailyLog, setDailyLog] = useState<DailyLog>({
    date: getTodayDateString(),
    meals: {
      Breakfast: { items: [], totalCalories: 0 },
      Lunch: { items: [], totalCalories: 0 },
      Dinner: { items: [], totalCalories: 0 },
      Snacks: { items: [], totalCalories: 0 },
    },
    totalCaloriesConsumed: 0,
    totalProteinG: 0,
    totalCarbsG: 0,
    totalFatG: 0,
    totalFiberG: 0,
    waterIntakeMl: 0,
    steps: 0,
  });

  const [exerciseLogs, setExerciseLogs] = useState<ExerciseEntry[]>([]);
  const [totalExerciseCal, setTotalExerciseCal] = useState<number>(0);
  const [weightSummary, setWeightSummary] = useState<any>(null);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isPhotoScannerOpen, setIsPhotoScannerOpen] = useState<boolean>(false);
  const [quickAddMealType, setQuickAddMealType] = useState<string>('Breakfast');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Load User Profile on mount
  useEffect(() => {
    api.getProfile().then((userData) => {
      setUser(userData);
      if (userData.profile) {
        setProfile(userData.profile);
      }
    });
  }, []);

  // Refresh daily log whenever selectedDate changes
  const refreshDailyLog = async () => {
    const log = await api.getDailyLog(selectedDate);
    setDailyLog(log);
  };

  const refreshExerciseLogs = async () => {
    const data = await api.getExercises(selectedDate);
    setExerciseLogs(data.logs);
    setTotalExerciseCal(data.totalCaloriesBurned);
  };

  const refreshWeightLogs = async () => {
    const data = await api.getWeightLogs();
    setWeightSummary(data);
  };

  useEffect(() => {
    refreshDailyLog();
    refreshExerciseLogs();
    refreshWeightLogs();
  }, [selectedDate]);

  const updateProfile = async (updates: Partial<UserProfile>, name?: string) => {
    const updatedUser = await api.updateProfile(updates, name);
    setUser(updatedUser);
    if (updatedUser.profile) {
      setProfile(updatedUser.profile);
    }
    showToast('Profile and nutrition targets updated!');
  };

  return (
    <AppContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        activeTab,
        setActiveTab,
        user,
        profile,
        updateProfile,
        dailyLog,
        refreshDailyLog,
        exerciseLogs,
        totalExerciseCal,
        refreshExerciseLogs,
        weightSummary,
        refreshWeightLogs,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isPhotoScannerOpen,
        setIsPhotoScannerOpen,
        quickAddMealType,
        setQuickAddMealType,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
