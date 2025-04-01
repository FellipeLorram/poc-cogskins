"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const validateContentRequestSchema = z.object({
  contents: z.array(z.string()).min(1).max(3),
});

type ValidateContentRequest = z.infer<typeof validateContentRequestSchema>;

interface ValidateContentResponse {
  success: boolean;
  content: string;
  contentPrompt: string;
  error?: string;
  theme?: string;
}

const validationSchema = z.object({
  coherent: z
    .boolean()
    .describe("Se os conteúdos são tematicamente relacionados"),
  theme: z
    .string()
    .nullable()
    .describe("Tema/tópico principal se coerente, null se não"),
  reason: z
    .string()
    .describe(
      "Explicação detalhada do por que os conteúdos são coerentes ou não"
    ),
  unifiedContent: z
    .string()
    .describe(
      "Uma versão unificada e organizada de todos os conteúdos, removendo redundâncias e organizando em uma sequência lógica"
    ),
  optimizedPrompt: z
    .string()
    .describe(
      "Um prompt otimizado que captura a essência do conteúdo e pode ser usado para gerar questões"
    ),
});

type ValidationResult = z.infer<typeof validationSchema>;

export async function validateContents(
  request: ValidateContentRequest
): Promise<ValidateContentResponse> {
  try {
    const { contents } = validateContentRequestSchema.parse(request);

    const prompt = `
            Analise os seguintes conteúdos e determine se eles são tematicamente coerentes e relacionados o suficiente para criar uma trilha de aprendizado significativa:

            ${contents
              .map((content, i) => `Conteúdo ${i + 1}:\n${content}\n`)
              .join("\n")}

            Considere:
            - Os conteúdos devem compartilhar um tema comum ou estar logicamente conectados
            - Eles devem se complementar ou construir um sobre o outro
            - A combinação deve fazer sentido para um caminho de aprendizado
            - Se coerente, crie uma versão unificada do conteúdo, organizando logicamente e removendo redundâncias
            - Crie um prompt otimizado que capture a essência do conteúdo para geração de questões
            - TODO o conteúdo DEVE ser em português do Brasil
            - Use linguagem clara e acessível
            - Mantenha a organização lógica do conteúdo
            - Preserve os conceitos principais
            - O conteúdo pode ser uma frase com uma ideia, não precisa ser um texto longo (exemplo: "Imperio Romano", "Guerra Fria", "Celeiro de Cereais")
        `;

    const { object } = await generateObject<ValidationResult>({
      model: openai("gpt-3.5-turbo"),
      schema: validationSchema,
      prompt,
      temperature: 0.3,
    });

    return {
      success: object.coherent,
      content: object.unifiedContent,
      contentPrompt: object.optimizedPrompt,
      error: object.coherent ? undefined : object.reason,
      theme: object.coherent ? object.theme || undefined : undefined,
    };
  } catch (error) {
    return {
      success: false,
      content: "",
      contentPrompt: "",
      error:
        error instanceof Error
          ? error.message
          : "Falha ao validar conteúdos. Tente novamente.",
    };
  }
}
