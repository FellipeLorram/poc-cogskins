import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dataStore } from "./data-store";
import { TrailId } from "./types";

interface CompletedQuest {
  questType: string;
  completedAtLevel: number;
}

interface Store {
  level: number;
  completedQuests: CompletedQuest[];
  correctAnswers: Record<string, boolean[]>;
  setCorrectAnswers: (correctAnswers: Record<string, boolean[]>) => void;
  addCompletedQuest: (questId: string) => void;
  isQuestCompleted: (questId: string) => boolean;
  setLevel: (level: number) => void;
  trailLevel: {
    "hybrid-intelligence": number;
    "future-of-work": number;
    "tech-industry": number;
  };
  setTrailLevel: (trailId: TrailId, level: number) => void;
  isTrailCompleted: (trailId: TrailId) => boolean;
  isQuestLocked: (trailId: TrailId, questId: string) => boolean;
  completedAnyQuest: boolean;
  setCompletedAnyQuest: (completedAnyQuest: boolean) => void;
  sawIntro: boolean;
  setSawIntro: (sawIntro: boolean) => void;
  clear: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      level: 0,
      setLevel: (level: number) => set({ level }),
      correctAnswers: {},
      setCorrectAnswers: (correctAnswers: Record<string, boolean[]>) =>
        set({ correctAnswers }),

      trailLevel: {
        "hybrid-intelligence": 1,
        "future-of-work": 1,
        "tech-industry": 1,
      },
      setTrailLevel: (trailId: string, level: number) =>
        set({ trailLevel: { ...get().trailLevel, [trailId]: level } }),
      isTrailCompleted: (trailId: TrailId) => get().trailLevel[trailId] === 3,

      isQuestLocked: (trailId: TrailId, questId: string) => {
        const trailLevel = get().trailLevel[trailId];
        const quest = dataStore.getQuestByType(trailId, questId);

        if (!quest) return false;

        return quest.level > trailLevel;
      },

      completedQuests: [],
      addCompletedQuest: (questType: string) =>
        set((state) => ({
          completedQuests: [
            ...state.completedQuests,
            { questType: questType, completedAtLevel: state.level },
          ],
        })),
      isQuestCompleted: (questType: string) =>
        get().completedQuests.some((quest) => quest.questType === questType),
      completedAnyQuest: false,
      setCompletedAnyQuest: (completedAnyQuest: boolean) =>
        set({ completedAnyQuest }),
      sawIntro: false,
      setSawIntro: (sawIntro: boolean) => set({ sawIntro }),
      clear: () =>
        set({
          level: 0,
          completedQuests: [],
          correctAnswers: {},
          trailLevel: {
            "hybrid-intelligence": 1,
            "future-of-work": 1,
            "tech-industry": 1,
          },
        }),
    }),
    {
      name: "web-summit-store",
    }
  )
);
