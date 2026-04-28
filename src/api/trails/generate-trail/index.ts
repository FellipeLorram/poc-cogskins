import { validateContents } from "@/api/content/validate-content";
import { generateTrailPrompt } from "@/api/prompts/generate-trail-prompt";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { trailGenerationSchema } from "./schema";
import { generateBadgeImage } from "@/api/badge/generate-badge";
import { generateQuest } from "@/api/quest/generate-quest";
import { GeneratedTrail } from "@/entities/trails";

const generateTrailRequestSchema = z.object({
  contents: z.array(z.string()).min(1).max(3),
});

type GenerateTrailRequest = z.infer<typeof generateTrailRequestSchema>;

const DATE_NOW = new Date();

export async function generateTrail(
  request: GenerateTrailRequest
): Promise<GeneratedTrail> {
  const { contents } = generateTrailRequestSchema.parse(request);

  const validationResult = await validateContents({
    contents,
  });

  const prompt = generateTrailPrompt(validationResult);

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: trailGenerationSchema,
    prompt,
    temperature: 0.4, // Balancing creativity with consistency
  });

  const badgeResult = await generateBadgeImage({
    badge: {
      title: object.badge.title,
      description: object.badge.description,
      level: 0,
      generationPrompt: object.badge.generationPrompt,
    },
  });

  const quests = await Promise.all(
    object.quests.map(async (quest) => {
      return generateQuest({ quest });
    })
  );

  const questsSortedByDifficulty = quests.sort(
    (a, b) => a.difficultyLevel - b.difficultyLevel
  );

  return {
    id: crypto.randomUUID(),
    title: object.title,
    description: null,
    status: "DRAFT",
    estimatedDuration: object.estimatedDuration,
    createdAt: DATE_NOW,
    updatedAt: DATE_NOW,
    userId: "", // Will be filled when there is authentication
    flag: "",
    inputContents: request.contents.map((content) => ({
      id: crypto.randomUUID(),
      type: "TEXT",
      size: content.length,
      processingStatus: "COMPLETED",
      processedContent: content,
      createdAt: DATE_NOW,
      updatedAt: DATE_NOW,
      trailId: "", // Will be filled when the trail is saved
      url: null,
      fileKey: null,
    })),
    quests: questsSortedByDifficulty.map((quest) => ({
      id: crypto.randomUUID(),
      difficultyLevel: quest.difficultyLevel,
      status: quest.status,
      attempts: 0,
      generationPrompt: quest.generationPrompt,
      description: quest.description,
      createdAt: DATE_NOW,
      updatedAt: DATE_NOW,
      questions: quest.questions.map((question) => ({
        ...question,
        createdAt: DATE_NOW,
        updatedAt: DATE_NOW,
        questId: "", // Will be filled when the trail is saved
      })),
      trailId: "", // Will be filled when the trail is saved
      completedAt: null,
      webSummitTrailId: null,
    })),
    badge: {
      id: crypto.randomUUID(),
      title: object.badge.title,
      description: object.badge.description,
      generationPrompt: object.badge.generationPrompt,
      url: badgeResult.url,
      badgeUrls: [
        {
          id: crypto.randomUUID(),
          url: badgeResult.url,
          createdAt: DATE_NOW,
          updatedAt: DATE_NOW,
          badgeId: null, // Will be filled when the trail is saved
        },
      ],
      earnedAt: null,
      nftData: null,
      createdAt: DATE_NOW,
      level: 0,
      updatedAt: DATE_NOW,
      trailId: "", // Will be filled when the trail is saved
      userId: "", // Will be filled when there is authentication
      status: "LOCKED",
      unLockedAt: null,
      flag: "",
    },
  };
}
