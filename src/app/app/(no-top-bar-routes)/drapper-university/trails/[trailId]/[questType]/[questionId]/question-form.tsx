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
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { useCreateWeb2025Badge } from "@/hooks/badge/use-create-web2025-badge";
import { useGetBadgeByFlag } from "@/hooks/badge/use-get-badge-by-flag";
import { useUpdateBadge } from "@/hooks/badge/use-update-bade";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useStore } from "../../../../store";
import { Question, TrailId } from "../../../../types";
import { dataStore } from "../../../../data-store";
import { addCompleteWebSummitQuest } from "@/api/quest/add-complete-websummit-quest";
import { Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const { data: user } = useSessionUser();
  const { data: badge } = useGetBadgeByFlag({
    flag: "drapper-university",
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
  const disabled =
    !answer ||
    isPending ||
    isCreatingBadge ||
    form.formState.isSubmitting ||
    loading;

  async function onSubmit(data: QuestionFormSchema) {
    setLoading(true);
    const isCorrect = question.options[data.answer] === question.correctAnswer;
    const answers = [...(correctAnswers[questType] ?? []), isCorrect];
    const isPerfectScore = answers.every((answer) => answer);

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
      const quest = dataStore.getQuestByType(trailId, questType);

      if (isPerfectScore) {
        addCompletedQuest(quest?.id ?? "");
        setLevel(level + 1);
        await addCompleteWebSummitQuest(quest?.id ?? "");
      }
    }

    if (isCorrect) toast.success("Correct! Great job!");
    else {
      toast.error(`Incorrect! The correct answer is ${question.correctAnswer}`);
    }

    if (!nextQuestion) {
      if (badge) {
        if (isPerfectScore) {
          await updateBadge({ badgeId: badge.id, level: badge.level + 1 });
        }
      } else if (user) {
        await createBadge(user.id);
      }
      setCompletedAnyQuest(true);
      setLoading(false);
      router.push(
        `/app/drapper-university/trails/${trailId}/${questType}/completed`
      );
    } else {
      setLoading(false);
      router.push(
        `/app/drapper-university/trails/${trailId}/${questType}/${nextQuestion.id}`
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
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Next Question"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
