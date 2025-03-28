import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Prisma, QuestionStatus } from '@prisma/client';

// Schema para o array de questões
const questionsArraySchema = z.object({
    questions: z.array(z.object({
        text: z.string().describe('Uma pergunta clara e envolvente sobre o conteúdo em português'),
        alternatives: z.array(z.string()).length(4).describe('4 alternativas possíveis em português, sendo apenas uma correta'),
        correctAnswer: z.number().min(0).max(3).describe('Índice da resposta correta (0-3)'),
        feedback: z.string().describe('Explicação detalhada em português sobre por que a resposta correta está certa e as outras estão erradas')
    })).min(1).describe('Array de questões únicas, cada uma testando diferentes aspectos do conteúdo')
});

type QuestionGeneration = z.infer<typeof questionsArraySchema>;

type GeneratedQuestion = Prisma.QuestionGetPayload<{
    select: {
        id: true,
        text: true,
        alternatives: true,
        correctAnswer: true,
        feedback: true,
        status: true
    }
}>;

export async function generateQuestQuestions(
    contentPrompt: string,
    difficultyLevel: number,
    questionsCount: number = 5
): Promise<GeneratedQuestion[] | { error: string }> {
    try {
        const prompt = `
            Use este prompt otimizado como base de conhecimento:
            ${contentPrompt}

            Gere ${questionsCount} questões ÚNICAS e DIFERENTES sobre este conteúdo com nível de dificuldade ${difficultyLevel} (1-3).
            
            Considere:
            - TODAS as questões e respostas DEVEM ser em português do Brasil
            - Cada questão deve ser completamente diferente das outras
            - Evite repetir o mesmo tópico ou conceito em múltiplas questões
            - As questões devem testar compreensão, não apenas memorização
            - Para dificuldade 1: Compreensão básica e recordação
            - Para dificuldade 2: Aplicação e análise
            - Para dificuldade 3: Avaliação e síntese
            - As alternativas devem ser plausíveis mas claramente distinguíveis
            - O feedback deve ser educativo e explicar tanto a resposta correta quanto as incorretas
            - Use linguagem clara e acessível
            - Evite questões ambíguas ou confusas
        `;

        // Gerar todas as questões de uma vez
        const { object } = await generateObject<QuestionGeneration>({
            model: openai('gpt-3.5-turbo'),
            schema: questionsArraySchema,
            prompt,
            temperature: 0.3, // Temperatura mais baixa para maior consistência
        });

        // Verificar duplicatas e processar questões
        const uniqueQuestions = new Set<string>();
        const questions: GeneratedQuestion[] = [];

        for (const question of object.questions) {
            // Normalizar o texto para comparação (remover espaços extras, converter para minúsculas)
            const normalizedText = question.text.toLowerCase().trim().replace(/\s+/g, ' ');
            
            if (!uniqueQuestions.has(normalizedText)) {
                uniqueQuestions.add(normalizedText);
                questions.push({
                    id: crypto.randomUUID(),
                    text: question.text,
                    alternatives: question.alternatives,
                    correctAnswer: question.correctAnswer,
                    feedback: question.feedback,
                    status: 'UNANSWERED' as QuestionStatus
                });

                // Se já temos questões suficientes, podemos parar
                if (questions.length === questionsCount) {
                    break;
                }
            }
        }

        // Verificar se conseguimos questões suficientes
        if (questions.length < questionsCount) {
            console.warn(`Apenas ${questions.length} questões únicas foram geradas de ${questionsCount} solicitadas`);
            
            // Se tivermos pelo menos 3 questões, podemos prosseguir
            if (questions.length >= 3) {
                return questions;
            }
            
            return {
                error: 'Não foi possível gerar questões únicas suficientes. Tente novamente.'
            };
        }

        return questions;
    } catch (error) {
        return {
            error: error instanceof Error 
                ? error.message 
                : 'Falha ao gerar as questões. Tente novamente.'
        };
    }
} 