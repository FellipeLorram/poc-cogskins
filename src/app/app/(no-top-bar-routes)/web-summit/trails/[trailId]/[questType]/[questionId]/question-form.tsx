"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Question, TrailId } from "../../../../types";
import { useStore } from "../../../../store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetBadgeByTrailId } from "@/hooks/badge/use-get-badge-by-trail-id";
import { useUpdateBadge } from "@/hooks/badge/use-update-bade";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { useCreateWeb2025Badge } from "@/hooks/badge/use-create-web2025-badge";
interface Props {
  question: Question;
  nextQuestion: Question | undefined;
  trailId: TrailId;
  questType: string;
  isFirstQuestion: boolean;
}

const questionSchema = z.object({
  questionId: z.string(),
  answer: z.coerce.number({
    required_error: "Answer is required",
    invalid_type_error: "Answer is required",
  }),
});

export type QuestionFormSchema = z.infer<typeof questionSchema>;

export function QuestionForm({
  question,
  nextQuestion,
  trailId,
  questType,
  isFirstQuestion,
}: Props) {
  const { data: user } = useSessionUser();
  const { data: badge } = useGetBadgeByTrailId({
    trailId: "cm9z6i9fz0000rxy2ygdnnss9",
  });
  const { mutateAsync: updateBadge, isPending } = useUpdateBadge();
  const { mutateAsync: createBadge, isPending: isCreatingBadge } =
    useCreateWeb2025Badge();

  const router = useRouter();
  const {
    level,
    correctAnswers,
    setCorrectAnswers,
    addCompletedQuest,
    setCompletedAnyQuest,
    setLevel,
  } = useStore();
  const form = useForm<QuestionFormSchema>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionId: question.id,
      answer: 0,
    },
  });

  const answer = form.watch("answer");
  const disabled = !answer || isPending || isCreatingBadge;

  async function onSubmit(data: QuestionFormSchema) {
    const isCorrect = question.options[data.answer] === question.correctAnswer;
    const answers = [...(correctAnswers[questType] ?? []), isCorrect];

    if (isFirstQuestion) {
      setCorrectAnswers({
        ...correctAnswers,
        [questType]: [isCorrect],
      });
    } else {
      setCorrectAnswers({
        ...correctAnswers,
        [questType]: answers,
      });
    }

    if (answers.length === 5) {
      const isPerfectScore = answers.every((answer) => answer);

      if (isPerfectScore) {
        addCompletedQuest(questType);
        setLevel(level + 1);
      }
    }

    if (isCorrect) toast.success("Correct! Great job!");
    else {
      toast.error(`Incorrect! The correct answer is ${question.correctAnswer}`);
    }

    if (!nextQuestion) {
      if (badge) {
        await updateBadge({ badgeId: badge.id, level: badge.level + 1 });
      } else if (user) {
        await createBadge(user.id);
      }
      setCompletedAnyQuest(true);
      router.push(`/app/web-summit/trails/${trailId}/${questType}/completed`);
    } else {
      router.push(
        `/app/web-summit/trails/${trailId}/${questType}/${nextQuestion.id}`
      );
    }
  }

  useEffect(() => {
    form.reset({
      questionId: question.id,
      answer: 0,
    });
  }, [question.id, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-medium leading-6">
                {question.text}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  className="flex flex-col space-y-1"
                  key={question.id}
                >
                  {question.options.map((option, index) => (
                    <FormItem
                      key={option}
                      className="flex items-center space-x-3 space-y-0 p-4 rounded-md border"
                    >
                      <FormControl>
                        <RadioGroupItem value={index.toString()} />
                      </FormControl>
                      <FormLabel className="font-normal text-sm md:text-base">
                        {option}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={disabled}>
            Next Question
          </Button>
        </div>
      </form>
    </Form>
  );
}
