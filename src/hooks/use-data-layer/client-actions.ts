import { createZustandTrailActions } from "@/stores/trail-actions-store";
import { TrailActions } from "@/entities/trail-actions";

export const clientActions: TrailActions = {
  getTrail: createZustandTrailActions().getTrail,
  listTrails: createZustandTrailActions().listTrails,
  saveTrail: createZustandTrailActions().saveTrail,
  updateTrail: createZustandTrailActions().updateTrail,
};
