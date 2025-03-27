import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const questionSchema = z.object({
    text: z.string().describe('A clear and engaging question about the content'),
    alternatives: z.array(z.string()).length(4).describe('4 possible answers, with only one being correct'),
    correctAnswer: z.number().min(0).max(3).describe('Index of the correct answer (0-3)'),
    feedback: z.string().describe('Detailed explanation of why the correct answer is right and others are wrong')
});

type QuestionGeneration = z.infer<typeof questionSchema>;

type GeneratedQuestion = Prisma.QuestionGetPayload<{
    select: {
        id: true,
        text: true,
        alternatives: true,
        correctAnswer: true,
        feedback: true,
        status: true
    }
}>;

export async function generateQuestQuestions(
    contentPrompt: string,
    difficultyLevel: number,
    questionsCount: number = 5
): Promise<GeneratedQuestion[] | { error: string }> {
    try {
        const prompt = `
            Using this optimized content prompt as base knowledge:
            ${contentPrompt}

            Generate ${questionsCount} questions about this content with difficulty level ${difficultyLevel} (1-3).
            
            Consider:
            - Questions should test understanding, not just memorization
            - For difficulty 1: Basic comprehension and recall
            - For difficulty 2: Application and analysis
            - For difficulty 3: Evaluation and synthesis
            - Alternatives should be plausible but clearly distinguishable
            - Feedback should be educational and explain both correct and incorrect options
        `;

        const questions: GeneratedQuestion[] = [];

        for (let i = 0; i < questionsCount; i++) {
            const { object } = await generateObject<QuestionGeneration>({
                model: openai('gpt-3.5-turbo'),
                schema: questionSchema,
                prompt,
            });

            questions.push({
                id: crypto.randomUUID(),
                text: object.text,
                alternatives: object.alternatives,
                correctAnswer: object.correctAnswer,
                feedback: object.feedback,
                status: 'UNANSWERED'
            });
        }

        return questions;
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Failed to generate questions'
        };
    }
} 