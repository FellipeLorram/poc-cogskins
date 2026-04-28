import { Quest } from "@prisma/client";
import { GeneratedQuest } from "./quest";

export interface GetQuestRequest {
  questId: string;
}

export interface GetQuestResponse {
  quest: GeneratedQuest | null;
}

export interface ListQuestsResponse {
  quests: GeneratedQuest[];
}

export interface UpdateQuestRequest {
  questId: string;
  data: Partial<Quest>;
}

export interface UpdateQuestResponse {
  quest: GeneratedQuest;
}

// Main actions interface
export interface QuestActions {
  getQuest: (request: GetQuestRequest) => Promise<GetQuestResponse>;
  listQuests: () => Promise<ListQuestsResponse>;
  updateQuest: (request: UpdateQuestRequest) => Promise<UpdateQuestResponse>;
}
