// 学科类型
export type Subject = 'chinese' | 'math' | 'english';

// 题目类型
export type QuestionType = 'choice' | 'match' | 'fill';

// 难度等级
export type Difficulty = 1 | 2 | 3;

// 题目分类
export type ChineseCategory = 'pinyin' | 'character';
export type MathCategory = 'add_sub';
export type EnglishCategory = 'word';

// 题目选项
export interface QuestionOption {
  text: string;
  imageUrl?: string;
}

// 题目数据
export interface Question {
  id: string;
  subject: Subject;
  type: QuestionType;
  difficulty: Difficulty;
  category: string;
  question: {
    text: string;
    imageUrl?: string;
    audioUrl?: string;
  };
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

// 拼音数据
export interface PinyinItem {
  id: string;
  type: 'shengmu' | 'yunmu' | 'zhengti';
  pinyin: string;
  audioUrl?: string;
  example?: string;
}

// 汉字数据
export interface CharacterItem {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
  groupWord: string;
  imageUrl?: string;
  emoji?: string;
  strokeOrder?: string[];
}

// 英语单词数据
export interface EnglishWord {
  id: string;
  word: string;
  meaning: string;
  phonetic?: string;
  imageUrl?: string;
  emoji?: string;
  audioUrl?: string;
  category: string;
}

// 每日进度
export interface DailyProgress {
  date: string;
  chineseCompleted: number;
  mathCompleted: number;
  englishCompleted: number;
  totalCorrect: number;
  studyMinutes: number;
}

// 学科进度
export interface SubjectProgress {
  chinese: {
    pinyinProgress: string[];
    characterProgress: string[];
    totalCorrect: number;
    totalAttempts: number;
  };
  math: {
    unlockedLevel: number;
    totalCorrect: number;
    totalAttempts: number;
    bestRecord: number;
  };
  english: {
    wordProgress: string[];
    totalCorrect: number;
    totalAttempts: number;
  };
}

// 勋章
export interface Medal {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

// 用户学习数据
export interface UserData {
  userId: string;
  stars: number;
  medals: string[];
  dailyProgress: DailyProgress;
  subjectProgress: SubjectProgress;
  consecutiveDays: number;
  lastStudyDate: string;
}

// 学习设置
export interface StudySettings {
  dailyTimeLimit: number; // 分钟
  mathTimeLimit: number; // 秒
  soundEnabled: boolean;
}

// 练习结果
export interface PracticeResult {
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  timeUsed: number;
  starsEarned: number;
}