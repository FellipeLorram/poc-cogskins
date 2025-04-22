"use server";

import { prisma } from "@/lib/prisma-client";

const mockTrails = [
  {
    title: "Hybrid Intelligence",
    summary:
      "Questões de memória sobre os conceitos básicos de Inteligência Híbrida.",
    quests: [
      {
        type: "Memória",
        name: "Neural Recall",
        description:
          "Lembre, recupere, conecte fatos e definições fundamentais sobre Inteligência Híbrida.",
        questions: [
          {
            text: "Qual é o principal objetivo da Inteligência Híbrida (IH)?",
            options: [
              "Substituir todos os humanos por robôs",
              "Criar uma IA que pense como humanos",
              "Unir inteligência humana e IA para melhorar resultados",
              "Tornar os humanos dependentes de tecnologia",
            ],
            correctAnswer:
              "Unir inteligência humana e IA para melhorar resultados",
          },
          {
            text: "Como a IA pode ajudar no aprendizado?",
            options: [
              "Dando o mesmo conteúdo para todos",
              "Organizando os alunos em filas",
              "Criando tarefas de acordo com o nível de cada um",
              "Pedindo que copiem do quadro",
            ],
            correctAnswer: "Criando tarefas de acordo com o nível de cada um",
          },
          {
            text: "Se você fosse criar uma escola com IH, o que incluiria?",
            options: [
              "Cerebelo",
              "Hipocampo",
              "Cortex pré-frontal",
              "Amígdala",
            ],
            correctAnswer: "Hipocampo",
          },
          {
            text: "Qual é um exemplo de memória explícita?",
            options: [
              "Lembrar de um evento passado",
              "Saber andar de bicicleta",
              "Reagir a um reflexo",
              "Reconhecer uma face",
            ],
            correctAnswer: "Lembrar de um evento passado",
          },
          {
            text: "O que é a memória de trabalho?",
            options: [
              "Memória para tarefas simples",
              "Memória para informações temporárias",
              "Memória para habilidades motoras",
              "Memória para eventos passados",
            ],
            correctAnswer: "Memória para informações temporárias",
          },
        ],
      },
      {
        type: "Compreensão",
        name: "Synaptic Decode",
        description: "5 perguntas de interpretação e inferência.",
        questions: [
          {
            text: "O que significa compreender um texto?",
            options: [
              "Ler rapidamente",
              "Entender o significado",
              "Memorizar palavras",
              "Repetir o texto",
            ],
            correctAnswer: "Entender o significado",
          },
          {
            text: "Qual é uma estratégia para melhorar a compreensão?",
            options: [
              "Ler em voz alta",
              "Ignorar palavras difíceis",
              "Ler apenas uma vez",
              "Focar apenas em números",
            ],
            correctAnswer: "Ler em voz alta",
          },
          {
            text: "O que é inferência na leitura?",
            options: [
              "Adivinhar o que vem a seguir",
              "Compreender o que está explícito",
              "Ler entre as linhas",
              "Memorizar o texto",
            ],
            correctAnswer: "Ler entre as linhas",
          },
          {
            text: "Qual é a importância do vocabulário na compreensão?",
            options: [
              "Não é importante",
              "Ajuda a entender melhor",
              "Dificulta a leitura",
              "É apenas para textos técnicos",
            ],
            correctAnswer: "Ajuda a entender melhor",
          },
          {
            text: "O que é um resumo?",
            options: [
              "Uma cópia do texto",
              "Uma versão reduzida com as ideias principais",
              "Um comentário pessoal",
              "Uma lista de palavras",
            ],
            correctAnswer: "Uma versão reduzida com as ideias principais",
          },
        ],
      },
      {
        type: "Aplicação",
        name: "Hybrid Hacks",
        description: "5 perguntas de implementação prática.",
        questions: [
          {
            text: "Como você aplicaria o conhecimento sobre inteligência híbrida?",
            options: [
              "Apenas em teoria",
              "Em projetos práticos",
              "Em discussões",
              "Não é aplicável",
            ],
            correctAnswer: "Em projetos práticos",
          },
          {
            text: "Qual é um exemplo de aplicação prática da tecnologia?",
            options: [
              "Ler um livro",
              "Usar um aplicativo",
              "Assistir a um filme",
              "Falar com amigos",
            ],
            correctAnswer: "Usar um aplicativo",
          },
          {
            text: "Como a compreensão pode ser aplicada no dia a dia?",
            options: [
              "Apenas em testes",
              "Na resolução de problemas",
              "Na memorização",
              "Na leitura de notícias",
            ],
            correctAnswer: "Na resolução de problemas",
          },
          {
            text: "Qual é a melhor forma de aplicar o que você aprendeu?",
            options: [
              "Esquecendo",
              "Praticando regularmente",
              "Lendo mais",
              "Discutindo com amigos",
            ],
            correctAnswer: "Praticando regularmente",
          },
          {
            text: "Como a aplicação do conhecimento pode impactar sua carreira?",
            options: [
              "Não tem impacto",
              "Pode abrir novas oportunidades",
              "É irrelevante",
              "Só é importante para acadêmicos",
            ],
            correctAnswer: "Pode abrir novas oportunidades",
          },
        ],
      },
    ],
  },
  {
    title: "Future of Work",
    summary:
      "Exame das transformações no mercado laboral decorrentes de inovações tecnológicas e mudanças sociais.",
    quests: [
      {
        type: "Memória",
        name: "Career Cache",
        description: "5 perguntas sobre fatos e definições.",
        questions: [
          {
            text: "Qual é a principal mudança no mercado de trabalho?",
            options: [
              "Aumento de empregos tradicionais",
              "Automatização de tarefas",
              "Menos tecnologia",
              "Mais empregos manuais",
            ],
            correctAnswer: "Automatização de tarefas",
          },
          {
            text: "O que é trabalho remoto?",
            options: [
              "Trabalho em um escritório",
              "Trabalho de casa",
              "Trabalho em equipe",
              "Trabalho temporário",
            ],
            correctAnswer: "Trabalho de casa",
          },
          {
            text: "Qual é uma habilidade importante para o futuro do trabalho?",
            options: [
              "Memorizar informações",
              "Adaptabilidade",
              "Seguir regras",
              "Evitar mudanças",
            ],
            correctAnswer: "Adaptabilidade",
          },
          {
            text: "O que é economia gig?",
            options: [
              "Trabalho em tempo integral",
              "Trabalho temporário ou freelance",
              "Trabalho em fábricas",
              "Trabalho sem pagamento",
            ],
            correctAnswer: "Trabalho temporário ou freelance",
          },
          {
            text: "Qual é um benefício do trabalho remoto?",
            options: [
              "Menos flexibilidade",
              "Mais estresse",
              "Maior equilíbrio entre vida pessoal e profissional",
              "Menos produtividade",
            ],
            correctAnswer: "Maior equilíbrio entre vida pessoal e profissional",
          },
        ],
      },
      {
        type: "Compreensão",
        name: "Skill Unpack",
        description: "5 perguntas de análise de cenários.",
        questions: [
          {
            text: "O que significa compreender as mudanças no trabalho?",
            options: [
              "Aceitar tudo sem questionar",
              "Entender as tendências e suas implicações",
              "Ignorar as mudanças",
              "Focar apenas no passado",
            ],
            correctAnswer: "Entender as tendências e suas implicações",
          },
          {
            text: "Qual é uma estratégia para se adaptar ao futuro do trabalho?",
            options: [
              "Resistir a mudanças",
              "Aprender novas habilidades",
              "Focar apenas em uma área",
              "Evitar tecnologia",
            ],
            correctAnswer: "Aprender novas habilidades",
          },
          {
            text: "Qual é a importância da comunicação no trabalho remoto?",
            options: [
              "Não é importante",
              "É essencial para a colaboração",
              "Dificulta o trabalho",
              "É apenas uma formalidade",
            ],
            correctAnswer: "É essencial para a colaboração",
          },
          {
            text: "O que é um ambiente de trabalho inclusivo?",
            options: [
              "Um ambiente que exclui pessoas",
              "Um ambiente que valoriza a diversidade",
              "Um ambiente sem regras",
              "Um ambiente apenas para homens",
            ],
            correctAnswer: "Um ambiente que valoriza a diversidade",
          },
          {
            text: "Como a tecnologia pode ajudar no trabalho?",
            options: [
              "Aumentando a carga de trabalho",
              "Facilitando a comunicação",
              "Eliminando empregos",
              "Criando mais estresse",
            ],
            correctAnswer: "Facilitando a comunicação",
          },
        ],
      },
      {
        type: "Aplicação",
        name: "Disrupt Lab",
        description: "5 desafios de prototipagem de soluções.",
        questions: [
          {
            text: "Como você aplicaria as novas habilidades no trabalho?",
            options: [
              "Apenas em teoria",
              "Na prática diária",
              "Em discussões",
              "Não é aplicável",
            ],
            correctAnswer: "Na prática diária",
          },
          {
            text: "Qual é um exemplo de aplicação prática da adaptabilidade?",
            options: [
              "Resistir a mudanças",
              "Aceitar novas tarefas",
              "Focar apenas no que você sabe",
              "Ignorar feedback",
            ],
            correctAnswer: "Aceitar novas tarefas",
          },
          {
            text: "Como a compreensão das tendências pode ser aplicada?",
            options: [
              "Apenas em testes",
              "Na tomada de decisões",
              "Na memorização",
              "Na leitura de notícias",
            ],
            correctAnswer: "Na tomada de decisões",
          },
          {
            text: "Qual é a melhor forma de aplicar o que você aprendeu sobre trabalho remoto?",
            options: [
              "Esquecendo",
              "Praticando regularmente",
              "Lendo mais",
              "Discutindo com amigos",
            ],
            correctAnswer: "Praticando regularmente",
          },
          {
            text: "Como a aplicação do conhecimento pode impactar sua carreira?",
            options: [
              "Não tem impacto",
              "Pode abrir novas oportunidades",
              "É irrelevante",
              "Só é importante para acadêmicos",
            ],
            correctAnswer: "Pode abrir novas oportunidades",
          },
        ],
      },
    ],
  },
  {
    title: "Tech Industry",
    summary:
      "Avaliação do conhecimento sobre os componentes fundamentais da tecnologia digital e suas tendências evolutivas.",
    quests: [
      {
        type: "Memória",
        name: "Binary Roots",
        description: "5 perguntas sobre fundamentos.",
        questions: [
          {
            text: "Qual é a principal tecnologia que impulsiona a indústria?",
            options: [
              "Inteligência Artificial",
              "Máquinas de escrever",
              "Televisão",
              "Rádio",
            ],
            correctAnswer: "Inteligência Artificial",
          },
          {
            text: "O que é um software?",
            options: [
              "Um tipo de hardware",
              "Um programa de computador",
              "Um dispositivo físico",
              "Uma rede de computadores",
            ],
            correctAnswer: "Um programa de computador",
          },
          {
            text: "Qual é a função de um sistema operacional?",
            options: [
              "Gerenciar hardware e software",
              "Criar aplicativos",
              "Vender produtos",
              "Desenvolver jogos",
            ],
            correctAnswer: "Gerenciar hardware e software",
          },
          {
            text: "O que é a nuvem?",
            options: [
              "Um tipo de armazenamento físico",
              "Armazenamento de dados na internet",
              "Um software específico",
              "Um dispositivo de rede",
            ],
            correctAnswer: "Armazenamento de dados na internet",
          },
          {
            text: "Qual é a importância da segurança cibernética?",
            options: [
              "Não é importante",
              "Protege dados e informações",
              "Dificulta o acesso",
              "É apenas uma formalidade",
            ],
            correctAnswer: "Protege dados e informações",
          },
        ],
      },
      {
        type: "Compreensão",
        name: "Cloud Logic",
        description: "5 perguntas de conexão entre conceitos.",
        questions: [
          {
            text: "O que significa compreender a tecnologia?",
            options: [
              "Aceitar tudo sem questionar",
              "Entender como funciona e suas implicações",
              "Ignorar as mudanças",
              "Focar apenas no passado",
            ],
            correctAnswer: "Entender como funciona e suas implicações",
          },
          {
            text: "Qual é uma estratégia para se manter atualizado na tecnologia?",
            options: [
              "Resistir a mudanças",
              "Aprender continuamente",
              "Focar apenas em uma área",
              "Evitar tecnologia",
            ],
            correctAnswer: "Aprender continuamente",
          },
          {
            text: "Qual é a importância da inovação na tecnologia?",
            options: [
              "Não é importante",
              "É essencial para o progresso",
              "Dificulta o trabalho",
              "É apenas uma formalidade",
            ],
            correctAnswer: "É essencial para o progresso",
          },
          {
            text: "O que é um aplicativo?",
            options: [
              "Um tipo de hardware",
              "Um programa que executa uma função específica",
              "Um dispositivo físico",
              "Uma rede de computadores",
            ],
            correctAnswer: "Um programa que executa uma função específica",
          },
          {
            text: "Como a tecnologia pode impactar a sociedade?",
            options: [
              "Não tem impacto",
              "Pode melhorar a qualidade de vida",
              "É irrelevante",
              "Só traz problemas",
            ],
            correctAnswer: "Pode melhorar a qualidade de vida",
          },
        ],
      },
      {
        type: "Aplicação",
        name: "Quantum Leap",
        description: "5 desafios de construção tecnológica.",
        questions: [
          {
            text: "Como você aplicaria o conhecimento sobre tecnologia?",
            options: [
              "Apenas em teoria",
              "Na prática diária",
              "Em discussões",
              "Não é aplicável",
            ],
            correctAnswer: "Na prática diária",
          },
          {
            text: "Qual é um exemplo de aplicação prática da tecnologia?",
            options: [
              "Resistir a mudanças",
              "Usar ferramentas digitais",
              "Focar apenas no que você sabe",
              "Ignorar feedback",
            ],
            correctAnswer: "Usar ferramentas digitais",
          },
          {
            text: "Como a compreensão das tendências tecnológicas pode ser aplicada?",
            options: [
              "Apenas em testes",
              "Na tomada de decisões",
              "Na memorização",
              "Na leitura de notícias",
            ],
            correctAnswer: "Na tomada de decisões",
          },
          {
            text: "Qual é a melhor forma de aplicar o que você aprendeu sobre segurança cibernética?",
            options: [
              "Esquecendo",
              "Praticando regularmente",
              "Lendo mais",
              "Discutindo com amigos",
            ],
            correctAnswer: "Praticando regularmente",
          },
          {
            text: "Como a aplicação do conhecimento pode impactar sua carreira?",
            options: [
              "Não tem impacto",
              "Pode abrir novas oportunidades",
              "É irrelevante",
              "Só é importante para acadêmicos",
            ],
            correctAnswer: "Pode abrir novas oportunidades",
          },
        ],
      },
    ],
  },
];

export async function createTrails() {
  for (const trail of mockTrails) {
    await prisma.trail.create({
      data: {
        title: trail.title,
        estimatedDuration: 10,
        status: "IN_PROGRESS",
        flag: "web-summit-2025",
        description: trail.summary,
        badge: {
          create: {
            title: trail.title,
            url: "https://i5aee2oj19.ufs.sh/f/VNtBLK6CzQXGf0EJsdrDINyQtpO5bvA4CsH1ncZMXjS6L7aF",
            description: trail.summary,
          },
        },
        quests: {
          create: trail.quests.map((quest, index) => ({
            description: quest.name,
            difficultyLevel: index + 1,
            status: index === 0 ? "AVAILABLE" : "LOCKED",
            questions: {
              create: quest.questions.map((question) => ({
                text: question.text,
                alternatives: question.options,
                correctAnswer: question.options.indexOf(question.correctAnswer),
                feedback: "Feedback",
              })),
            },
          })),
        },
      },
    });
  }
}
