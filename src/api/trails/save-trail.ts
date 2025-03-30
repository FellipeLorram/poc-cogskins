"use server";

import { prisma } from "@/lib/prisma-client";
import { Prisma, QuestionStatus } from "@prisma/client";
import { verifySession } from "../auth/verify-session";

type GeneratedTrail = Prisma.TrailGetPayload<{
  include: {
    inputContents: true;
    quests: true;
    badge: true;
  };
}>;

type GeneratedQuest = Prisma.QuestGetPayload<{
  include: {
    questions: true;
  };
}>;

export async function saveTrail(trail: GeneratedTrail) {
  try {
    const { userId } = await verifySession();

    // Create base trail data
    const baseTrailData = {
      title: trail.title,
      status: trail.status,
      estimatedDuration: trail.estimatedDuration,
      userId,
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
    };

    // Create trail with or without badge
    const savedTrail = await prisma.trail.create({
      data: trail.badge
        ? {
            ...baseTrailData,
            badge: {
              create: {
                title: trail.badge.title,
                description: trail.badge.description,
                url: trail.badge.url,
                userId,
              },
            },
          }
        : baseTrailData,
      include: {
        badge: true,
        inputContents: true,
      },
    });

    // Create quests and questions separately due to nested relationship
    for (const quest of trail.quests as GeneratedQuest[]) {
      const savedQuest = await prisma.quest.create({
        data: {
          difficultyLevel: quest.difficultyLevel,
          status: quest.status,
          attempts: quest.attempts,
          generationPrompt: quest.generationPrompt,
          trailId: savedTrail.id,
        },
      });

      if (quest.questions && quest.questions.length > 0) {
        await prisma.question.createMany({
          data: quest.questions.map((question) => ({
            text: question.text,
            alternatives: question.alternatives,
            correctAnswer: question.correctAnswer,
            status: question.status as QuestionStatus,
            feedback: question.feedback,
            questId: savedQuest.id,
          })),
        });
      }
    }

    // Return the complete trail with all relations
    return await prisma.trail.findUnique({
      where: {
        id: savedTrail.id,
      },
      include: {
        badge: true,
        inputContents: true,
        quests: {
          include: {
            questions: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error saving trail:", error);
    throw new Error("Falha ao salvar trilha no banco de dados");
  }
}
