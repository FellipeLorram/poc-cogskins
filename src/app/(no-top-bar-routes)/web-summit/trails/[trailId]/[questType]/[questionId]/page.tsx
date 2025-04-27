import { TrailId } from "@/app/(no-top-bar-routes)/web-summit/types";
import { dataStore } from "@/app/(no-top-bar-routes)/web-summit/data-store";
import React from "react";
import { QuestionForm } from "./question-form";
import { TopBar } from "../../../../top-bar";

interface Props {
  params: Promise<{
    trailId: TrailId;
    questType: string;
    questionId: string;
  }>;
}
export default async function page({ params }: Props) {
  const { trailId, questType, questionId } = await params;

  const trail = dataStore.getTrailById(trailId);
  const quest = dataStore.getQuestByType(trailId, questType);
  const question = dataStore.getQuestionById(questionId);

  if (!question || !quest) {
    return <div>Question not found</div>;
  }

  const currentQuestionIndex = quest?.questions.findIndex(
    (q) => q.id === questionId
  );
  const nextQuestion = quest?.questions[currentQuestionIndex + 1];
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="w-full flex flex-col gap-8">
      <TopBar title={`${trail?.title} - ${quest?.name}`} size="small" />
      <QuestionForm
        question={question}
        nextQuestion={nextQuestion}
        trailId={trailId}
        questType={questType}
        isFirstQuestion={isFirstQuestion}
      />
    </div>
  );
}
