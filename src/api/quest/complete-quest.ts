import { TrailStatus } from "@prisma/client";

import { QuestStatus } from "@prisma/client";
import { generateBadgeImage } from "../badge/generate-badge";
import { getBadgeByTrailId } from "../badge/get-badge-by-trail-id";
import { BadgeNotFoundError } from "../../errors/badge-not-found-error";
import { updateTrail } from "../trails/update-trail";
import { updateQuest } from "./update-quest";
import { levelUpBadgeLevel } from "../badge/level-up-badge-level";

interface CompleteQuestRequest {
  trailId: string;
  questId: string;
  isAllCorrect: boolean;
  isLastQuest: boolean;
  attempts: number;
}

export async function completeQuest({
  trailId,
  questId,
  isAllCorrect,
  attempts,
  isLastQuest,
}: CompleteQuestRequest) {
  await updateQuest({
    questId,
    status: isAllCorrect ? QuestStatus.COMPLETED : QuestStatus.IN_PROGRESS,
    attempts,
  });

  await updateTrail({
    trailId,
    data: {
      status: isLastQuest ? TrailStatus.COMPLETED : TrailStatus.IN_PROGRESS,
    },
  });

  if (isLastQuest && isAllCorrect) {
    const badge = await getBadgeByTrailId(trailId);

    if (!badge) {
      throw new BadgeNotFoundError("Badge not found");
    }

    const newBadge = await generateBadgeImage({
      badge: {
        title: badge.title,
        description: badge.description,
        level: badge.level,
        generationPrompt: badge.generationPrompt ?? "",
      },
    });

    await levelUpBadgeLevel({
      badgeId: badge.id,
      level: badge.level + 1,
      url: newBadge.url,
    });
  }
}
