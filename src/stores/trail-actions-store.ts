import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  TrailActions,
  GetTrailRequest,
  GetTrailResponse,
  ListTrailsRequest,
  ListTrailsResponse,
  SaveTrailRequest,
  SaveTrailResponse,
  UpdateTrailRequest,
  UpdateTrailResponse,
} from "@/entities/trail-actions";
import { GeneratedTrail } from "@/entities/trails";
import { BadgeNotFoundError } from "@/errors/badge-not-found-error";

interface TrailActionsState {
  // State
  trails: GeneratedTrail[];

  // Actions that implement TrailActions interface
  getTrail: (request: GetTrailRequest) => Promise<GetTrailResponse>;
  listTrails: (request: ListTrailsRequest) => Promise<ListTrailsResponse>;
  saveTrail: (request: SaveTrailRequest) => Promise<SaveTrailResponse>;
  updateTrail: (request: UpdateTrailRequest) => Promise<UpdateTrailResponse>;
}

export const useTrailActionsStore = create<TrailActionsState>()(
  devtools(
    (set, get) => ({
      trails: [],

      getTrail: async (request) => {
        const trail = get().trails.find((t) => t.id === request.trailId);
        if (!trail) {
          throw BadgeNotFoundError;
        }
        return { trail };
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      listTrails: async (_request) => {
        return { trails: get().trails };
      },
      saveTrail: async (request) => {
        const newTrail = { ...request.trail, id: crypto.randomUUID() };
        const currentTrails = get().trails;
        set({ trails: [...currentTrails, newTrail] });
        return { trail: newTrail };
      },
      updateTrail: async (request) => {
        const currentTrails = get().trails;
        const updatedTrails = currentTrails.map((t) =>
          t.id === request.trail.id
            ? ({ ...t, ...request.trail } as GeneratedTrail)
            : t
        );
        set({ trails: updatedTrails });
        const updatedTrail = updatedTrails.find(
          (t) => t.id === request.trail.id
        )!;
        return { trail: updatedTrail };
      },
    }),
    { name: "trail-actions-store" }
  )
);

// Create a client-side implementation that uses the Zustand store
export const createZustandTrailActions = (): TrailActions => {
  const store = useTrailActionsStore.getState();

  return {
    getTrail: store.getTrail,
    listTrails: store.listTrails,
    saveTrail: store.saveTrail,
    updateTrail: store.updateTrail,
  };
};
