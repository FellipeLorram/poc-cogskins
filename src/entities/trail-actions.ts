import { Trail } from "@prisma/client";
import { GeneratedTrail } from "./trails";

export interface GetTrailRequest {
  trailId: string;
}

export interface GetTrailResponse {
  trail: GeneratedTrail | null;
}

export interface ListTrailsResponse {
  trails: GeneratedTrail[];
}

export interface SaveTrailRequest {
  trail: GeneratedTrail;
}

export interface SaveTrailResponse {
  trail: GeneratedTrail;
}

export interface UpdateTrailRequest {
  trailId: string;
  data: Partial<Trail>;
}

export interface UpdateTrailResponse {
  trail: GeneratedTrail;
}

// Main actions interface
export interface TrailActions {
  getTrail: (request: GetTrailRequest) => Promise<GetTrailResponse>;
  listTrails: () => Promise<ListTrailsResponse>;
  saveTrail: (request: SaveTrailRequest) => Promise<SaveTrailResponse>;
  updateTrail: (request: UpdateTrailRequest) => Promise<UpdateTrailResponse>;
}
