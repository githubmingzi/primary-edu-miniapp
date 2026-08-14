import { create } from 'zustand';
import { UserData, StudySettings, DailyProgress, SubjectProgress, Medal } from '@/types';
import Taro from '@tarojs/taro';
import dayjs from 'dayjs';

const defaultDailyProgress: DailyProgress = {
  date: dayjs().format('YYYY-MM-DD'),
  chineseCompleted: 0,
  mathCompleted: 0,
  englishCompleted: 0,
  totalCorrect: 0,
  studyMinutes: 0,
};

const defaultSubjectProgress: SubjectProgress = {
  chinese: { pinyinProgress: [], characterProgress: [], totalCorrect: 0, totalAttempts: 0 },
  math: { unlockedLevel: 1, totalCorrect: 0, totalAttempts: 0, bestRecord: 0 },
  english: { wordProgress: [], totalCorrect: 0, totalAttempts: 0 },
};

const defaultSettings: StudySettings = {
  dailyTimeLimit: 30,
  mathTimeLimit: 30,
  soundEnabled: true,
};

interface AppState {
  userData: UserData;
  settings: StudySettings;
  medals: Medal[];
  updateStars: (count: number) => void;
  addCorrect: (subject: 'chinese' | 'math' | 'english') => void;
  addAttempt: (subject: 'chinese' | 'math' | 'english') => void;
  resetDailyProgress: () => void;
  updateSettings: (settings: Partial<StudySettings>) => void;
  unlockMedal: (medalId: string) => void;
  updateMathBestRecord: (score: number) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const getDefaultMedals = (): Medal[] => [
  { id: 'medal_01', name: '学习之星', description: '累计获得50⭐', icon: '⭐', unlocked: false },
  { id: 'medal_02', name: '拼音小达人', description: '完成全部拼音学习', icon: '🔤', unlocked: false },
  { id: 'medal_03', name: '算术小能手', description: '完成100道数学题', icon: '🔢', unlocked: false },
  { id: 'medal_04', name: '英语小天才', description: '完成全部单词学习', icon: '🔤', unlocked: false },
  { id: 'medal_05', name: '全勤小标兵', description: '连续学习7天', icon: '📅', unlocked: false },
  { id: 'medal_06', name: '三科全优', description: '三门学科均完成基础学习', icon: '🏆', unlocked: false },
];

export const useStore = create<AppState>((set, get) => ({
  userData: {
    userId: 'local_user',
    stars: 0,
    medals: [],
    dailyProgress: { ...defaultDailyProgress },
    subjectProgress: JSON.parse(JSON.stringify(defaultSubjectProgress)),
    consecutiveDays: 0,
    lastStudyDate: '',
  },
  settings: { ...defaultSettings },
  medals: getDefaultMedals(),

  updateStars: (count: number) => {
    set((state) => {
      const newStars = state.userData.stars + count;
      const newMedals = state.medals.map((m) => {
        if (m.id === 'medal_01' && newStars >= 50 && !m.unlocked) return { ...m, unlocked: true };
        return m;
      });
      const newUserData = { ...state.userData, stars: newStars, medals: [...newMedals.filter((m) => m.unlocked).map((m) => m.id)] };
      const newState = { userData: newUserData, medals: newMedals };
      return newState;
    });
    get().saveToStorage();
  },

  addCorrect: (subject) => {
    set((state) => {
      const progress = { ...state.userData.subjectProgress };
      const daily = { ...state.userData.dailyProgress, totalCorrect: state.userData.dailyProgress.totalCorrect + 1 };
      if (subject === 'chinese') {
        progress.chinese = { ...progress.chinese, totalCorrect: progress.chinese.totalCorrect + 1 };
        daily.chineseCompleted += 1;
      } else if (subject === 'math') {
        progress.math = { ...progress.math, totalCorrect: progress.math.totalCorrect + 1 };
        daily.mathCompleted += 1;
      } else if (subject === 'english') {
        progress.english = { ...progress.english, totalCorrect: progress.english.totalCorrect + 1 };
        daily.englishCompleted += 1;
      }
      return { userData: { ...state.userData, subjectProgress: progress, dailyProgress: daily } };
    });
  },

  addAttempt: (subject) => {
    set((state) => {
      const progress = { ...state.userData.subjectProgress };
      if (subject === 'chinese') {
        progress.chinese = { ...progress.chinese, totalAttempts: progress.chinese.totalAttempts + 1 };
      } else if (subject === 'math') {
        progress.math = { ...progress.math, totalAttempts: progress.math.totalAttempts + 1 };
      } else if (subject === 'english') {
        progress.english = { ...progress.english, totalAttempts: progress.english.totalAttempts + 1 };
      }
      return { userData: { ...state.userData, subjectProgress: progress } };
    });
  },

  resetDailyProgress: () => {
    set((state) => ({
      userData: { ...state.userData, dailyProgress: { ...defaultDailyProgress } },
    }));
  },

  updateSettings: (newSettings) => {
    set((state) => ({ settings: { ...state.settings, ...newSettings } }));
    get().saveToStorage();
  },

  unlockMedal: (medalId) => {
    set((state) => {
      const newMedals = state.medals.map((m) => (m.id === medalId ? { ...m, unlocked: true } : m));
      const medalIds = newMedals.filter((m) => m.unlocked).map((m) => m.id);
      return { medals: newMedals, userData: { ...state.userData, medals: medalIds } };
    });
    get().saveToStorage();
  },

  updateMathBestRecord: (score) => {
    set((state) => ({
      userData: {
        ...state.userData,
        subjectProgress: {
          ...state.userData.subjectProgress,
          math: { ...state.userData.subjectProgress.math, bestRecord: Math.max(state.userData.subjectProgress.math.bestRecord, score) },
        },
      },
    }));
    get().saveToStorage();
  },

  loadFromStorage: () => {
    try {
      const stored = Taro.getStorageSync('userData');
      const settingsStored = Taro.getStorageSync('studySettings');
      if (stored) {
        set((state) => ({ userData: { ...state.userData, ...stored } }));
      }
      if (settingsStored) {
        set((state) => ({ settings: { ...state.settings, ...settingsStored } }));
      }
    } catch (e) {
      console.error('[Store] loadFromStorage error:', e);
    }
  },

  saveToStorage: () => {
    try {
      const { userData, settings } = get();
      Taro.setStorageSync('userData', userData);
      Taro.setStorageSync('studySettings', settings);
    } catch (e) {
      console.error('[Store] saveToStorage error:', e);
    }
  },
}));