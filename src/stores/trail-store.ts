import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QuestStatus } from "@prisma/client";
import { StateCreator } from "zustand/vanilla";
import { GeneratedTrail } from "@/entities/trails";

// data do nft
type NFTData = {
  [key: string]: string | number | boolean | null | NFTData | NFTData[];
};

interface TrailStore {
  // state
  trails: GeneratedTrail[];
  currentTrail: GeneratedTrail | null;
  isGenerating: boolean;
  error: string | null;
  generatingTrailContents: string[];

  // actions
  addTrail: (trail: GeneratedTrail) => void;
  removeTrail: (trailId: string) => void;
  setCurrentTrail: (trail: GeneratedTrail | null) => void;
  clearTrails: () => void;
  setGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  setGeneratingTrailContents: (contents: string[]) => void;
  getTrail: (trailId: string) => GeneratedTrail | null;

  // actions specific to quests
  updateQuestStatus: (
    trailId: string,
    questId: string,
    status: QuestStatus
  ) => void;
  updateQuestAttempts: (
    trailId: string,
    questId: string,
    attempts: number
  ) => void;

  // actions for badge
  updateBadgeEarned: (trailId: string, earnedAt: Date) => void;
  updateBadgeNFTData: (trailId: string, nftData: NFTData) => void;
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
      currentTrail: null,
      isGenerating: false,
      error: null,
      generatingTrailContents: [],

      // implementation of actions
      setGeneratingTrailContents: (contents: string[]) =>
        set({
          generatingTrailContents: contents,
        }),

      addTrail: (trail: GeneratedTrail) =>
        set((state: TrailStore) => ({
          trails: [...state.trails, trail],
          currentTrail: trail,
          error: null,
        })),

      removeTrail: (trailId: string) =>
        set((state: TrailStore) => ({
          trails: state.trails.filter((t: GeneratedTrail) => t.id !== trailId),
          currentTrail:
            state.currentTrail?.id === trailId ? null : state.currentTrail,
        })),

      setCurrentTrail: (trail: GeneratedTrail | null) =>
        set({
          currentTrail: trail,
          error: null,
        }),

      clearTrails: () =>
        set({
          trails: [],
          currentTrail: null,
          error: null,
        }),

      setGenerating: (isGenerating: boolean) =>
        set({
          isGenerating,
          error: null,
        }),

      setError: (error: string | null) =>
        set({
          error,
          isGenerating: false,
        }),

      getTrail: (trailId: string) =>
        get().trails.find((trail) => trail.id === trailId) ?? null,

      updateQuestStatus: (
        trailId: string,
        questId: string,
        status: QuestStatus
      ) =>
        set((state: TrailStore) => ({
          trails: state.trails.map((trail) =>
            trail.id === trailId
              ? {
                  ...trail,
                  quests: trail.quests.map((quest) =>
                    quest.id === questId ? { ...quest, status } : quest
                  ),
                }
              : trail
          ),
          currentTrail:
            state.currentTrail?.id === trailId
              ? {
                  ...state.currentTrail,
                  quests: state.currentTrail.quests.map((quest) =>
                    quest.id === questId ? { ...quest, status } : quest
                  ),
                }
              : state.currentTrail,
        })),

      updateQuestAttempts: (
        trailId: string,
        questId: string,
        attempts: number
      ) =>
        set((state: TrailStore) => ({
          trails: state.trails.map((trail) =>
            trail.id === trailId
              ? {
                  ...trail,
                  quests: trail.quests.map((quest) =>
                    quest.id === questId ? { ...quest, attempts } : quest
                  ),
                }
              : trail
          ),
          currentTrail:
            state.currentTrail?.id === trailId
              ? {
                  ...state.currentTrail,
                  quests: state.currentTrail.quests.map((quest) =>
                    quest.id === questId ? { ...quest, attempts } : quest
                  ),
                }
              : state.currentTrail,
        })),

      updateBadgeEarned: (trailId: string, earnedAt: Date) =>
        set((state: TrailStore) => ({
          trails: state.trails.map((trail) =>
            trail.id === trailId && trail.badge
              ? {
                  ...trail,
                  badge: { ...trail.badge, earnedAt },
                }
              : trail
          ),
          currentTrail:
            state.currentTrail?.id === trailId && state.currentTrail.badge
              ? {
                  ...state.currentTrail,
                  badge: { ...state.currentTrail.badge, earnedAt },
                }
              : state.currentTrail,
        })),

      updateBadgeNFTData: (trailId: string, nftData: NFTData) =>
        set((state: TrailStore) => ({
          trails: state.trails.map((trail) =>
            trail.id === trailId && trail.badge
              ? {
                  ...trail,
                  badge: { ...trail.badge, nftData },
                }
              : trail
          ),
          currentTrail:
            state.currentTrail?.id === trailId && state.currentTrail.badge
              ? {
                  ...state.currentTrail,
                  badge: { ...state.currentTrail.badge, nftData },
                }
              : state.currentTrail,
        })),
    })) as TrailStorePersist,
    {
      name: "trail-storage", // name of the key in localStorage
      partialize: (state) => ({
        trails: state.trails,
        currentTrail: state.currentTrail,
        isGenerating: state.isGenerating,
        error: state.error,
        generatingTrailContents: state.generatingTrailContents,
      }), // only these states will be persisted
    }
  )
);
