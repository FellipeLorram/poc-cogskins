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

interface Props {
  trailId: string;
  questId: string;
  questionId: string;
}

export function Question({ trailId, questId, questionId }: Props) {
  const router = useRouter();
  const { data: quest, isPending: isPendingQuest } = useGetQuest({
    trailId,
    questId,
  });
  const { mutate: updateQuest, isPending: isUpdatingQuest } = useUpdateQuest();
  const { mutate: updateTrail, isPending: isUpdatingTrail } = useUpdateTrail();
  const { data: nextQuest } = useGetQuestByDifficulty({
    trailId,
    difficulty: quest?.difficultyLevel ? quest.difficultyLevel + 1 : 0,
    enabled:
      quest?.difficultyLevel !== undefined && quest.difficultyLevel + 1 > 3,
  });
  const { answeredQuestions, addAnsweredQuestion, setCorrectQuestions } =
    useQuestionStore();

  const questions = quest?.questions;
  const currentQuestion = questions?.find((q) => q.id === questionId);

  if (isPendingQuest || !currentQuestion || !questions) return null;

  const currentIndex = questions.findIndex((q) => q.id === questionId);
  const nextQuestion = questions[currentIndex + 1];
  const lastQuestion = questions[questions.length - 1];
  const isLastQuestion = currentQuestion?.id === lastQuestion?.id;

  async function onSubmit(data: QuestionFormSchema) {
    addAnsweredQuestion(data);

    if (!isLastQuestion) {
      return router.push(
        `/trails/${trailId}/quests/${questId}?questionId=${nextQuestion?.id}`
      );
    }

    let correctQuestions = 0;
    answeredQuestions.forEach((answeredQuestion) => {
      const question = questions?.find(
        (q) => q.id === answeredQuestion.questionId
      );

      if (question?.correctAnswer === answeredQuestion.answer) {
        correctQuestions++;
      }
    });

    const isAllQuestionCorrect = correctQuestions === questions?.length;

    updateQuest({
      trailId,
      questId,
      status: isAllQuestionCorrect
        ? QuestStatus.COMPLETED
        : QuestStatus.IN_PROGRESS,
      attempts: quest?.attempts ? quest.attempts + 1 : 1,
    });

    if (nextQuest) {
      updateQuest({
        trailId,
        questId: nextQuest.id,
        status: QuestStatus.AVAILABLE,
        attempts: 0,
      });
    }

    updateTrail({
      trailId,
      status: TrailStatus.IN_PROGRESS,
    });

    setCorrectQuestions(correctQuestions);

    await generateFeedbackTaskTrigger({
      trailId,
      questId,
      contentPrompt: quest?.generationPrompt || "",
      questionsAnswered: questions?.length || 0,
      correctAnswers: isAllQuestionCorrect ? questions?.length : 0,
      difficultyLevel: quest?.difficultyLevel || 0,
    });
  }

  return (
    <QuestionForm
      isLastQuestion={isLastQuestion}
      question={currentQuestion}
      onSubmit={onSubmit}
      isPending={isUpdatingQuest || isUpdatingTrail}
    />
  );
}
