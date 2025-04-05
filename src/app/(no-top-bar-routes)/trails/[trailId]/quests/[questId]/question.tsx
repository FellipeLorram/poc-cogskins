"use client";

import { generateFeedbackTaskTrigger } from "@/api/quest/generate-feedback-task-trigger";
import { useGetQuest } from "@/hooks/quests/use-get-quest";
import { useUpdateQuest } from "@/hooks/quests/use-update-quest";
import { useUpdateTrail } from "@/hooks/trails/use-update-trail";
import { QuestStatus, TrailStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { QuestionForm, QuestionFormSchema } from "./question-form";
import { useQuestionStore } from "./question-store";
import { useGetQuestByDifficulty } from "@/hooks/quests/use-get-quest-by-difficulty";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionProps {
  trailId: string;
  questId: string;
  questionId: string;
}

function useQuestionLogic(
  trailId: string,
  questId: string,
  questionId: string
) {
  const router = useRouter();
  const { data: quest, isPending: isPendingQuest } = useGetQuest({
    trailId,
    questId,
  });
  const { mutate: updateQuest, isPending: isUpdatingQuest } = useUpdateQuest();
  const { mutate: updateTrail, isPending: isUpdatingTrail } = useUpdateTrail();
  const { answeredQuestions, addAnsweredQuestion, setCorrectQuestions } =
    useQuestionStore();
  const { data: nextQuest } = useGetQuestByDifficulty({
    trailId,
    difficulty: quest?.difficultyLevel ? quest.difficultyLevel + 1 : 0,
    enabled:
      quest?.difficultyLevel !== undefined && quest.difficultyLevel + 1 > 3,
  });

  const questions = quest?.questions;
  const currentQuestion = questions?.find((q) => q.id === questionId);

  const getQuestionNavigation = () => {
    if (!questions) return {};
    const currentIndex = questions.findIndex((q) => q.id === questionId);
    const nextQuestion = questions[currentIndex + 1];
    const lastQuestion = questions[questions.length - 1];
    const isLastQuestion = currentQuestion?.id === lastQuestion?.id;

    return { nextQuestion, isLastQuestion };
  };

  const calculateCorrectAnswers = (newAnswer: QuestionFormSchema) => {
    let correctCount = 0;
    [...answeredQuestions, newAnswer].forEach((answered) => {
      const question = questions?.find((q) => q.id === answered.questionId);
      if (question?.correctAnswer === answered.answer) correctCount++;
    });
    return correctCount;
  };

  const handleQuestCompletion = async (isAllCorrect: boolean) => {
    const isLastQuest = !nextQuest;

    await updateQuest({
      trailId,
      questId,
      status: isAllCorrect ? QuestStatus.COMPLETED : QuestStatus.IN_PROGRESS,
      attempts: (quest?.attempts ?? 0) + 1,
    });

    await updateTrail({
      trailId,
      status: isLastQuest ? TrailStatus.COMPLETED : TrailStatus.IN_PROGRESS,
    });

    return isLastQuest;
  };

  const handleSubmit = async (data: QuestionFormSchema) => {
    addAnsweredQuestion(data);
    const { nextQuestion, isLastQuestion } = getQuestionNavigation();

    if (!isLastQuestion) {
      return router.push(
        `/trails/${trailId}/quests/${questId}?questionId=${nextQuestion?.id}`
      );
    }

    const correctAnswers = calculateCorrectAnswers(data);
    setCorrectQuestions(correctAnswers);
    const isAllCorrect = correctAnswers === questions?.length;

    const isLastQuest = await handleQuestCompletion(isAllCorrect);

    if (!isAllCorrect) {
      await generateFeedbackTaskTrigger({
        trailId,
        questId,
        contentPrompt: quest?.generationPrompt || "",
        questionsAnswered: questions?.length || 0,
        correctAnswers: isAllCorrect ? questions?.length : 0,
        difficultyLevel: quest?.difficultyLevel || 0,
      });

      return;
    }

    if (!isLastQuest) {
      await updateQuest({
        trailId,
        questId: nextQuest?.id ?? "",
        status: QuestStatus.AVAILABLE,
        attempts: 0,
      });
      router.push(`/trails/${trailId}/quests/${questId}/feedback`);
      return;
    }
  };

  return {
    currentQuestion: currentQuestion,
    isPending: isPendingQuest || isUpdatingQuest || isUpdatingTrail,
    isLastQuestion: getQuestionNavigation().isLastQuestion ?? false,
    handleSubmit,
    isLoading: !currentQuestion || !questions,
  };
}

export function Question({ trailId, questId, questionId }: QuestionProps) {
  const {
    currentQuestion,
    isPending,
    isLastQuestion,
    handleSubmit,
    isLoading,
  } = useQuestionLogic(trailId, questId, questionId);

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
