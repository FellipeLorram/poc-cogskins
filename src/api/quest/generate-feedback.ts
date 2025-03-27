import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const feedbackSchema = z.object({
    encouragement: z.string().describe('Motivational message based on performance'),
    conceptualFeedback: z.string().describe('Feedback about understanding of key concepts'),
    improvementAreas: z.array(z.object({
        concept: z.string(),
        suggestion: z.string(),
        resources: z.array(z.string())
    })).describe('Specific areas for improvement with suggestions'),
    nextStepHints: z.array(z.string()).describe('Hints about what to focus on next')
});

type PersonalizedFeedback = z.infer<typeof feedbackSchema>;

export async function generatePersonalizedFeedback(
    contentPrompt: string,
    questionsAnswered: number,
    correctAnswers: number,
    difficultyLevel: number
): Promise<PersonalizedFeedback | { error: string }> {
    try {
        const performance = (correctAnswers / questionsAnswered) * 100;
        
        const prompt = `
            Using this optimized content prompt as base knowledge:
            ${contentPrompt}

            Generate personalized feedback for a student with:
            - Performance: ${performance}% (${correctAnswers}/${questionsAnswered} correct)
            - Difficulty Level: ${difficultyLevel} (1-3)
            
            Consider:
            - Be encouraging but honest
            - Focus on growth and improvement
            - Provide specific, actionable suggestions
            - Include relevant resources for improvement
            - Adapt tone and complexity to performance level
        `;

        const { object } = await generateObject<PersonalizedFeedback>({
            model: openai('gpt-3.5-turbo'),
            schema: feedbackSchema,
            prompt,
            temperature: 0.7, // Mais variação para personalização
        });

        return object;
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Failed to generate feedback'
        };
    }
} 