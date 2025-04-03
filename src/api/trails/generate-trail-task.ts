"use server";

import { generateTrailTask } from "@/trigger/trails";

interface GenerateTrailRequest {
  contents: string[];
}

export async function generateTrailTaskTrigger(payload: GenerateTrailRequest) {
  const run = await generateTrailTask.trigger(payload);
  const accessToken = run.publicAccessToken;

  return {
    accessToken,
    runId: run.id,
  };
}
