import { Trail } from "./types";

export const trails: Trail[] = [
  {
    id: "future-of-work",
    title: "Pet, o Dragão e o Mistério das Pegadas",
    summary:
      "Questões de memória sobre os conceitos fundamentais da pegada ecológica e o uso consciente dos recursos naturais.",
    quests: [
      {
        id: "pet-o-dragao-e-o-misterio-das-pegadas-1",
        type: "Memória",
        level: 1,
        name: "As Pegadas do Passado",
        description:
          "Lembre e reconheça os conceitos essenciais sobre a pegada ecológica enquanto acompanha Pet em sua primeira descoberta no bosque.",
        questions: [
          {
            text: "Qual destes é um exemplo de recurso natural usado pelos moradores de Ecolândia?",
            id: "pet-o-dragao-e-o-misterio-das-pegadas-1",
            options: [
              "Madeira das árvores da floresta",
              "Poções coloridas de arco-íris",
              "Raios mágicos do castelo do rei",
              "Palha de unicórnio que brilha no escuro",
            ],
            correctAnswer: "Madeira das árvores da floresta",
          },
          {
            text: "De onde vêm os recursos que usamos para fazer objetos como espadas e livros?",
            id: "pet-o-dragao-e-o-misterio-das-pegadas-2",
            options: [
              "Da natureza",
              "Do castelo do rei",
              "Da lua encantada",
              "De uma fábrica de nuvens doces",
            ],
            correctAnswer: "Da natureza",
          },
          {
            text: "O que acontece se retirarmos mais recursos da natureza do que ela pode repor?",
            id: "pet-o-dragao-e-o-misterio-das-pegadas-3",
            options: [
              "Eles se esgotam e não conseguimos mais usá-los",
              "Eles crescem mais rápido",
              "Eles viram brinquedos automáticos",
              "Aparecem coelhos mágicos que distribuem tudo de volta",
            ],
            correctAnswer: "Eles se esgotam e não conseguimos mais usá-los",
          },
          {
            text: "Por que é importante cuidar do quanto usamos os recursos naturais?",
            id: "pet-o-dragao-e-o-misterio-das-pegadas-4",
            options: [
              "Porque eles são limitados e essenciais para a vida",
              "Porque o rei pediu",
              "Porque dragões têm alergia a desperdício",
              "Porque senão a floresta vira gelatina verde",
            ],
            correctAnswer: "Porque eles são limitados e essenciais para a vida",
          },
          {
            text: "Quando usamos recursos e geramos lixo, o que deixamos na natureza?",
            id: "pet-o-dragao-e-o-misterio-das-pegadas-5",
            options: [
              "Uma marca chamada pegada ecológica",
              "Um perfume invisível",
              "Um portal para outro mundo",
              "Um sinal secreto para as fadas recicladoras",
            ],
            correctAnswer: "Uma marca chamada pegada ecológica",
          },
        ],
      },
    ],
  },
];

export const badgeLevelMap: Record<number, string> = {
  0: "/badges/pet-level-0.png",
  1: "/badges/pet-level-1.png",
};
