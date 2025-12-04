import { AppData, Habit, AppSettings } from './types';
import { APP_VERSION, LOCAL_STORAGE_KEY } from './constants';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  weekStart: 'sunday',
  notifications: false
};

export const loadFromLocalStorage = (): AppData => {
  if (typeof window === 'undefined') {
    return {
      habits: [],
      settings: DEFAULT_SETTINGS,
      version: APP_VERSION
    };
  }

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      return {
        habits: [],
        settings: DEFAULT_SETTINGS,
        version: APP_VERSION
      };
    }

    const data: AppData = JSON.parse(stored);
    return data;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {
      habits: [],
      settings: DEFAULT_SETTINGS,
      version: APP_VERSION
    };
  }
};

export const saveToLocalStorage = (data: AppData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const clearLocalStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

export const exportData = (): string => {
  const data = loadFromLocalStorage();
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): AppData | null => {
  try {
    const data: AppData = JSON.parse(jsonString);
    saveToLocalStorage(data);
    return data;
  } catch (error) {
    console.error('Error importing data:', error);
    return null;
  }
};