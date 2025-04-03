"use client";

import { useGetQuest } from "@/hooks/quests/use-get-quest";
import { useQuestionStore } from "../question-store";
import { IsAllCorrectFeedback } from "./all-correct-feedback";
import { PersonalizedFeedback } from "./personalized-feedback";
import { SomeIsCorrectFeedback } from "./some-is-correct";

interface Props {
  trailId: string;
  questId: string;
  accessToken: string;
  runId: string;
}

export function Feedback({ trailId, questId, accessToken, runId }: Props) {
  const { data: quest, isPending } = useGetQuest({ trailId, questId });
  const { correctQuestions } = useQuestionStore();

  if (isPending || !quest) return <div>Loading...</div>;

  const questions = quest?.questions;

  const percentage = (correctQuestions / questions?.length) * 100;
  const isAllQuestionsCorrect = percentage === 100;

  return (
    <div className="flex flex-col gap-16 mt-16">
      <div className="mx-auto">
        {isAllQuestionsCorrect && <IsAllCorrectFeedback />}
        {!isAllQuestionsCorrect && (
          <SomeIsCorrectFeedback
            percentage={percentage}
            trailId={trailId}
            questId={questId}
          />
        )}
      </div>
      <PersonalizedFeedback accessToken={accessToken} runId={runId} />
    </div>
  );
}
