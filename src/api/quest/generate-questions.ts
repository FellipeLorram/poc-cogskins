"use server";

import { openai } from "@ai-sdk/openai";
import { Prisma, QuestionStatus } from "@prisma/client";
import { generateObject } from "ai";
import { z } from "zod";
import { GenerationError } from "../errors/generation-error";

// Schema for the questions array
const questionsArraySchema = z.object({
  questions: z
    .array(
      z.object({
        text: z
          .string()
          .describe(
            "A clear and engaging question about the content in Portuguese"
          ),
        alternatives: z
          .array(z.string())
          .length(5)
          .describe(
            "4 possible alternatives in Portuguese, with only one being correct"
          ),
        correctAnswer: z
          .number()
          .min(0)
          .max(3)
          .describe("Index of the correct answer (0-3)"),
        feedback: z
          .string()
          .describe(
            "Detailed explanation in Portuguese about why the correct answer is right and why the others are wrong"
          ),
      })
    )
    .min(3)
    .describe(
      "Array of unique questions, each testing different aspects of the content"
    ),
});

type QuestionGeneration = z.infer<typeof questionsArraySchema>;

type GeneratedQuestion = Prisma.QuestionGetPayload<{
  select: {
    id: true;
    text: true;
    alternatives: true;
    correctAnswer: true;
    feedback: true;
    status: true;
  };
}>;

export async function generateQuestQuestions(
  contentPrompt: string,
  difficultyLevel: number,
  questionsCount: number = 5
): Promise<GeneratedQuestion[]> {
  const uniqueQuestions = new Set<string>();
  const questions: GeneratedQuestion[] = [];
  const maxAttempts = 3; // Limite de tentativas para evitar loop infinito
  let currentAttempt = 0;

  while (questions.length < questionsCount && currentAttempt < maxAttempts) {
    const prompt = `
            Use this optimized prompt as knowledge base:
            ${contentPrompt}

            Generate ${questionsCount - questions.length} UNIQUE and DIFFERENT questions about this content with difficulty level ${difficultyLevel} (1-3).
            
            Consider:
            - ALL questions and answers MUST be in English
            - Each question must be completely different from the others
            - Avoid repeating the same topic or concept in multiple questions
            - Questions should test comprehension, not just memorization
            - For difficulty 1: Basic understanding and recall (Bloom's Remembering & Understanding)
            - For difficulty 2: Application and analysis (Bloom's Applying & Analyzing)
            - For difficulty 3: Evaluation and synthesis (Bloom's Evaluating & Creating)
            - Questions must follow Bloom's Taxonomy levels:
              * Remembering (Level 1): Recall facts, terms, basic concepts
              * Understanding (Level 1): Explain ideas or concepts
              * Applying (Level 2): Use information in new situations
              * Analyzing (Level 2): Draw connections among ideas
              * Evaluating (Level 3): Justify a stand or decision
              * Creating (Level 3): Produce new or original work
              - Each question must have EXACTLY 4 alternatives (A-D):
                * 1 correct answer (not obvious)
                * 2 plausible wrong answers (common mistakes)
                * 1 clearly incorrect answer
                * DO NOT include "None of the above" or "All of the above" options

            - Alternatives should be plausible but clearly distinguishable
            - Feedback should be educational and explain both the correct and incorrect answers
            - Use clear and accessible language (high school level)
            - Difficulty should gradually increase from question 1 (easiest) to question 5 (hardest)
            
            - Avoid ambiguous or confusing questions
            ${
              questions.length > 0
                ? `
            IMPORTANT: Do not generate questions similar to the following existing questions:
            ${questions.map((q) => q.text).join("\n")}`
                : ""
            }
            
            IMPORTANT: Your response MUST follow EXACTLY this JSON format:
            {
              "questions": [
                {
                  "text": "Question in Portuguese?",
                  "alternatives": ["Alternative A", "Alternative B", "Alternative C", "Alternative D"],
                  "correctAnswer": 0,
                  "feedback": "Detailed explanation in Portuguese"
                },
                ...
              ]
            }
        `;

    try {
      // Generate questions
      const { object } = await generateObject<QuestionGeneration>({
        model: openai("gpt-4o-mini"),
        schema: questionsArraySchema,
        prompt,
        temperature: 0.3 + currentAttempt * 0.2, // Increases temperature with each attempt for more variation
      });

      // Process new questions
      for (const question of object.questions) {
        const normalizedText = question.text
          .toLowerCase()
          .trim()
          .replace(/\s+/g, " ");

        if (!uniqueQuestions.has(normalizedText)) {
          uniqueQuestions.add(normalizedText);
          questions.push({
            id: crypto.randomUUID(),
            text: question.text,
            alternatives: question.alternatives,
            correctAnswer: question.correctAnswer,
            feedback: question.feedback,
            status: "UNANSWERED" as QuestionStatus,
          });

          if (questions.length === questionsCount) {
            break;
          }
        }
      }
    } catch (error) {
      console.error(`Attempt ${currentAttempt + 1} failed:`, error);
      // Continue to next attempt
    }

    currentAttempt++;
  }

  // Se após todas as tentativas ainda não tivermos questões suficientes
  if (questions.length < 3)
    throw new GenerationError(
      "Could not generate enough unique questions after multiple attempts. Please try again."
    );

  // Retorna as questões mesmo se não atingiu o número ideal, desde que tenha pelo menos 3
  return questions;
}
