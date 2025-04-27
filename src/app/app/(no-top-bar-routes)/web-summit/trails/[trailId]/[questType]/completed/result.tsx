"use client";
import { badgeLevelMap } from "@/app/app/(no-top-bar-routes)/web-summit/data";
import { dataStore } from "@/app/app/(no-top-bar-routes)/web-summit/data-store";
import { useStore } from "@/app/app/(no-top-bar-routes)/web-summit/store";
import { TrailId } from "@/app/app/(no-top-bar-routes)/web-summit/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface Props {
  trailId: TrailId;
  questType: string;
}

function getMessageByScore(score: number, level: number) {
  if (score === 5)
    return `Perfect score! You upgraded your badge to level ${level + 1}!`;
  if (score > 3) return "Good job! You did well.";

  return "You can do better! Keep trying!";
}

export function Result({ trailId, questType }: Props) {
  const { correctAnswers, level } = useStore();
  const correctAnswersCount = correctAnswers[questType]?.filter(Boolean).length;
  const currentQuest = dataStore.getQuestByType(trailId, questType);
  const isPerfectScore = correctAnswersCount === currentQuest?.questions.length;
  const currentBadge = badgeLevelMap[level];
  const nextBadge = badgeLevelMap[level + 1];

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md p-4 text-center">
        <CardHeader>
          <CardTitle>Your score: {correctAnswersCount} / 5</CardTitle>
          <CardDescription>
            {getMessageByScore(correctAnswersCount, level)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPerfectScore ? (
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <CardTitle>
                Congratulations! You upgraded your badge to level {level + 1}!
              </CardTitle>
              <Image
                className="w-full"
                src={nextBadge}
                alt="Badge"
                width={1080}
                height={1080}
              />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <CardTitle>
                Make a perfect score to upgrade your badge to level {level + 1}!
              </CardTitle>
              <Image
                className="w-full"
                src={currentBadge}
                alt="Badge"
                width={1080}
                height={1080}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link
            className="w-full"
            href={`/app/web-summit/trails/${trailId}/${questType}/completed?signin-dialog=true`}
          >
            <Button className="w-full">Signup to get your badge</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
