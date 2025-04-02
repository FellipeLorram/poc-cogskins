import { Prisma, QuestStatus } from "@prisma/client";

export type GeneratedQuest = Prisma.QuestGetPayload<{
  include: {
    questions: true;
  };
}>;

export const QuestStatusMap = {
  [QuestStatus.LOCKED]: "Bloqueado",
  [QuestStatus.AVAILABLE]: "Disponível",
  [QuestStatus.IN_PROGRESS]: "Em Progresso",
  [QuestStatus.COMPLETED]: "Completa",
};
