"use server";

import { GeneratedTrail } from "@/entities/trails";
import { openai } from "@ai-sdk/openai";
import { ContentType, ProcessingStatus, QuestStatus } from "@prisma/client";
import { generateObject } from "ai";
import { z } from "zod";
import { generateBadgeImage } from "../badge/generate-badge";
import { saveTrail } from "./save-trail";

// Define the structure of the RWS trail data
interface RwsTrailData {
  title: string;
  description: string;
  topics: string[];
  quests: {
    name: string;
    description: string;
    type: "MEMÓRIA" | "COMPREENSÃO" | "APLICAÇÃO";
    questions: number;
  }[];
}

// Define the RWS tracks data
const rwsTrailsData: Record<string, RwsTrailData> = {
  "hybrid-intelligence": {
    title: "Hybrid Intelligence",
    description:
      "Análise da interação entre inteligência humana e artificial, com foco em aplicações práticas e implicações cognitivas.",
    topics: [
      "Definição e exemplos de Inteligência Híbrida",
      "Comparativo entre aprendizagem tradicional e aprendizagem assistida por IA",
      "Influência dos algoritmos de recomendação no aprimoramento cognitivo",
      "Novas profissões na era da colaboração humano-IA",
    ],
    quests: [
      {
        name: "Neural Recall",
        description:
          "Avalie seu conhecimento básico sobre Inteligência Híbrida através de perguntas de reconhecimento e recordação.",
        type: "MEMÓRIA",
        questions: 5,
      },
      {
        name: "Synaptic Decode",
        description:
          "Teste sua capacidade de interpretar e fazer inferências sobre a interação entre inteligência humana e artificial.",
        type: "COMPREENSÃO",
        questions: 5,
      },
      {
        name: "Hybrid Hacks",
        description:
          "Aplique seus conhecimentos para resolver desafios práticos relacionados à colaboração humano-IA.",
        type: "APLICAÇÃO",
        questions: 5,
      },
    ],
  },
  "future-of-work": {
    title: "Future of Work",
    description:
      "Exame das transformações no mercado laboral decorrentes de inovações tecnológicas e mudanças sociais.",
    topics: [
      "Profissões em ascensão e declínio na era da automação",
      "Relevância das habilidades socioemocionais no cenário laboral futuro",
      "Adaptação dos sistemas educacionais às demandas do mercado futuro",
      "Novas modalidades de trabalho geradas por avanços em IA",
    ],
    quests: [
      {
        name: "Career Cache",
        description:
          "Teste seu conhecimento sobre fatos e definições relacionados ao futuro do trabalho.",
        type: "MEMÓRIA",
        questions: 5,
      },
      {
        name: "Skill Unpack",
        description:
          "Analise cenários e compreenda as transformações nos requisitos profissionais do futuro.",
        type: "COMPREENSÃO",
        questions: 5,
      },
      {
        name: "Disrupt Lab",
        description:
          "Enfrente desafios de prototipagem de soluções para os problemas do mercado de trabalho futuro.",
        type: "APLICAÇÃO",
        questions: 5,
      },
    ],
  },
  "tech-industry": {
    title: "Tech Industry",
    description:
      "Avaliação do conhecimento sobre os componentes fundamentais da tecnologia digital e suas tendências evolutivas.",
    topics: [
      "Diferenças fundamentais entre software e hardware",
      "Princípios básicos da computação em nuvem",
      "Aplicações práticas da Internet das Coisas (IoT)",
      "Panorama atual da computação quântica",
    ],
    quests: [
      {
        name: "Binary Roots",
        description:
          "Responda questões fundamentais sobre os princípios básicos da indústria tecnológica.",
        type: "MEMÓRIA",
        questions: 5,
      },
      {
        name: "Cloud Logic",
        description:
          "Estabeleça conexões entre conceitos tecnológicos e explore suas relações.",
        type: "COMPREENSÃO",
        questions: 5,
      },
      {
        name: "Quantum Leap",
        description:
          "Enfrente desafios de construção tecnológica aplicando conhecimentos avançados.",
        type: "APLICAÇÃO",
        questions: 5,
      },
    ],
  },
};

// Schema para validação e geração via IA
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

type QuestionsGeneration = z.infer<typeof questionsArraySchema>;

