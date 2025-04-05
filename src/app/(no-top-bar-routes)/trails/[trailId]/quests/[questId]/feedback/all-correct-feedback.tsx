"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetQuestByDifficulty } from "@/hooks/quests/use-get-quest-by-difficulty";
import { Question } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Props {
  questions: Question[];
  trailId: string;
  currentQuestDifficulty: number;
}

export function IsAllCorrectFeedback({
  questions,
  trailId,
  currentQuestDifficulty,
}: Props) {
  const router = useRouter();

  const { data: nextQuest } = useGetQuestByDifficulty({
    trailId,
    difficulty: currentQuestDifficulty + 1,
    enabled: !(currentQuestDifficulty + 1 > 3),
  });

  const nextQuestFirstQuestion = nextQuest?.questions[0];

  return (
    <div>
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-4xl font-bold">Parabéns!</h1>
        <p className="text-muted-foreground">Você acertou todas as questões.</p>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => router.push(`/trails/${trailId}`)}
        >
          Voltar para a Trilha
        </Button>
        <Button
          className="cursor-pointer"
          onClick={() =>
            router.push(
              `/trails/${trailId}/quests/${nextQuest?.id}?questionId=${nextQuestFirstQuestion?.id}`
            )
          }
        >
          Próximo Quest
        </Button>
      </div>

      <div className="space-y-4 py-8 border-t mt-16">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>{question.text}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{question.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
