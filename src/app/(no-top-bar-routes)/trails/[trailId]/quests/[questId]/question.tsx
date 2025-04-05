"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { QuestionForm } from "./question-form";
import { useQuestionLogic } from "./use-question-logic";
interface QuestionProps {
  trailId: string;
  questId: string;
  questionId: string;
}

export function Question({ trailId, questId, questionId }: QuestionProps) {
  const {
    currentQuestion,
    isPending,
    isLastQuestion,
    handleSubmit,
    isLoading,
  } = useQuestionLogic({ trailId, questId, questionId });

  if (isLoading || !currentQuestion) return <Loading />;

  return (
    <QuestionForm
      isLastQuestion={isLastQuestion}
      question={currentQuestion}
      onSubmit={handleSubmit}
      isPending={isPending}
    />
  );
}

function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-9 w-1/2" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
