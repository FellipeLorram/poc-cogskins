import { Prisma, TrailStatus } from "@prisma/client";

export type GeneratedTrail = Prisma.TrailGetPayload<{
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

export const TrailStatusMap: Record<TrailStatus, string> = {
  DRAFT: "Rascunho",
  COMPLETED: "Concluído",
  IN_PROGRESS: "Em andamento",
};
