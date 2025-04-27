import { Question } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface Props {
  question: Question;
  onSubmit: (data: QuestionFormSchema) => void;
  isLastQuestion: boolean;
  isPending: boolean;
}

const questionSchema = z.object({
  questionId: z.string(),
  answer: z.coerce.number({
    required_error: "Resposta é obrigatória",
    invalid_type_error: "Resposta é obrigatória",
  }),
});

export type QuestionFormSchema = z.infer<typeof questionSchema>;

export function QuestionForm({
  question,
  onSubmit,
  isLastQuestion,
  isPending,
}: Props) {
  const form = useForm<QuestionFormSchema>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionId: question.id,
      answer: 0,
    },
  });

  const answer = form.watch("answer");
  const disabled = !answer;

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
                  {question.alternatives.map((alternative, index) => (
                    <FormItem
                      key={alternative}
                      className="flex items-center space-x-3 space-y-0 p-4 rounded-md border"
                    >
                      <FormControl>
                        <RadioGroupItem value={index.toString()} />
                      </FormControl>
                      <FormLabel className="font-normal text-sm md:text-base">
                        {alternative}
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
          <Button type="submit" disabled={disabled || isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLastQuestion ? "Finish" : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
