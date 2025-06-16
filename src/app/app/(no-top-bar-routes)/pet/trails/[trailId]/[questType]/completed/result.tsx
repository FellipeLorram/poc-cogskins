"use client";

import { badgeLevelMap } from "@/app/app/(no-top-bar-routes)/pet/data";
import { dataStore } from "@/app/app/(no-top-bar-routes)/pet/data-store";
import { useStore } from "@/app/app/(no-top-bar-routes)/pet/store";
import { TrailId } from "@/app/app/(no-top-bar-routes)/pet/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { useGetBadgeByFlag } from "@/hooks/badge/use-get-badge-by-flag";
import Image from "next/image";
import Link from "next/link";

interface Props {
  trailId: TrailId;
  questType: string;
}

export function Result({ trailId, questType }: Props) {
  const { data: sessionUser } = useSessionUser();
  const { correctAnswers, level } = useStore();

  const { data: badge } = useGetBadgeByFlag({
    flag: "pet",
  });

  const correctAnswersCount = correctAnswers[questType]?.filter(Boolean).length;
  const currentQuest = dataStore.getQuestByType(trailId, questType);
  const isPerfectScore = correctAnswersCount === currentQuest?.questions.length;
  let badgeLevel = level;
  let currentBadge = badgeLevelMap[level];

  if (badge) {
    currentBadge = badge.url;
    badgeLevel = badge.level;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg p-4 text-center">
        <CardHeader>
          <CardTitle>Your score: {correctAnswersCount} / 5</CardTitle>
        </CardHeader>
        <CardContent>
          {isPerfectScore ? (
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <CardTitle>
                Perfect score! You upgraded your badge to level {badgeLevel}!
              </CardTitle>
              <Image
                className="w-full"
                src={currentBadge}
                alt="Badge"
                width={1080}
                height={1080}
              />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <CardTitle>
                Make a perfect score to upgrade your badge to level{" "}
                {badgeLevel + 1}!
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
        <CardFooter className="flex flex-col gap-2">
          {!sessionUser && (
            <Link
              className="w-full"
              href={`/app/pet/trails/${trailId}/${questType}/completed?signin-dialog=true`}
            >
              <Button className="w-full">Signup to get your badge</Button>
            </Link>
          )}
          <Link className="w-full" href={`/app/pet/trails/${trailId}`}>
            <Button variant="outline" className="w-full">
              Back to start
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
