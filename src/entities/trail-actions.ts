import { Trail } from "@prisma/client";
import { GeneratedTrail } from "./trails";

// Request/Response types for each action
export interface GetTrailRequest {
  trailId: string;
}

export interface GetTrailResponse {
  trail: GeneratedTrail | null;
}

export interface ListTrailsRequest {
  userId: string;
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
  trail: Trail;
}

export interface UpdateTrailResponse {
  trail: GeneratedTrail;
}

// Main actions interface
export interface TrailActions {
  getTrail: (request: GetTrailRequest) => Promise<GetTrailResponse>;
  listTrails: (request: ListTrailsRequest) => Promise<ListTrailsResponse>;
  saveTrail: (request: SaveTrailRequest) => Promise<SaveTrailResponse>;
  updateTrail: (request: UpdateTrailRequest) => Promise<UpdateTrailResponse>;
}
