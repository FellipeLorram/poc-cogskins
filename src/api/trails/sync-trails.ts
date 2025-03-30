// src/api/trails/sync-trails.ts
"use server";

import { prisma } from "@/lib/prisma-client";
import { verifySession } from "../auth/verify-session";
import { Prisma } from "@prisma/client";

type GeneratedTrail = Prisma.TrailGetPayload<{
  include: {
    inputContents: true;
    quests: {
      include: {
        questions: true;
      };
    };
    badge: true;
  };
}>;

export async function syncTrails(trails: GeneratedTrail[]) {
  try {
    const { userId } = await verifySession();
    const results = [];

    // Processar cada trilha
    for (const trail of trails) {
      // Verificar se essa trilha já existe no banco
      const existingTrail = await prisma.trail.findFirst({
        where: {
          userId,
          title: trail.title,
          // Você pode adicionar mais campos para identificação única
        },
      });

      if (!existingTrail) {
        // Criar a trilha se não existir
        const savedTrail = await prisma.trail.create({
          data: {
            title: trail.title,
            status: trail.status,
            estimatedDuration: trail.estimatedDuration,
            userId,

            ...(trail.badge
              ? {
                  badge: {
                    create: {
                      title: trail.badge.title,
                      description: trail.badge.description,
                      url: trail.badge.url,
                      userId,
                    },
                  },
                }
              : {}),

            // Criar conteúdos
            inputContents: {
              createMany: {
                data: trail.inputContents.map((content) => ({
                  type: content.type,
                  url: content.url,
                  fileKey: content.fileKey,
                  size: content.size,
                  processingStatus: content.processingStatus,
                  processedContent: content.processedContent,
                })),
              },
            },
          },
          include: {
            badge: true,
            inputContents: true,
          },
        });

        // Criar quests e questões
        for (const quest of trail.quests) {
          const savedQuest = await prisma.quest.create({
            data: {
              difficultyLevel: quest.difficultyLevel,
              status: quest.status,
              attempts: quest.attempts,
              generationPrompt: quest.generationPrompt,
              trailId: savedTrail.id,
            },
          });

          if (
            "questions" in quest &&
            quest.questions &&
            quest.questions.length > 0
          ) {
            await prisma.question.createMany({
              data: quest.questions.map((question) => ({
                text: question.text,
                alternatives: question.alternatives,
                correctAnswer: question.correctAnswer,
                status: question.status,
                feedback: question.feedback,
                questId: savedQuest.id,
              })),
            });
          }
        }

        results.push(savedTrail);
      }
    }

    return {
      success: true,
      message: `${results.length} trilhas sincronizadas com sucesso.`,
    };
  } catch (error) {
    console.error("Erro ao sincronizar trilhas:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Falha ao sincronizar trilhas",
    };
  }
}
