"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { validateContents } from "@/api/content/validate-content";
import { QuestStatus } from "@prisma/client";
import { generateQuestQuestions } from "@/api/quest/generate-questions";
import { generateBadgeImage } from "../badge/generate-badge";
import { GeneratedTrail } from "@/entities/trails";

interface GenerateTrailRequest {
  contents: string[];
}

// Schemas para validação e geração via IA
const badgeSchema = z.object({
  title: z.string().describe("Título curto e atraente para o badge"),
  description: z
    .string()
    .describe("Descrição que explica o que o usuário aprendeu/conquistou"),
});

const questSchema = z.object({
  difficultyLevel: z
    .number()
    .min(1)
    .max(3)
    .describe("Nível de dificuldade do quest (1, 2 ou 3)"),
  generationPrompt: z
    .string()
    .describe("Prompt otimizado para gerar as questões deste quest"),
  description: z
    .string()
    .describe("Descrição do quest que explica sobre o que se trata o quest"),
});

const trailGenerationSchema = z.object({
  title: z
    .string()
    .describe(
      "Título atraente e descritivo para a trilha de aprendizado, somente o titulo"
    ),
  estimatedDuration: z.number().describe("Duração estimada em minutos"),
  badge: badgeSchema,
  quests: z
    .array(questSchema)
    .length(3)
    .describe("Array com 3 quests de dificuldade progressiva"),
});

type TrailGeneration = z.infer<typeof trailGenerationSchema>;

interface ErrorResponse {
  error: string;
  errorType: "VALIDATION_ERROR" | "GENERATION_ERROR";
}

export async function generateTrail(
  request: GenerateTrailRequest
): Promise<GeneratedTrail | ErrorResponse> {
  try {
    // Validate contents
    const validationResult = await validateContents(request);
    if (!validationResult.success) {
      return {
        error: validationResult.error || "Falha ao validar conteúdos",
        errorType: "VALIDATION_ERROR",
      };
    }

    // Generate trail based on validated content
    const prompt = `
            Gere uma trilha de aprendizado baseada no seguinte conteúdo e tema:

            Tema: ${validationResult.theme}
            Conteúdo: ${validationResult.content}

            Crie uma experiência de aprendizado envolvente com:
            - Um título atraente que reflita o conteúdo
            - Duração estimada em minutos
            - 3 quests com dificuldade progressiva (1 a 3)
            - Um badge que represente a conquista
            
            Considere:
            - TODO o conteúdo DEVE ser em português do Brasil
            - Use linguagem clara e acessível
            - O título deve ser cativante e descritivo
            - A duração deve ser realista para o conteúdo
            - Os quests devem ter complexidade crescente
            - O badge deve ter título e descrição envolventes
            - Os prompts de geração devem ser otimizados para gerar questões relevantes
            - Quest precisa de uma descrição que explique sobre o que se trata o quest
        `;

    const { object } = await generateObject<TrailGeneration>({
      model: openai("gpt-3.5-turbo"),
      schema: trailGenerationSchema,
      prompt,
      temperature: 0.4, // Balanceando criatividade com consistência
    });

    // Gerar imagem do badge
    const badgeResult = await generateBadgeImage({
      theme: validationResult.theme || object.title,
    });

    if ("error" in badgeResult) {
      return {
        error: `Falha ao gerar imagem do badge: ${badgeResult.error}`,
        errorType: "GENERATION_ERROR",
      };
    }

    // Generate questions for each quest
    const questsWithQuestions = await Promise.all(
      object.quests.map(async (quest) => {
        const questions = await generateQuestQuestions(
          quest.generationPrompt,
          quest.difficultyLevel
        );

        if ("error" in questions) {
          console.error(
            `Falha ao gerar questões para o quest: ${questions.error}`
          );
          return {
            id: crypto.randomUUID(),
            difficultyLevel: quest.difficultyLevel,
            status: "LOCKED" as QuestStatus,
            attempts: 0,
            generationPrompt: quest.generationPrompt,
            createdAt: new Date(),
            updatedAt: new Date(),
            trailId: "", // Will be filled when the trail is saved
            questions: [], // Quest without questions in case of error
          };
        }

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
          questions: questions,
        };
      })
    );

    // Build trail object in the format of the schema
    const trail: GeneratedTrail = {
      id: crypto.randomUUID(),
      title: object.title,
      status: "DRAFT",
      estimatedDuration: object.estimatedDuration,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "", // Will be filled when there is authentication
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
      quests: questsWithQuestions as GeneratedTrail["quests"],
      badge: {
        id: crypto.randomUUID(),
        title: object.badge.title,
        description: object.badge.description,
        url: badgeResult.url,
        earnedAt: null,
        nftData: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        trailId: "", // Will be filled when the trail is saved
        userId: "", // Will be filled when there is authentication
      },
    };

    return trail;
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Falha ao gerar a trilha. Tente novamente.",
      errorType: "GENERATION_ERROR",
    };
  }
}
