"use server";

import { generateTrailTask } from "@/trigger/trails";
import { cookies } from "next/headers";

interface GenerateTrailRequest {
  contents: string[];
}

export async function generateTrailTaskTrigger(payload: GenerateTrailRequest) {
  const run = await generateTrailTask.trigger(payload);

  const accessToken = run.publicAccessToken;

  const cookieStore = await cookies();
  cookieStore.set("run-task-access-token", accessToken);
  cookieStore.set("run-task-id", run.id);
}
