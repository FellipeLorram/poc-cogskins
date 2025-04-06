"use server";

import { openai } from "@ai-sdk/openai";
import { Prisma, QuestionStatus } from "@prisma/client";
import { generateObject } from "ai";
import { z } from "zod";
import { GenerationError } from "../errors/generation-error";

// Schema para o array de questões
const questionsArraySchema = z.object({
  questions: z
    .array(
      z.object({
        text: z
          .string()
          .describe(
            "Uma pergunta clara e envolvente sobre o conteúdo em português"
          ),
        alternatives: z
          .array(z.string())
          .length(4)
          .describe(
            "4 alternativas possíveis em português, sendo apenas uma correta"
          ),
        correctAnswer: z
          .number()
          .min(0)
          .max(3)
          .describe("Índice da resposta correta (0-3)"),
        feedback: z
          .string()
          .describe(
            "Explicação detalhada em português sobre por que a resposta correta está certa e as outras estão erradas"
          ),
      })
    )
    .min(3)
    .describe(
      "Array de questões únicas, cada uma testando diferentes aspectos do conteúdo"
    ),
});

type QuestionGeneration = z.infer<typeof questionsArraySchema>;

type GeneratedQuestion = Prisma.QuestionGetPayload<{
  select: {
    id: true;
    text: true;
    alternatives: true;
    correctAnswer: true;
    feedback: true;
    status: true;
  };
}>;

export async function generateQuestQuestions(
  contentPrompt: string,
  difficultyLevel: number,
  questionsCount: number = 5
): Promise<GeneratedQuestion[]> {
  const uniqueQuestions = new Set<string>();
  const questions: GeneratedQuestion[] = [];
  const maxAttempts = 3; // Limite de tentativas para evitar loop infinito
  let currentAttempt = 0;

  while (questions.length < questionsCount && currentAttempt < maxAttempts) {
    const prompt = `
            Use este prompt otimizado como base de conhecimento:
            ${contentPrompt}

            Gere ${questionsCount - questions.length} questões ÚNICAS e DIFERENTES sobre este conteúdo com nível de dificuldade ${difficultyLevel} (1-3).
            
            Considere:
            - TODAS as questões e respostas DEVEM ser em português do Brasil
            - Cada questão deve ser completamente diferente das outras
            - Evite repetir o mesmo tópico ou conceito em múltiplas questões
            - As questões devem testar compreensão, não apenas memorização
            - Para dificuldade 1: Compreensão básica e recordação
            - Para dificuldade 2: Aplicação e análise
            - Para dificuldade 3: Avaliação e síntese
            - As questões devem seguir a Taxonomia de Bloom
              - Cada questão deve ter 4 alternativas (A-D):
                * 1 correta (não óbvia)
                * 2 erradas plausíveis (erros comuns)
                * 1 claramente incorreta

            - As alternativas devem ser plausíveis mas claramente distinguíveis
            - O feedback deve ser educativo e explicar tanto a resposta correta quanto as incorretas
            - Use linguagem clara e acessível (nível ensino médio)
            - A dificuldade deve aumentar gradualmente da questão 1 (mais fácil) até a questão 5 (mais difícil)
            
            - Evite questões ambíguas ou confusas
            ${
              questions.length > 0
                ? `
            IMPORTANTE: Não gere questões similares às seguintes questões já existentes:
            ${questions.map((q) => q.text).join("\n")}`
                : ""
            }
        `;

    // Generate questions
    const { object } = await generateObject<QuestionGeneration>({
      model: openai("gpt-3.5-turbo"),
      schema: questionsArraySchema,
      prompt,
      temperature: 0.3 + currentAttempt * 0.2, // Aumenta a temperatura a cada tentativa para maior variação
    });

    // Process new questions
    for (const question of object.questions) {
      const normalizedText = question.text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

      if (!uniqueQuestions.has(normalizedText)) {
        uniqueQuestions.add(normalizedText);
        questions.push({
          id: crypto.randomUUID(),
          text: question.text,
          alternatives: question.alternatives,
          correctAnswer: question.correctAnswer,
          feedback: question.feedback,
          status: "UNANSWERED" as QuestionStatus,
        });

        if (questions.length === questionsCount) {
          break;
        }
      }
    }

    currentAttempt++;
  }

  // Se após todas as tentativas ainda não tivermos questões suficientes
  if (questions.length < 3)
    throw new GenerationError(
      "Não foi possível gerar questões únicas suficientes após múltiplas tentativas. Tente novamente."
    );

  // Retorna as questões mesmo se não atingiu o número ideal, desde que tenha pelo menos 3
  return questions;
}
