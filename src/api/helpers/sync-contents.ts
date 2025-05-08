"use server";

import { prisma } from "@/lib/prisma-client";
import { Prisma } from "@prisma/client";
import { getSessionUser } from "../user/get-session-user";

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

interface Props {
  trails: GeneratedTrail[];
  badges: string[];
  webSummitBadgeLevel?: number;
  completedQuests: string[];
}

const badgeLevelMap: Record<number, string> = {
  0: "/badges/drapper-level-0.png",
  1: "/badges/drapper-level-1.png",
  2: "/badges/drapper-level-2.png",
  3: "/badges/drapper-level-3.png",
};

export async function syncContents({
  trails,
  badges,
  webSummitBadgeLevel,
  completedQuests,
}: Props) {
  try {
    const user = await getSessionUser();
    const badge = await prisma.badge.findFirst({
      where: {
        userId: user?.id,
        flag: "web-summit-2025",
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const results = [];

    // Processar cada trilha
    for (const trail of trails) {
      // Verificar se essa trilha já existe no banco
      const existingTrail = await prisma.trail.findFirst({
        where: {
          userId: user.id,
          title: trail.title,
        },
      });

      if (!existingTrail) {
        // Criar a trilha se não existir
        const savedTrail = await prisma.trail.create({
          data: {
            title: trail.title,
            status: trail.status,
            estimatedDuration: trail.estimatedDuration,
            userId: user.id,

            ...(trail.badge
              ? {
                  badge: {
                    create: {
                      title: trail.badge.title,
                      description: trail.badge.description,
                      url: trail.badge.url,
                      userId: user.id,
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
              description: quest.description,
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

    for (const badge of badges) {
      await prisma.badge.update({
        where: { id: badge },
        data: { userId: user.id },
      });
    }

    if (webSummitBadgeLevel !== undefined && !badge) {
      const fakeTrail = await prisma.trail.create({
        data: {
          userId: user.id,
          title: "Drapper University Badge",
          estimatedDuration: 10,
          flag: "drapper-university",
        },
      });
      await prisma.badge.create({
        data: {
          title: "Drapper University Badge",
          url: badgeLevelMap[webSummitBadgeLevel],
          userId: user.id,
          description: "Drapper University Badge",
          level: webSummitBadgeLevel,
          earnedAt: new Date(),
          status: "UNLOCKED",
          trailId: fakeTrail.id,
          flag: "drapper-university",
        },
      });

      for (const quest of completedQuests) {
        await prisma.completedQuest.create({
          data: { id: quest, userId: user.id },
        });
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
