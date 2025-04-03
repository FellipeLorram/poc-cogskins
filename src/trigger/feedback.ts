import { generatePersonalizedFeedback } from "@/api/quest/generate-feedback";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

const generateFeedbackSchema = z.object({
  contentPrompt: z.string(),
  questionsAnswered: z.number(),
  correctAnswers: z.number(),
  difficultyLevel: z.number(),
});

export const generateFeedbackTask = schemaTask({
  id: "feedback-generate",
  maxDuration: 300,
  schema: generateFeedbackSchema,
  run: async (payload, { ctx }) => {
    logger.log("Generating feedback...", { payload, ctx });

    const feedback = await generatePersonalizedFeedback({
      contentPrompt: payload.contentPrompt,
      questionsAnswered: payload.questionsAnswered,
      correctAnswers: payload.correctAnswers,
      difficultyLevel: payload.difficultyLevel,
    });

    return {
      feedback,
    };
  },
});
