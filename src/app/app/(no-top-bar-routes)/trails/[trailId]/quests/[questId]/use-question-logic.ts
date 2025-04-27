import { generateFeedbackTaskTrigger } from "@/api/quest/generate-feedback-task-trigger";
import { useEarnBadge } from "@/hooks/badge/use-add-badge";
import { useGetQuest } from "@/hooks/quests/use-get-quest";
import { useGetQuestByDifficulty } from "@/hooks/quests/use-get-quest-by-difficulty";
import { useUpdateQuest } from "@/hooks/quests/use-update-quest";
import { useUpdateTrail } from "@/hooks/trails/use-update-trail";
import { QuestStatus, TrailStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { QuestionFormSchema } from "./question-form";
import { useQuestionStore } from "./question-store";
import { useGetBadgeByTrailId } from "@/hooks/badge/use-get-badge-by-trail-id";
import { toast } from "sonner";

interface Props {
  trailId: string;
  questId: string;
  questionId: string;
}

export function useQuestionLogic({ trailId, questId, questionId }: Props) {
  const router = useRouter();

  // data fetch hooks
  const { mutate: updateTrail, isPending: isUpdatingTrail } = useUpdateTrail();
  const { mutate: updateQuest, isPending: isUpdatingQuest } = useUpdateQuest();
  const { data: quest, isPending: isPendingQuest } = useGetQuest({
    trailId,
    questId,
  });
  const { data: badge } = useGetBadgeByTrailId({
    trailId,
  });

  // mutation hooks
  const { mutate: earnBadge, isPending: isEarningBadge } = useEarnBadge();
  const { data: nextQuest } = useGetQuestByDifficulty({
    trailId,
    difficulty: quest?.difficultyLevel ? quest.difficultyLevel + 1 : 0,
  });

  // store
  const { answeredQuestions, addAnsweredQuestion, setCorrectQuestions } =
    useQuestionStore();

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
      status:
        isLastQuest && isAllCorrect
          ? TrailStatus.COMPLETED
          : TrailStatus.IN_PROGRESS,
    });

    return isLastQuest;
  };

  const handleSubmit = async (data: QuestionFormSchema) => {
    addAnsweredQuestion(data);

    // fires a success token if the answer is correct
    if (data.answer === currentQuestion?.correctAnswer) {
      toast.success(currentQuestion.feedback);
    } else {
      toast.error("Hmmm, resposta incorreta!");
    }

    // Update quest attempts after the first question is answered
    if (answeredQuestions.length === 0) {
      await updateQuest({
        trailId,
        questId,
        status: quest?.status || QuestStatus.IN_PROGRESS,
        attempts: (quest?.attempts ?? 0) + 1,
      });
    }

    const { nextQuestion, isLastQuestion } = getQuestionNavigation();

    if (!isLastQuestion) {
      return router.push(
        `/app/trails/${trailId}/quests/${questId}?questionId=${nextQuestion?.id}`
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
      router.push(`/app/trails/${trailId}/quests/${questId}/feedback`);
      return;
    }

    earnBadge({ badgeId: badge?.id ?? "" });

    router.push(`/app/trails/${trailId}/earned`);
  };

  return {
    currentQuestion: currentQuestion,
    isPending:
      isPendingQuest || isUpdatingQuest || isUpdatingTrail || isEarningBadge,
    isLastQuestion: getQuestionNavigation().isLastQuestion ?? false,
    handleSubmit,
    isLoading: !currentQuestion || !questions,
  };
}
