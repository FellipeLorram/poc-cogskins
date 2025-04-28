"use server";

import { generateFeedbackTask } from "@/trigger/feedback";
import { redirect } from "next/navigation";

interface GenerateFeedbackRequest {
  contentPrompt: string;
  questionsAnswered: number;
  correctAnswers: number;
  difficultyLevel: number;
  trailId: string;
  questId: string;
}

export async function generateFeedbackTaskTrigger(
  payload: GenerateFeedbackRequest
) {
  const run = await generateFeedbackTask.trigger(payload);
  const accessToken = run.publicAccessToken;
  const runId = run.id;

  redirect(
    `/app/trails/${payload.trailId}/quests/${payload.questId}/feedback?accessToken=${accessToken}&runId=${runId}`
  );
}
