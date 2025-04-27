import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QuestionFormSchema } from "./question-form";

interface QuestionStore {
  currentQuestion: string;
  answeredQuestions: QuestionFormSchema[];
  correctQuestions: number;
  setCurrentQuestion: (question: string) => void;
  addAnsweredQuestion: (question: QuestionFormSchema) => void;
  setCorrectQuestions: (correctQuestions: number) => void;
  reset: () => void;
}

export const useQuestionStore = create<QuestionStore>()(
  persist(
    (set, get) => ({
      currentQuestion: "",
      answeredQuestions: [],
      correctQuestions: 0,
      setCorrectQuestions: (correctQuestions: number) =>
        set({ correctQuestions }),
      setCurrentQuestion: (question: string) =>
        set({ currentQuestion: question }),
      addAnsweredQuestion: (question: QuestionFormSchema) =>
        set((state) => ({
          answeredQuestions: [...state.answeredQuestions, question],
        })),
      reset: () =>
        set({
          currentQuestion: get().answeredQuestions[0]?.questionId || "",
          answeredQuestions: [],
          correctQuestions: 0,
        }),
    }),
    {
      name: "question-store",
    }
  )
);
