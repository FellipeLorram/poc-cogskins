import { TrailActions } from "@/entities/trail-actions";

// Generic type for any actions interface
export type ActionMap = Record<string, (request: unknown) => Promise<unknown>>;

// Trail-specific types
export type TrailActionKeys = keyof TrailActions;

export interface DataLayerResult<T extends ActionMap, K extends keyof T> {
  isLoading: boolean;
  action: T[K] | null;
}

// Legacy type for backward compatibility
export type Actions = TrailActionKeys;
