'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  earnedAt?: string;
}

export interface TopicProgress {
  topicId: string;
  completed: boolean;
  quizScore?: number;
  experimentCompleted: boolean;
  completedAt?: string;
}

export interface UserState {
  name: string;
  role: 'student' | 'teacher' | 'guest';
  xp: number;
  level: number;
  achievements: Achievement[];
  topicProgress: Record<string, TopicProgress>;
  experimentHistory: string[];
  streak: number;
  lastVisit?: string;

  setName: (name: string) => void;
  setRole: (role: 'student' | 'teacher' | 'guest') => void;
  addXP: (amount: number) => void;
  completeExperiment: (topicId: string) => void;
  setQuizScore: (topicId: string, score: number) => void;
  completeTopic: (topicId: string) => void;
  addToHistory: (experimentId: string) => void;
  unlockAchievement: (achievement: Achievement) => void;
  checkAndUpdateStreak: () => void;
}

const XP_PER_LEVEL = 500;

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_experiment', title: 'Lab Newbie', description: 'Complete your first experiment', icon: '🧪', xp: 50 },
  { id: 'first_quiz', title: 'Quiz Taker', description: 'Complete your first quiz', icon: '📝', xp: 30 },
  { id: 'perfect_quiz', title: 'Perfect Score', description: 'Get 100% on a quiz', icon: '⭐', xp: 100 },
  { id: 'five_topics', title: 'Curious Mind', description: 'Complete 5 topics', icon: '🔬', xp: 150 },
  { id: 'ten_topics', title: 'Chemistry Expert', description: 'Complete 10 topics', icon: '🏆', xp: 300 },
  { id: 'free_lab', title: 'Free Spirit', description: 'Perform 5 experiments in Free Lab', icon: '⚗️', xp: 75 },
  { id: 'streak_7', title: 'Week Warrior', description: '7-day learning streak', icon: '🔥', xp: 200 },
  { id: 'grade_12', title: 'Senior Chemist', description: 'Complete all Grade 12 topics', icon: '🎓', xp: 500 },
];

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: 'Student',
      role: 'guest',
      xp: 0,
      level: 1,
      achievements: [],
      topicProgress: {},
      experimentHistory: [],
      streak: 0,
      lastVisit: undefined,

      setName: (name) => set({ name }),
      setRole: (role) => set({ role }),

      addXP: (amount) => set((state) => {
        const newXP = state.xp + amount;
        const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
        return { xp: newXP, level: newLevel };
      }),

      completeExperiment: (topicId) => set((state) => {
        const existing = state.topicProgress[topicId] || { topicId, completed: false, experimentCompleted: false };
        const progress = { ...state.topicProgress, [topicId]: { ...existing, experimentCompleted: true } };
        const history = state.experimentHistory.includes(topicId)
          ? state.experimentHistory
          : [...state.experimentHistory, topicId];
        return { topicProgress: progress, experimentHistory: history };
      }),

      setQuizScore: (topicId, score) => set((state) => {
        const existing = state.topicProgress[topicId] || { topicId, completed: false, experimentCompleted: false };
        return { topicProgress: { ...state.topicProgress, [topicId]: { ...existing, quizScore: score } } };
      }),

      completeTopic: (topicId) => set((state) => {
        const existing = state.topicProgress[topicId] || { topicId, completed: false, experimentCompleted: false };
        return {
          topicProgress: {
            ...state.topicProgress,
            [topicId]: { ...existing, completed: true, completedAt: new Date().toISOString() },
          },
        };
      }),

      addToHistory: (experimentId) => set((state) => ({
        experimentHistory: state.experimentHistory.includes(experimentId)
          ? state.experimentHistory
          : [...state.experimentHistory, experimentId],
      })),

      unlockAchievement: (achievement) => set((state) => {
        if (state.achievements.find(a => a.id === achievement.id)) return state;
        return {
          achievements: [...state.achievements, { ...achievement, earnedAt: new Date().toISOString() }],
          xp: state.xp + achievement.xp,
        };
      }),

      checkAndUpdateStreak: () => set((state) => {
        const today = new Date().toDateString();
        const lastVisit = state.lastVisit;
        if (!lastVisit) return { streak: 1, lastVisit: today };
        if (lastVisit === today) return state;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = lastVisit === yesterday ? state.streak + 1 : 1;
        return { streak: newStreak, lastVisit: today };
      }),
    }),
    { name: 'kimya-lab-store' }
  )
);

export { DEFAULT_ACHIEVEMENTS };
