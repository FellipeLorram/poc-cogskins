"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const feedbackSchema = z.object({
  encouragement: z
    .string()
    .describe("Motivational message based on performance"),
  conceptualFeedback: z
    .string()
    .describe("Feedback about understanding of main concepts"),
  improvementAreas: z
    .array(
      z.object({
        concept: z.string().describe("Concept that needs more attention"),
        suggestion: z.string().describe("Specific suggestion for improvement"),
        resources: z
          .array(z.string().url())
          .describe("Additional resources for study (must be valid URLs)"),
      })
    )
    .describe("Specific areas for improvement with suggestions"),
  nextStepHints: z
    .array(z.string())
    .describe("Hints about what to focus on next"),
});

export type PersonalizedFeedback = z.infer<typeof feedbackSchema>;

interface GenerateFeedbackRequest {
  contentPrompt: string;
  questionsAnswered: number;
  correctAnswers: number;
  difficultyLevel: number;
}

export async function generatePersonalizedFeedback({
  contentPrompt,
  questionsAnswered,
  correctAnswers,
  difficultyLevel,
}: GenerateFeedbackRequest): Promise<PersonalizedFeedback> {
  const performance = (correctAnswers / questionsAnswered) * 100;

  const prompt = `
            Use this optimized prompt as knowledge base:
            ${contentPrompt}

            Generate personalized feedback for a student with:
            - Performance: ${performance}% (${correctAnswers}/${questionsAnswered} correct)
            - Difficulty Level: ${difficultyLevel} (1-3)
            
            Consider:
            - Be encouraging but honest
            - Focus on growth and improvement
            - Provide specific and actionable suggestions
            - Include relevant resources for improvement (must be valid URLs)
            - Adapt tone and complexity to performance level
            - ALL content MUST be in English
            - Use clear and accessible language
            - Be specific in improvement suggestions
            - Suggest resources in English when possible
        `;

  const { object } = await generateObject<PersonalizedFeedback>({
    model: openai("gpt-4o-mini"),
    schema: feedbackSchema,
    prompt,
    temperature: 0.5, // Balancing consistency with personalization
  });

  return object;
}
