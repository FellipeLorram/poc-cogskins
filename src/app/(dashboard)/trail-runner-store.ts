import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TrailRunnerStore {
  runId: string | null;
  accessToken: string | null;
  contents: string[];
  setRunId: (runId: string | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  setContents: (contents: string[]) => void;
}

export const useTrailRunnerStore = create<TrailRunnerStore>()(
  persist(
    (set) => ({
      runId: null,
      accessToken: null,
      contents: [],
      setRunId: (runId: string | null) => set({ runId }),
      setAccessToken: (accessToken: string | null) => set({ accessToken }),
      setContents: (contents: string[]) => set({ contents }),
    }),
    {
      name: "trail-runner-store",
    }
  )
);
