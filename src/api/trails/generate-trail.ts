"use server";

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { validateContents } from '@/api/content/validate-content';
import { Prisma, QuestStatus } from '@prisma/client';
import { generateQuestQuestions } from '@/api/quest/generate-questions';

interface GenerateTrailRequest {
    contents: string[];
}

// Schemas para validação e geração via IA
const badgeSchema = z.object({
    icon: z.string().describe('Nome do ícone do Lucide que melhor representa o tema da trilha'),
    title: z.string().describe('Título curto e atraente para o badge'),
    description: z.string().describe('Descrição que explica o que o usuário aprendeu/conquistou')
});

const questSchema = z.object({
    difficultyLevel: z.number().min(1).max(3).describe('Nível de dificuldade do quest (1, 2 ou 3)'),
});

const trailGenerationSchema = z.object({
    title: z.string().describe('Título atraente e descritivo para a trilha de aprendizado'),
    estimatedDuration: z.number().describe('Duração estimada em minutos'),
    badge: badgeSchema,
    quests: z.array(questSchema).length(3).describe('Array com 3 quests de dificuldade progressiva')
});

type TrailGeneration = z.infer<typeof trailGenerationSchema>;

// Tipo que representa uma trilha completa com suas relações
type GeneratedTrail = Prisma.TrailGetPayload<{
    include: {
        inputContents: true;
        quests: true;
        badge: true;
    };
}>;

export async function generateTrail(request: GenerateTrailRequest): Promise<GeneratedTrail | { error: string }> {
    try {
        // 1. Validar conteúdos
        const validationResult = await validateContents(request);
        if (!validationResult.success) {
            return { error: validationResult.error || 'Failed to validate contents' };
        }

        // 2. Gerar trilha com base no conteúdo validado
        const prompt = `
            Generate a learning trail based on the following content and theme:

            Theme: ${validationResult.theme}
            Content: ${validationResult.content}

            Create an engaging learning experience with:
            - An attractive title that reflects the content
            - Estimated duration in minutes
            - 3 quests with progressive difficulty (1 to 3)
            - A badge that represents the achievement
            
            The badge should use a Lucide icon name and have an engaging title and description.
        `;

        const { object } = await generateObject<TrailGeneration>({
            model: openai('gpt-3.5-turbo'),
            schema: trailGenerationSchema,
            prompt,
            temperature: 0.7,
        });

        const trailId = crypto.randomUUID();

        // 3. Gerar questões para cada quest
        const questsWithQuestions = await Promise.all(
            object.quests.map(async (quest) => {
                const questions = await generateQuestQuestions(
                    validationResult.contentPrompt,
                    quest.difficultyLevel
                );

                console.log(questions);

                if ('error' in questions) {
                    console.error(`Failed to generate questions for quest: ${questions.error}`);
                    return {
                        id: crypto.randomUUID(),
                        difficultyLevel: quest.difficultyLevel,
                        status: 'LOCKED' as QuestStatus,
                        attempts: 0,
                        generationPrompt: validationResult.contentPrompt,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        trailId: trailId,
                        questions: [] // Quest sem questões em caso de erro
                    };
                }

                return {
                    id: crypto.randomUUID(),
                    difficultyLevel: quest.difficultyLevel,
                    status: 'LOCKED' as QuestStatus,
                    attempts: 0,
                    generationPrompt: validationResult.contentPrompt,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    trailId: trailId,
                    questions: questions
                };
            })
        );

        // 4. Montar objeto da trilha no formato do schema
        const trail: GeneratedTrail = {
            id: trailId,
            title: object.title,
            status: 'DRAFT',
            estimatedDuration: object.estimatedDuration,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: '', // Será preenchido quando houver autenticação
            inputContents: request.contents.map(content => ({
                id: crypto.randomUUID(),
                type: 'TEXT',
                size: content.length,
                processingStatus: 'COMPLETED',
                processedContent: content,
                createdAt: new Date(),
                updatedAt: new Date(),
                trailId: trailId,
                url: null,
                fileKey: null
            })),
            quests: questsWithQuestions,
            badge: {
                id: crypto.randomUUID(),
                ...object.badge,
                earnedAt: null,
                nftData: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                trailId: trailId,
                userId: '' // Será preenchido quando houver autenticação
            }
        };

        return trail;
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Failed to generate trail'
        };
    }
} 