async function generateSingleRwsTrail(
  trailKey: string
): Promise<GeneratedTrail> {
  // Verificar se a trilha solicitada existe
  if (!rwsTrailsData[trailKey]) {
    throw new Error(`Trilha "${trailKey}" não encontrada`);
  }

  const trailData = rwsTrailsData[trailKey];

  // Gerar badge para a trilha
  const badgeResult = await generateBadgeImage({
    theme: `Web Summit 2025 - ${trailData.title}`,
  });

  // Gerar questões para cada quest
  const questsWithQuestions = await Promise.all(
    trailData.quests.map(async (quest, index) => {
      // Criar prompt para geração de questões baseado no tipo de quest
      const difficultyLevel = index + 1; // 1, 2, 3

      const prompt = `
        Gere ${quest.questions} questões de múltipla escolha sobre ${trailData.title} para a seção "${quest.name}" (${quest.type}).
        
        Contexto da trilha: ${trailData.description}
        
        Tópicos principais:
        ${trailData.topics.map((topic) => `- ${topic}`).join("\n")}
        
        Instruções:
        - As questões devem seguir a Taxonomia de Bloom para o nível: ${quest.type}
        - Cada questão deve ter 4 alternativas (A-D):
          * 1 correta (não óbvia)
          * 2 erradas plausíveis (erros comuns)
          * 1 claramente incorreta
        - Forneça uma explicação curta (1 linha) para a resposta correta em "feedback"
        - A dificuldade deve aumentar gradualmente da questão 1 (mais fácil) até a questão 5 (mais difícil)
        - Use linguagem acessível (nível ensino médio)
        - Todo o conteúdo DEVE ser em português do Brasil
        - Contextualize com exemplos do mundo real relevantes para o público do Web Summit
      `;

      // Gerar questões usando IA
      const { object } = await generateObject<QuestionsGeneration>({
        model: openai("gpt-4o"),
        schema: questionsArraySchema,
        prompt,
        temperature: 0.7,
      });

      const status = difficultyLevel === 1 ? "AVAILABLE" : "LOCKED";

      return {
        id: crypto.randomUUID(),
        difficultyLevel,
        status: status as QuestStatus,
        attempts: 0,
        generationPrompt: prompt,
        description: quest.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        trailId: "", // Will be filled when the trail is saved
        questions: object.questions.map((q) => ({
          id: crypto.randomUUID(),
          text: q.text,
          alternatives: q.alternatives,
          correctAnswer: q.correctAnswer,
          status: "UNANSWERED",
          feedback: q.feedback,
          createdAt: new Date(),
          updatedAt: new Date(),
          questId: "", // Will be filled when the quest is saved
        })),
      };
    })
  );

  // Construir o objeto da trilha
  const trail: GeneratedTrail = {
    id: crypto.randomUUID(),
    title: trailData.title,
    status: "DRAFT",
    estimatedDuration: 30, // Estimativa padrão: 30 minutos
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "", // Will be filled when there is authentication
    flag: "web summit", // Flag para identificar que esta é uma trilha RWS
    inputContents: [
      {
        id: crypto.randomUUID(),
        type: ContentType.TEXT,
        url: null,
        fileKey: null,
        size: trailData.description.length,
        processingStatus: ProcessingStatus.COMPLETED,
        processedContent: trailData.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        trailId: "", // Will be filled when the trail is saved
      },
    ],
    quests: questsWithQuestions as GeneratedTrail["quests"],
    badge: {
      id: crypto.randomUUID(),
      title: `${trailData.title} Master`,
      description: `Conquistado por demonstrar proficiência em ${trailData.title} no Web Summit 2025`,
      url: badgeResult.url,
      earnedAt: null,
      nftData: null,
      createdAt: new Date(),
      level: 1,
      updatedAt: new Date(),
      trailId: "", // Will be filled when the trail is saved
      userId: null, // Will be filled when there is authentication
    },
  };

  return trail;
}

export async function generateRwsTrails() {
  const trailKeys = Object.keys(rwsTrailsData);

  const trailsPromises = trailKeys.map(generateSingleRwsTrail);

  const trails = await Promise.all(trailsPromises);

  trails.forEach(async (trail) => {
    await saveTrail(trail);
  });

  return trails;
}
