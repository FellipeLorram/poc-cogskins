"use server";

import { generateTrailTask as generateTrailTaskTrigger } from "@/trigger/trails";
import { cookies } from "next/headers";

interface GenerateTrailRequest {
  contents: string[];
}

export async function generateTrailTask(payload: GenerateTrailRequest) {
  const run = await generateTrailTaskTrigger.trigger(payload);

  const accessToken = run.publicAccessToken;

  const cookieStore = await cookies();
  cookieStore.set("run-task-access-token", accessToken);
  cookieStore.set("run-task-id", run.id);
}
