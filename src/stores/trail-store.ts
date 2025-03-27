import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prisma, QuestStatus } from '@prisma/client';
import { StateCreator } from 'zustand/vanilla';

// Tipo da trilha gerada
type GeneratedTrail = Prisma.TrailGetPayload<{
    include: {
        inputContents: true;
        quests: true;
        badge: true;
    };
}>;

// Tipo para os dados do NFT (compatível com Prisma.JsonValue)
type NFTData = {
    [key: string]: string | number | boolean | null | NFTData | NFTData[];
};

// Interface da store
interface TrailStore {
    // Estado
    trails: GeneratedTrail[];
    currentTrail: GeneratedTrail | null;
    isGenerating: boolean;
    error: string | null;

    // Ações
    addTrail: (trail: GeneratedTrail) => void;
    removeTrail: (trailId: string) => void;
    setCurrentTrail: (trail: GeneratedTrail | null) => void;
    clearTrails: () => void;
    setGenerating: (isGenerating: boolean) => void;
    setError: (error: string | null) => void;
    
    // Ações específicas dos quests
    updateQuestStatus: (trailId: string, questId: string, status: QuestStatus) => void;
    updateQuestAttempts: (trailId: string, questId: string, attempts: number) => void;
    
    // Ações do badge
    updateBadgeEarned: (trailId: string, earnedAt: Date) => void;
    updateBadgeNFTData: (trailId: string, nftData: NFTData) => void;
}

type TrailStorePersist = StateCreator<
    TrailStore,
    [],
    [["zustand/persist", unknown]],
    TrailStore
>;

// Criação da store com persistência
export const useTrailStore = create<TrailStore>()(
    persist(
        ((set) => ({
            // Estado inicial
            trails: [],
            currentTrail: null,
            isGenerating: false,
            error: null,

            // Implementação das ações
            addTrail: (trail: GeneratedTrail) => set((state: TrailStore) => ({
                trails: [...state.trails, trail],
                currentTrail: trail,
                error: null
            })),

            removeTrail: (trailId: string) => set((state: TrailStore) => ({
                trails: state.trails.filter((t: GeneratedTrail) => t.id !== trailId),
                currentTrail: state.currentTrail?.id === trailId ? null : state.currentTrail
            })),

            setCurrentTrail: (trail: GeneratedTrail | null) => set({
                currentTrail: trail,
                error: null
            }),

            clearTrails: () => set({
                trails: [],
                currentTrail: null,
                error: null
            }),

            setGenerating: (isGenerating: boolean) => set({
                isGenerating,
                error: null
            }),

            setError: (error: string | null) => set({
                error,
                isGenerating: false
            }),

            updateQuestStatus: (trailId: string, questId: string, status: QuestStatus) => set((state: TrailStore) => ({
                trails: state.trails.map((trail) =>
                    trail.id === trailId
                        ? {
                            ...trail,
                            quests: trail.quests.map((quest) =>
                                quest.id === questId
                                    ? { ...quest, status }
                                    : quest
                            )
                        }
                        : trail
                ),
                currentTrail: state.currentTrail?.id === trailId
                    ? {
                        ...state.currentTrail,
                        quests: state.currentTrail.quests.map((quest) =>
                            quest.id === questId
                                ? { ...quest, status }
                                : quest
                        )
                    }
                    : state.currentTrail
            })),

            updateQuestAttempts: (trailId: string, questId: string, attempts: number) => set((state: TrailStore) => ({
                trails: state.trails.map((trail) =>
                    trail.id === trailId
                        ? {
                            ...trail,
                            quests: trail.quests.map((quest) =>
                                quest.id === questId
                                    ? { ...quest, attempts }
                                    : quest
                            )
                        }
                        : trail
                ),
                currentTrail: state.currentTrail?.id === trailId
                    ? {
                        ...state.currentTrail,
                        quests: state.currentTrail.quests.map((quest) =>
                            quest.id === questId
                                ? { ...quest, attempts }
                                : quest
                        )
                    }
                    : state.currentTrail
            })),

            updateBadgeEarned: (trailId: string, earnedAt: Date) => set((state: TrailStore) => ({
                trails: state.trails.map((trail) =>
                    trail.id === trailId && trail.badge
                        ? {
                            ...trail,
                            badge: { ...trail.badge, earnedAt }
                        }
                        : trail
                ),
                currentTrail: state.currentTrail?.id === trailId && state.currentTrail.badge
                    ? {
                        ...state.currentTrail,
                        badge: { ...state.currentTrail.badge, earnedAt }
                    }
                    : state.currentTrail
            })),

            updateBadgeNFTData: (trailId: string, nftData: NFTData) => set((state: TrailStore) => ({
                trails: state.trails.map((trail) =>
                    trail.id === trailId && trail.badge
                        ? {
                            ...trail,
                            badge: { ...trail.badge, nftData }
                        }
                        : trail
                ),
                currentTrail: state.currentTrail?.id === trailId && state.currentTrail.badge
                    ? {
                        ...state.currentTrail,
                        badge: { ...state.currentTrail.badge, nftData }
                    }
                    : state.currentTrail
            }))
        })) as TrailStorePersist,
        {
            name: 'trail-storage', // nome da chave no localStorage
            partialize: (state) => ({ 
                trails: state.trails,
                currentTrail: state.currentTrail
            }), // apenas estes estados serão persistidos
        }
    )
); 