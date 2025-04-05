import { GeneratedQuest } from "@/entities/quest";
import { GeneratedTrail } from "@/entities/trails";
import { Badge, QuestStatus, TrailStatus } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StateCreator } from "zustand/vanilla";

interface TrailStore {
  // state
  trails: GeneratedTrail[];

  badges: string[];
  // actions
  addTrail: (trail: GeneratedTrail) => void;
  clearTrails: () => void;
  getTrail: (trailId: string) => GeneratedTrail | null;
  getQuest: (trailId: string, questId: string) => GeneratedQuest | null;
  getQuestByDifficulty: (
    trailId: string,
    difficulty: number
  ) => GeneratedQuest | null;
  updateQuest: (
    trailId: string,
    questId: string,
    status: QuestStatus,
    attempts: number
  ) => void;
  updateTrail: (trailId: string, status: TrailStatus) => void;

  addBadge: (badgeId: string) => void;
  getBadgeByTrailId: (trailId: string) => Badge | null;
  clearBadges: () => void;
}

type TrailStorePersist = StateCreator<
  TrailStore,
  [],
  [["zustand/persist", unknown]],
  TrailStore
>;

export const useTrailStore = create<TrailStore>()(
  persist(
    ((set, get) => ({
      // initial state
      trails: [],
      badges: [],

      // implementation of actions
      addBadge: (badgeId: string) =>
        set((state: TrailStore) => ({
          badges: [...state.badges, badgeId],
        })),

      getBadgeByTrailId: (trailId: string) =>
        get().trails.find((trail) => trail.id === trailId)?.badge ?? null,

      clearBadges: () =>
        set({
          badges: [],
        }),

      updateQuest:
        (
          trailId: string,
          questId: string,
          status: QuestStatus,
          attempts: number
        ) =>
        () => {
          const trail = get().getTrail(trailId);
          if (!trail) return;

          const quest = trail.quests.find((q) => q.id === questId);
          if (!quest) return;

          quest.status = status;
          quest.attempts = attempts;

          trail.quests = trail.quests.map((q) =>
            q.id === questId ? quest : q
          );

          set({
            trails: get().trails.map((t) => (t.id === trailId ? trail : t)),
          });
        },

      updateTrail: (trailId: string, status: TrailStatus) => () => {
        const trail = get().getTrail(trailId);
        if (!trail) return;

        trail.status = status;
        set({
          trails: get().trails.map((t) => (t.id === trailId ? trail : t)),
        });
      },

      addTrail: (trail: GeneratedTrail) =>
        set((state: TrailStore) => ({
          trails: [...state.trails, trail],
        })),

      clearTrails: () =>
        set({
          trails: [],
        }),

      getTrail: (trailId: string) =>
        get().trails.find((trail) => trail.id === trailId) ?? null,

      getQuest: (trailId: string, questId: string) =>
        get()
          .trails.find((trail) => trail.id === trailId)
          ?.quests.find((quest) => quest.id === questId) ?? null,

      getQuestByDifficulty: (trailId: string, difficulty: number) =>
        get()
          .trails.find((trail) => trail.id === trailId)
          ?.quests.find((quest) => quest.difficultyLevel === difficulty) ??
        null,
    })) as TrailStorePersist,
    {
      name: "trail-storage", // name of the key in localStorage
      partialize: (state) => ({
        trails: state.trails,
      }), // only these states will be persisted
    }
  )
);
