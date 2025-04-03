"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const feedbackSchema = z.object({
  encouragement: z
    .string()
    .describe("Mensagem motivacional baseada no desempenho"),
  conceptualFeedback: z
    .string()
    .describe("Feedback sobre a compreensão dos conceitos principais"),
  improvementAreas: z
    .array(
      z.object({
        concept: z.string().describe("Conceito que precisa de mais atenção"),
        suggestion: z.string().describe("Sugestão específica para melhorar"),
        resources: z
          .array(z.string())
          .describe("Recursos adicionais para estudo"),
      })
    )
    .describe("Áreas específicas para melhoria com sugestões"),
  nextStepHints: z
    .array(z.string())
    .describe("Dicas sobre o que focar em seguida"),
});

export type PersonalizedFeedback = z.infer<typeof feedbackSchema>;

interface GenerateFeedbackRequest {
  contentPrompt: string;
  questionsAnswered: number;
  correctAnswers: number;
  difficultyLevel: number;
}

export async function generatePersonalizedFeedback({
  contentPrompt,
  questionsAnswered,
  correctAnswers,
  difficultyLevel,
}: GenerateFeedbackRequest): Promise<PersonalizedFeedback> {
  const performance = (correctAnswers / questionsAnswered) * 100;

  const prompt = `
            Use este prompt otimizado como base de conhecimento:
            ${contentPrompt}

            Gere um feedback personalizado para um estudante com:
            - Desempenho: ${performance}% (${correctAnswers}/${questionsAnswered} corretas)
            - Nível de Dificuldade: ${difficultyLevel} (1-3)
            
            Considere:
            - Seja encorajador mas honesto
            - Foque no crescimento e na melhoria
            - Forneça sugestões específicas e acionáveis
            - Inclua recursos relevantes para melhoria
            - Adapte o tom e a complexidade ao nível de desempenho
            - TODO o conteúdo DEVE ser em português do Brasil
            - Use linguagem clara e acessível
            - Seja específico nas sugestões de melhoria
            - Sugira recursos em português quando possível
        `;

  const { object } = await generateObject<PersonalizedFeedback>({
    model: openai("gpt-3.5-turbo"),
    schema: feedbackSchema,
    prompt,
    temperature: 0.5, // Balanceando consistência com personalização
  });

  return object;
}
