import { Prisma, QuestStatus } from "@prisma/client";

export type GeneratedQuest = Prisma.QuestGetPayload<{
  include: {
    questions: true;
  };
}>;

export const QuestStatusMap = {
  [QuestStatus.LOCKED]: "Locked",
  [QuestStatus.AVAILABLE]: "Available",
  [QuestStatus.IN_PROGRESS]: "In Progress",
  [QuestStatus.COMPLETED]: "Completed",
};
