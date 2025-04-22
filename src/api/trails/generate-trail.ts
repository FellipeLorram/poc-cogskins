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
    .describe(
      "Descrição do quest que explica sobre o que se trata o quest, remetendo ao aprendizado do usuário, não precisa incluir a palavra 'quest'"
    ),
});

const trailGenerationSchema = z.object({
  title: z
    .string()
    .describe(
      "Título curto e atraente para a trilha de aprendizado, não incluir a palavra 'Trilha' no título. Deve ser um título que seja fácil de entender e lembrar. Curto e direto."
    ),
  estimatedDuration: z.number().describe("Duração estimada em minutos"),
  badge: badgeSchema,
  quests: z
    .array(questSchema)
    .length(3)
    .describe("Array com 3 quests de dificuldade progressiva"),
});

type TrailGeneration = z.infer<typeof trailGenerationSchema>;

export async function generateTrail(
  request: GenerateTrailRequest
): Promise<GeneratedTrail> {
  // Validate contents
  const validationResult = await validateContents(request);

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
    },
  };

  return trail;
}
