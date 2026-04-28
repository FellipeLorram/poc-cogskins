import { QuestStatus } from "@prisma/client";
import { generateQuestQuestions } from "./generate-questions";

interface GenerateQuestRequest {
  quest: {
    description: string;
    generationPrompt: string;
    difficultyLevel: number;
  };
}

export async function generateQuest({ quest }: GenerateQuestRequest) {
  const questions = await generateQuestQuestions(
    quest.generationPrompt,
    quest.difficultyLevel
  );

  const status = quest.difficultyLevel === 1 ? "AVAILABLE" : "LOCKED";

  return {
    difficultyLevel: quest.difficultyLevel,
    status: status as QuestStatus,
    generationPrompt: quest.generationPrompt,
    description: quest.description,
    questions: questions,
  };
}
