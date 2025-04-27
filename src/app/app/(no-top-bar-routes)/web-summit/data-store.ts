import { Trail, Quest, Question, TrailId } from "./types";
import { trails } from "./data";

export class DataStore {
  private trails: Trail[];

  constructor() {
    this.trails = trails;
  }

  listTrails(): Trail[] {
    return this.trails;
  }

  getTrailById(id: TrailId): Trail | undefined {
    return this.trails.find((trail) => trail.id === id);
  }

  getQuestByType(trailId: TrailId, type: string): Quest | undefined {
    const trail = this.getTrailById(trailId);
    return trail?.quests.find((quest) => quest.type === type);
  }

  getQuestionById(questionId: string): Question | undefined {
    for (const trail of this.trails) {
      for (const quest of trail.quests) {
        const question = quest.questions.find((q) => q.id === questionId);
        if (question) return question;
      }
    }
    return undefined;
  }
}

// Create a singleton instance
export const dataStore = new DataStore();
