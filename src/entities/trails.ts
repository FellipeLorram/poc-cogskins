import { Prisma } from "@prisma/client";

export type GeneratedTrail = Prisma.TrailGetPayload<{
  include: {
    inputContents: true;
    quests: true;
    badge: true;
  };
}>;
