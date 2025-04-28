"use server";

import { validateContents } from "@/api/content/validate-content";
import { generateQuestQuestions } from "@/api/quest/generate-questions";
import { GeneratedTrail } from "@/entities/trails";
import { openai } from "@ai-sdk/openai";
import { QuestStatus } from "@prisma/client";
import { generateObject } from "ai";
import { z } from "zod";
import { generateBadgeImage } from "../badge/generate-badge";

interface GenerateTrailRequest {
  contents: string[];
}

// Schemas for validation and AI generation
const badgeSchema = z.object({
  title: z.string().describe("Short and attractive title for the badge"),
  description: z
    .string()
    .describe("Description that explains what the user learned/achieved"),
});

const questSchema = z.object({
  difficultyLevel: z
    .number()
    .min(1)
    .max(3)
    .describe("Quest difficulty level (1, 2 or 3)"),
  generationPrompt: z
    .string()
    .describe("Optimized prompt to generate questions for this quest"),
  description: z
    .string()
    .describe(
      "Quest description that explains what the quest is about, referring to the user's learning, doesn't need to include the word 'quest'"
    ),
});

const trailGenerationSchema = z.object({
  title: z
    .string()
    .describe(
      "Short and attractive title for the learning trail, do not include the word 'Trail' in the title. Should be a title that is easy to understand and remember. Short and direct."
    ),
  estimatedDuration: z.number().describe("Estimated duration in minutes"),
  badge: badgeSchema,
  quests: z
    .array(questSchema)
    .length(3)
    .describe("Array with 3 quests of progressive difficulty"),
});

type TrailGeneration = z.infer<typeof trailGenerationSchema>;

export async function generateTrail(
  request: GenerateTrailRequest
): Promise<GeneratedTrail> {
  // Validate contents
  const validationResult = await validateContents(request);

  // Generate trail based on validated content
  const prompt = `
            Generate a learning trail based on the following content and theme:

            Theme: ${validationResult.theme}
            Content: ${validationResult.content}

            Create an engaging learning experience with:
            - An attractive title that reflects the content
            - Estimated duration in minutes
            - 3 quests with progressive difficulty (1 to 3)
            - A badge that represents the achievement
            
            Consider:
            - ALL content MUST be in English
            - Use clear and accessible language
            - The title should be captivating and descriptive
            - The duration should be realistic for the content
            - Quests should have increasing complexity
            - The badge should have engaging title and description
            - Generation prompts should be optimized to generate relevant questions
            - Quest needs a description that explains what the quest is about
        `;

  const { object } = await generateObject<TrailGeneration>({
    model: openai("gpt-4o-mini"),
    schema: trailGenerationSchema,
    prompt,
    temperature: 0.4, // Balancing creativity with consistency
  });

  // Gerar imagem do badge
  const badgeResult = await generateBadgeImage({
    theme: validationResult.theme || object.title,
  });

  // Generate questions for each quest
  const questsWithQuestions = await Promise.all(
    object.quests.map(async (quest) => {
      try {
        const questions = await generateQuestQuestions(
          quest.generationPrompt,
          quest.difficultyLevel
        );

        const status = quest.difficultyLevel === 1 ? "AVAILABLE" : "LOCKED";

        return {
          id: crypto.randomUUID(),
          difficultyLevel: quest.difficultyLevel,
          status: status as QuestStatus,
          attempts: 0,
          generationPrompt: quest.generationPrompt,
          description: quest.description,
          createdAt: new Date(),
          updatedAt: new Date(),
          trailId: "", // Will be filled when the trail is saved
          questions: questions,
        };
      } catch (error) {
        console.error(
          `Failed to generate questions for quest level ${quest.difficultyLevel}:`,
          error
        );
        // Return a quest with empty questions array to allow the trail generation to continue
        return {
          id: crypto.randomUUID(),
          difficultyLevel: quest.difficultyLevel,
          status: "LOCKED" as QuestStatus,
          attempts: 0,
          generationPrompt: quest.generationPrompt,
          description: quest.description,
          createdAt: new Date(),
          updatedAt: new Date(),
          trailId: "", // Will be filled when the trail is saved
          questions: [],
        };
      }
    })
  );

  // Build trail object in the format of the schema
  const trail: GeneratedTrail = {
    description: null,
    id: crypto.randomUUID(),
    title: object.title,
    status: "DRAFT",
    estimatedDuration: object.estimatedDuration,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "", // Will be filled when there is authentication
    flag: "",
    inputContents: request.contents.map((content) => ({
      id: crypto.randomUUID(),
      type: "TEXT",
      size: content.length,
      processingStatus: "COMPLETED",
      processedContent: content,
      createdAt: new Date(),
      updatedAt: new Date(),
      trailId: "", // Will be filled when the trail is saved
      url: null,
      fileKey: null,
    })),
    quests: questsWithQuestions.sort(
      (a, b) => a.difficultyLevel - b.difficultyLevel
    ) as GeneratedTrail["quests"],
    badge: {
      id: crypto.randomUUID(),
      title: object.badge.title,
      description: object.badge.description,
      url: badgeResult.url,
      earnedAt: null,
      nftData: null,
      createdAt: new Date(),
      level: 1,
      updatedAt: new Date(),
      trailId: "", // Will be filled when the trail is saved
      userId: "", // Will be filled when there is authentication
      status: "LOCKED",
      unLockedAt: null,
      flag: "",
    },
  };

  return trail;
}
