import { z } from "zod";

// Schemas for validation and AI generation
const badgeSchema = z.object({
  title: z.string().describe("Short and attractive title for the badge"),
  description: z
    .string()
    .describe("Description that explains what the user learned/achieved"),
  generationPrompt: z
    .string()
    .describe(
      "Prompt that will be used as an enhancer for the badge generation"
    ),
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

export const trailGenerationSchema = z.object({
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

export type TrailGeneration = z.infer<typeof trailGenerationSchema>;
