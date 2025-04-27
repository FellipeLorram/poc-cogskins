"use client";

import { useGetQuest } from "@/hooks/quests/use-get-quest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  trailId: string;
  questId: string;
}

export function Completed({ trailId, questId }: Props) {
  const { data: quest } = useGetQuest({ trailId, questId });

  return (
    <div>
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-4xl font-bold">Parabéns!</h1>
        <p className="text-muted-foreground">Você finalizou este quest.</p>
      </div>

      <div className="space-y-4 py-8 border-t mt-8">
        {quest?.questions.map((question) => (
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
