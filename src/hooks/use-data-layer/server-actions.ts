import { getTrail } from "@/api/trails/get-trail";
import { listTrails } from "@/api/trails/list-trails";
import { saveTrail } from "@/api/trails/save-trail";
import { updateTrail } from "@/api/trails/update-trail";
import { TrailActions } from "@/entities/trail-actions";

export const serverActions: TrailActions = {
  getTrail: getTrail,
  listTrails: listTrails,
  saveTrail: saveTrail,
  updateTrail: updateTrail,
};
