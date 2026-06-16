import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { simulateReaction } from '@/lib/reactions';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ReactionResult {
  products: string[];
  description: string;
  observations: string[];
  equation: string;
  reactionType: string;
  isExothermic: boolean;
  colorChange: string | null;
  precipitate: string | null;
  gasProduced: string | null;
  pHChange: number | null;
}

export interface ProgressEntry {
  topicId: string;
  gradeId: string;
  completedAt: number;
  quizScore: number;
  experimentDone: boolean;
}

interface LabState {
  // Free lab state
  selectedChemicals: string[];
  selectedEquipment: string[];
  currentReaction: ReactionResult | null;
  chatHistory: Message[];
  reactionHistory: { reactants: string[]; result: ReactionResult; timestamp: number }[];

  // Gamification
  xp: number;
  badges: string[];
  experimentsRun: number;
  reactionsDiscovered: string[];
  aiQuestionsAsked: number;

  // Curriculum progress
  progress: ProgressEntry[];
  currentGrade: string | null;
  currentTopic: string | null;

  // Free lab actions
  addChemical: (id: string) => void;
  removeChemical: (id: string) => void;
  addEquipment: (id: string) => void;
  removeEquipment: (id: string) => void;
  /** Simulate a reaction with the currently selected chemicals and store the result */
  runReaction: () => void;
  setCurrentReaction: (result: ReactionResult | null) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  clearLab: () => void;

  // XP and badge actions
  addXP: (amount: number) => void;
  earnBadge: (id: string) => void;
  incrementExperiments: () => void;
  addDiscoveredReaction: (key: string) => void;
  incrementAIQuestions: () => void;

  // Curriculum actions
  setCurrentGrade: (grade: string) => void;
  setCurrentTopic: (topic: string) => void;
  completeTopicProgress: (entry: Omit<ProgressEntry, 'completedAt'>) => void;
  isTopicCompleted: (gradeId: string, topicId: string) => boolean;
  getTopicProgress: (gradeId: string, topicId: string) => ProgressEntry | undefined;
}

export const useLabStore = create<LabState>()(
  persist(
    (set, get) => ({
      selectedChemicals: [],
      selectedEquipment: [],
      currentReaction: null,
      chatHistory: [],
      reactionHistory: [],
      xp: 0,
      badges: [],
      experimentsRun: 0,
      reactionsDiscovered: [],
      aiQuestionsAsked: 0,
      progress: [],
      currentGrade: null,
      currentTopic: null,

      addChemical: (id) => set((state) => ({
        selectedChemicals: state.selectedChemicals.includes(id)
          ? state.selectedChemicals
          : [...state.selectedChemicals, id]
      })),

      removeChemical: (id) => set((state) => ({
        selectedChemicals: state.selectedChemicals.filter(c => c !== id),
        currentReaction: null,
      })),

      addEquipment: (id) => set((state) => ({
        selectedEquipment: state.selectedEquipment.includes(id)
          ? state.selectedEquipment
          : [...state.selectedEquipment, id]
      })),

      removeEquipment: (id) => set((state) => ({
        selectedEquipment: state.selectedEquipment.filter(e => e !== id),
      })),

      runReaction: () => {
        const chemicals = get().selectedChemicals;
        const result = simulateReaction(chemicals);
        const reactionKey = [...chemicals].sort().join('+');
        set((state) => ({
          currentReaction: result,
          experimentsRun: state.experimentsRun + 1,
          reactionHistory: [
            ...state.reactionHistory,
            { reactants: chemicals, result, timestamp: Date.now() },
          ],
          reactionsDiscovered: state.reactionsDiscovered.includes(reactionKey)
            ? state.reactionsDiscovered
            : [...state.reactionsDiscovered, reactionKey],
        }));
      },

      setCurrentReaction: (result) => set({ currentReaction: result }),

      addMessage: (message) => set((state) => ({
        chatHistory: [...state.chatHistory, {
          ...message,
          id: Date.now().toString(),
          timestamp: Date.now(),
        }]
      })),

      clearChat: () => set({ chatHistory: [] }),

      clearLab: () => set({
        selectedChemicals: [],
        selectedEquipment: [],
        currentReaction: null,
      }),

      addXP: (amount) => set((state) => ({ xp: state.xp + amount })),

      earnBadge: (id) => set((state) => ({
        badges: state.badges.includes(id) ? state.badges : [...state.badges, id]
      })),

      incrementExperiments: () => set((state) => ({
        experimentsRun: state.experimentsRun + 1
      })),

      addDiscoveredReaction: (key) => set((state) => ({
        reactionsDiscovered: state.reactionsDiscovered.includes(key)
          ? state.reactionsDiscovered
          : [...state.reactionsDiscovered, key]
      })),

      incrementAIQuestions: () => set((state) => ({
        aiQuestionsAsked: state.aiQuestionsAsked + 1
      })),

      setCurrentGrade: (grade) => set({ currentGrade: grade }),
      setCurrentTopic: (topic) => set({ currentTopic: topic }),

      completeTopicProgress: (entry) => set((state) => {
        const existing = state.progress.findIndex(
          p => p.gradeId === entry.gradeId && p.topicId === entry.topicId
        );
        const newEntry = { ...entry, completedAt: Date.now() };
        if (existing >= 0) {
          const updated = [...state.progress];
          updated[existing] = newEntry;
          return { progress: updated };
        }
        return { progress: [...state.progress, newEntry] };
      }),

      isTopicCompleted: (gradeId, topicId) => {
        return get().progress.some(p => p.gradeId === gradeId && p.topicId === topicId && p.experimentDone);
      },

      getTopicProgress: (gradeId, topicId) => {
        return get().progress.find(p => p.gradeId === gradeId && p.topicId === topicId);
      },
    }),
    {
      name: 'chemlab-storage',
      partialize: (state) => ({
        xp: state.xp,
        badges: state.badges,
        experimentsRun: state.experimentsRun,
        reactionsDiscovered: state.reactionsDiscovered,
        aiQuestionsAsked: state.aiQuestionsAsked,
        progress: state.progress,
        reactionHistory: state.reactionHistory.slice(-20),
      }),
    }
  )
);
