"use server";

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

interface ValidateContentRequest {
    contents: string[];
}

interface ValidateContentResponse {
    success: boolean;
    content: string;
    contentPrompt: string;
    error?: string;
    theme?: string;
}

const validationSchema = z.object({
    coherent: z.boolean().describe('Whether the contents are thematically related'),
    theme: z.string().nullable().describe('Main theme/topic if coherent, null if not'),
    reason: z.string().describe('Detailed explanation of why the contents are coherent or not'),
    unifiedContent: z.string().describe('A unified and organized version of all contents, removing redundancies and organizing in a logical sequence'),
    optimizedPrompt: z.string().describe('An optimized prompt that captures the essence of the content and can be used to generate questions')
});

type ValidationResult = z.infer<typeof validationSchema>;

export async function validateContents(request: ValidateContentRequest): Promise<ValidateContentResponse> {
    try {
        if (!request.contents.length) {
            return {
                success: false,
                content: '',
                contentPrompt: '',
                error: 'No contents provided'
            };
        }

        if (request.contents.length > 3) {
            return {
                success: false,
                content: '',
                contentPrompt: '',
                error: 'Maximum of 3 contents allowed'
            };
        }

        const prompt = `
            Analyze the following contents and determine if they are thematically coherent and related enough to create a meaningful learning trail:

            ${request.contents.map((content, i) => `Content ${i + 1}:\n${content}\n`).join('\n')}

            Consider:
            - Contents should share a common theme or be logically connected
            - They should build upon each other or complement each other
            - The combination should make sense for a learning path
            - If coherent, create a unified version of the content, organizing it logically and removing redundancies
            - Create an optimized prompt that captures the essence of the content for question generation
        `;

        const { object } = await generateObject<ValidationResult>({
            model: openai('gpt-3.5-turbo'),
            schema: validationSchema,
            prompt,
            temperature: 0.1,
        });

        return {
            success: object.coherent,
            content: object.unifiedContent,
            contentPrompt: object.optimizedPrompt,
            error: object.coherent ? undefined : object.reason,
            theme: object.coherent ? object.theme || undefined : undefined
        };
    } catch (error) {
        return {
            success: false,
            content: '',
            contentPrompt: '',
            error: error instanceof Error ? error.message : 'Failed to validate contents'
        };
    }
}
