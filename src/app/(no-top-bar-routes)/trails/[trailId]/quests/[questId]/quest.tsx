"use client";

import { generateFeedbackTaskTrigger } from "@/api/quest/generate-feedback-task-trigger";
import { useGetQuest } from "@/hooks/quests/use-get-quest";
import { useUpdateQuest } from "@/hooks/quests/use-update-quest";
import { useUpdateTrail } from "@/hooks/trails/use-update-trail";
import { QuestStatus, TrailStatus } from "@prisma/client";
import { ReactNode, useMemo, useEffect } from "react";
import { QuestionForm, QuestionFormSchema } from "./question-form";
import { useQuestionStore } from "./question-store";

interface Props {
  trailId: string;
  questId: string;
}

export function Quest({ trailId, questId }: Props) {
  const { data: quest } = useGetQuest({ trailId, questId });
  const { mutate: updateQuest } = useUpdateQuest();
  const { mutate: updateTrail } = useUpdateTrail();

  const questions = quest?.questions;

  const {
    currentQuestion,
    answeredQuestions,
    addAnsweredQuestion,
    setCurrentQuestion,
    setCorrectQuestions,
  } = useQuestionStore();

  async function answerQuestions(data: QuestionFormSchema[]) {
    let correctQuestions = 0;
    data.forEach((answeredQuestion) => {
      const question = questions?.find(
        (q) => q.id === answeredQuestion.questionId
      );

      if (question?.correctAnswer === answeredQuestion.answer) {
        correctQuestions++;
      }
    });

    const isAllQuestionCorrect = correctQuestions === questions?.length;

    setCorrectQuestions(correctQuestions);

    updateQuest({
      trailId,
      questId,
      status: isAllQuestionCorrect
        ? QuestStatus.COMPLETED
        : QuestStatus.IN_PROGRESS,
      attempts: quest?.attempts ? quest.attempts + 1 : 1,
    });

    updateTrail({
      trailId,
      status: TrailStatus.IN_PROGRESS,
    });

    await generateFeedbackTaskTrigger({
      trailId,
      questId,
      contentPrompt: quest?.generationPrompt || "",
      questionsAnswered: questions?.length || 0,
      correctAnswers: isAllQuestionCorrect ? questions?.length : 0,
      difficultyLevel: quest?.difficultyLevel || 0,
    });
  }

  const questionsMap = useMemo(() => {
    const map = new Map<string, ReactNode>();

    questions?.forEach((question, index) => {
      const nextQuestion = questions[index + 1];
      const isLastQuestion = !nextQuestion;

      function onSubmit(data: QuestionFormSchema) {
        addAnsweredQuestion(data);

        const nextQuestion = questions?.[index + 1];
        const isLastQuestion = !nextQuestion;

        if (isLastQuestion) {
          answerQuestions([...answeredQuestions, data]);
        } else {
          setCurrentQuestion(nextQuestion?.id);
        }
      }

      map.set(
        question.id,
        <QuestionForm
          isLastQuestion={isLastQuestion}
          key={question.id}
          question={question}
          onSubmit={onSubmit}
        />
      );
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, answeredQuestions]);

  useEffect(() => {
    if (questions?.length && !currentQuestion) {
      setCurrentQuestion(questions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, currentQuestion]);

  return currentQuestion && questionsMap.get(currentQuestion);
}
