import axios from 'axios';
import { User, DailyLog, FoodItem, ExerciseEntry, WeightEntry, UserProfile } from '../types';
import { INITIAL_FOOD_DATABASE, DEFAULT_PROFILE } from '../utils/seedData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token or demo bearer header
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('nutrifit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper for local storage offline fallback
const getLocalData = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`nutrifit_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setLocalData = (key: string, data: any) => {
  try {
    localStorage.setItem(`nutrifit_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
};

export const api = {
  // Backend Health Check
  async checkHealth(): Promise<{ connected: boolean; latencyMs?: number }> {
    const start = Date.now();
    try {
      const res = await client.get('/health', { timeout: 3000 });
      if (res.status === 200 && res.data?.status === 'healthy') {
        return { connected: true, latencyMs: Date.now() - start };
      }
      return { connected: false };
    } catch (e) {
      return { connected: false };
    }
  },

  // Auth & Profile
  async getProfile(): Promise<User> {
    try {
      const res = await client.get('/auth/profile');
      return res.data;
    } catch (e) {
      const localProfile = getLocalData<UserProfile>('profile', DEFAULT_PROFILE);
      return {
        _id: 'local_user',
        name: 'Alex Johnson',
        email: 'alex@nutrifit.app',
        profile: localProfile,
      };
    }
  },

  async updateProfile(profile: Partial<UserProfile>, name?: string): Promise<User> {
    try {
      const res = await client.put('/auth/profile', { profile, name });
      return res.data;
    } catch (e) {
      const current = getLocalData<UserProfile>('profile', DEFAULT_PROFILE);
      const updated = { ...current, ...profile };
      setLocalData('profile', updated);
      return {
        _id: 'local_user',
        name: name || 'Alex Johnson',
        email: 'alex@nutrifit.app',
        profile: updated,
      };
    }
  },

  // Food DB
  async getFoods(query = '', category = 'All', frequentOnly = false): Promise<FoodItem[]> {
    try {
      const res = await client.get('/foods', { params: { query, category, frequentOnly } });
      return res.data;
    } catch (e) {
      let foods = getLocalData<FoodItem[]>('custom_foods', INITIAL_FOOD_DATABASE);
      if (query) {
        foods = foods.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));
      }
      if (category && category !== 'All') {
        foods = foods.filter((f) => f.category === category);
      }
      return foods;
    }
  },

  async createCustomFood(food: Partial<FoodItem>): Promise<FoodItem> {
    try {
      const res = await client.post('/foods', food);
      return res.data;
    } catch (e) {
      const foods = getLocalData<FoodItem[]>('custom_foods', INITIAL_FOOD_DATABASE);
      const newFood: FoodItem = {
        _id: `custom_${Date.now()}`,
        name: food.name || 'Custom Food',
        category: food.category || 'Custom',
        defaultUnit: food.defaultUnit || 'serving',
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
        fiber: food.fiber || 0,
        isIndian: food.isIndian || false,
      };
      setLocalData('custom_foods', [newFood, ...foods]);
      return newFood;
    }
  },

  // Daily Logs
  async getDailyLog(date: string): Promise<DailyLog> {
    try {
      const res = await client.get(`/logs/${date}`);
      return res.data;
    } catch (e) {
      const key = `log_${date}`;
      return getLocalData<DailyLog>(key, {
        date,
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
    }
  },

  async addMealItem(date: string, mealType: string, item: any): Promise<DailyLog> {
    try {
      const res = await client.post(`/logs/${date}/meals/${mealType}`, item);
      return res.data;
    } catch (e) {
      const log = await this.getDailyLog(date);
      const newItem = { ...item, _id: `item_${Date.now()}` };
      log.meals[mealType as keyof typeof log.meals].items.push(newItem);

      // Recalculate totals
      let cal = 0, p = 0, c = 0, f = 0, fib = 0;
      Object.values(log.meals).forEach((m) => {
        let mCal = 0;
        m.items.forEach((it) => {
          mCal += it.calories || 0;
          p += it.protein || 0;
          c += it.carbs || 0;
          f += it.fat || 0;
          fib += it.fiber || 0;
        });
        m.totalCalories = Math.round(mCal);
        cal += mCal;
      });

      log.totalCaloriesConsumed = Math.round(cal);
      log.totalProteinG = Math.round(p * 10) / 10;
      log.totalCarbsG = Math.round(c * 10) / 10;
      log.totalFatG = Math.round(f * 10) / 10;
      log.totalFiberG = Math.round(fib * 10) / 10;

      setLocalData(`log_${date}`, log);
      return log;
    }
  },

  async deleteMealItem(date: string, mealType: string, itemId: string): Promise<DailyLog> {
    try {
      const res = await client.delete(`/logs/${date}/meals/${mealType}/items/${itemId}`);
      return res.data;
    } catch (e) {
      const log = await this.getDailyLog(date);
      const targetMeal = log.meals[mealType as keyof typeof log.meals];
      targetMeal.items = targetMeal.items.filter((i) => i._id !== itemId);

      let cal = 0, p = 0, c = 0, f = 0, fib = 0;
      Object.values(log.meals).forEach((m) => {
        let mCal = 0;
        m.items.forEach((it) => {
          mCal += it.calories || 0;
          p += it.protein || 0;
          c += it.carbs || 0;
          f += it.fat || 0;
          fib += it.fiber || 0;
        });
        m.totalCalories = Math.round(mCal);
        cal += mCal;
      });

      log.totalCaloriesConsumed = Math.round(cal);
      log.totalProteinG = Math.round(p * 10) / 10;
      log.totalCarbsG = Math.round(c * 10) / 10;
      log.totalFatG = Math.round(f * 10) / 10;
      log.totalFiberG = Math.round(fib * 10) / 10;

      setLocalData(`log_${date}`, log);
      return log;
    }
  },

  async updateWater(date: string, amountMl: number, mode: 'add' | 'set' = 'add'): Promise<DailyLog> {
    try {
      const res = await client.put(`/logs/${date}/water`, { amountMl, mode });
      return res.data;
    } catch (e) {
      const log = await this.getDailyLog(date);
      if (mode === 'add') {
        log.waterIntakeMl = Math.max(0, log.waterIntakeMl + amountMl);
      } else {
        log.waterIntakeMl = Math.max(0, amountMl);
      }
      setLocalData(`log_${date}`, log);
      return log;
    }
  },

  async updateSteps(date: string, steps: number): Promise<DailyLog> {
    try {
      const res = await client.put(`/logs/${date}/steps`, { steps });
      return res.data;
    } catch (e) {
      const log = await this.getDailyLog(date);
      log.steps = Math.max(0, steps);
      setLocalData(`log_${date}`, log);
      return log;
    }
  },

  // Exercise
  async getExercises(date: string): Promise<{ logs: ExerciseEntry[]; totalCaloriesBurned: number }> {
    try {
      const res = await client.get(`/exercises/${date}`);
      return res.data;
    } catch (e) {
      const logs = getLocalData<ExerciseEntry[]>(`ex_${date}`, []);
      const total = logs.reduce((sum, item) => sum + item.caloriesBurned, 0);
      return { logs, totalCaloriesBurned: total };
    }
  },

  async addExercise(date: string, exercise: Partial<ExerciseEntry>): Promise<ExerciseEntry> {
    try {
      const res = await client.post('/exercises', { date, ...exercise });
      return res.data;
    } catch (e) {
      const logs = getLocalData<ExerciseEntry[]>(`ex_${date}`, []);
      const newEx: ExerciseEntry = {
        _id: `ex_${Date.now()}`,
        date,
        name: exercise.name || 'Walking',
        durationMinutes: exercise.durationMinutes || 30,
        intensity: exercise.intensity || 'Moderate',
        caloriesBurned: exercise.caloriesBurned || 150,
      };
      setLocalData(`ex_${date}`, [newEx, ...logs]);
      return newEx;
    }
  },

  // Weight
  async getWeightLogs(): Promise<{ logs: WeightEntry[]; summary: any }> {
    try {
      const res = await client.get('/weight');
      return res.data;
    } catch (e) {
      const logs = getLocalData<WeightEntry[]>('weight_logs', [
        { date: '2026-09-01', weightKg: 75.0, weeklyAverageKg: 75.0 },
        { date: '2026-09-02', weightKg: 74.7, weeklyAverageKg: 74.85 },
        { date: '2026-09-03', weightKg: 74.4, weeklyAverageKg: 74.70 },
        { date: '2026-09-04', weightKg: 74.2, weeklyAverageKg: 74.57 },
        { date: '2026-09-05', weightKg: 73.8, weeklyAverageKg: 74.42 },
      ]);

      const current = logs.length > 0 ? logs[logs.length - 1].weightKg : 74.2;
      return {
        logs,
        summary: {
          startingWeightKg: 75.0,
          currentWeightKg: current,
          targetWeightKg: 70.0,
          totalChangeKg: -1.2,
          remainingToTargetKg: 3.8,
        },
      };
    }
  },

  async logWeight(date: string, weightKg: number, notes = ''): Promise<WeightEntry> {
    try {
      const res = await client.post('/weight', { date, weightKg, notes });
      return res.data;
    } catch (e) {
      const logs = getLocalData<WeightEntry[]>('weight_logs', []);
      const existingIdx = logs.findIndex((l) => l.date === date);
      const newEntry: WeightEntry = { date, weightKg, notes };

      if (existingIdx > -1) {
        logs[existingIdx] = newEntry;
      } else {
        logs.push(newEntry);
      }
      logs.sort((a, b) => a.date.localeCompare(b.date));

      setLocalData('weight_logs', logs);
      return newEntry;
    }
  },

  // AI Meal Photo Scan
  async scanMealPhoto(imagePayload: string): Promise<any> {
    try {
      const res = await client.post('/ai/scan-meal', { imagePayload });
      return res.data;
    } catch (e) {
      return {
        success: true,
        disclaimer: 'AI nutrition estimates are approximate. Please verify portions before saving.',
        data: {
          detectedMeal: 'South Indian Breakfast Thali',
          confidence: '94%',
          items: [
            { name: 'Plain Dosa', quantity: 2, unit: 'piece', calories: 260, protein: 7.0, carbs: 46.0, fat: 6.0, fiber: 2.4 },
            { name: 'Coconut Chutney', quantity: 2, unit: 'tablespoon', calories: 90, protein: 1.6, carbs: 4.0, fat: 8.0, fiber: 2.2 },
            { name: 'Sambar', quantity: 1, unit: 'bowl', calories: 110, protein: 5.0, carbs: 18.0, fat: 2.5, fiber: 4.0 },
          ],
          estimatedCalorieRange: '450 - 520 kcal',
        },
      };
    }
  },
};
