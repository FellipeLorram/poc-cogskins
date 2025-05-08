import { Trail } from "./types";

export const trails: Trail[] = [
  {
    id: "future-of-work",
    title: "Future of Work",
    summary:
      "Explore the changes in jobs, skills, and work environments driven by automation and AI.",
    quests: [
      {
        id: "future-of-work-memory",
        type: "Memory",
        level: 1,
        name: "Career Cache",
        description:
          "Recall the key facts, definitions, and trends shaping the future of work.",
        questions: [
          {
            id: "future-of-work-memory-1",
            text: "Which job is growing due to automation?",
            options: [
              "AI engineer",
              "Bank teller",
              "Data entry clerk",
              "Lamp polisher",
            ],
            correctAnswer: "AI engineer",
          },
          {
            id: "future-of-work-memory-2",
            text: "Which industry is most affected by automation?",
            options: [
              "Manufacturing",
              "Fashion design",
              "Marine biology",
              "Origami crafting",
            ],
            correctAnswer: "Manufacturing",
          },
          {
            id: "future-of-work-memory-3",
            text: "What is one effect of automation on jobs?",
            options: [
              "Job transformation and creation",
              "Jobs become eternal",
              "No change at all",
              "Total disappearance of computers",
            ],
            correctAnswer: "Job transformation and creation",
          },
          {
            id: "future-of-work-memory-4",
            text: "What kind of tasks are easily automated?",
            options: [
              "Repetitive and predictable tasks",
              "Creative writing",
              "Emotional coaching",
              "Philosophical debates",
            ],
            correctAnswer: "Repetitive and predictable tasks",
          },
          {
            id: "future-of-work-memory-5",
            text: "Which is a real-world trend in future jobs?",
            options: [
              "More hybrid roles requiring soft and technical skills",
              "Full return to medieval job titles",
              "Elimination of communication in teams",
              "Rise of professional typewriter fixers",
            ],
            correctAnswer:
              "More hybrid roles requiring soft and technical skills",
          },
        ],
      },
      {
        id: "future-of-work-understanding",
        type: "Understanding",
        level: 2,
        name: "Skill Unpack",
        description:
          "Understand how skills, adaptability, and learning shape future career success.",
        questions: [
          {
            id: "future-of-work-understanding-1",
            text: "What is a soft skill?",
            options: [
              "Communication",
              "Programming language",
              "Hard disk drive",
              "Glue resistance",
            ],
            correctAnswer: "Communication",
          },
          {
            id: "future-of-work-understanding-2",
            text: "Which of these is considered a 21st-century skill?",
            options: [
              "Critical thinking",
              "Candle making",
              "Feather weaving",
              "Royal etiquette",
            ],
            correctAnswer: "Critical thinking",
          },
          {
            id: "future-of-work-understanding-3",
            text: "What does 'lifelong learning' mean?",
            options: [
              "Continuously acquiring new skills throughout life",
              "Learning only until age 30",
              "Studying while sleeping forever",
              "One single course for life",
            ],
            correctAnswer: "Continuously acquiring new skills throughout life",
          },
          {
            id: "future-of-work-understanding-4",
            text: "What skill is key for adapting to rapid changes?",
            options: [
              "Flexibility",
              "Inflexibility",
              "Freezing in panic",
              "Refusing new tools",
            ],
            correctAnswer: "Flexibility",
          },
          {
            id: "future-of-work-understanding-5",
            text: "Why are digital skills important for the future?",
            options: [
              "They enable people to navigate and contribute to tech-driven environments",
              "They make emails explode",
              "They remove the need for thinking",
              "They only work on rainy days",
            ],
            correctAnswer:
              "They enable people to navigate and contribute to tech-driven environments",
          },
        ],
      },
      {
        id: "future-of-work-application",
        type: "Application",
        level: 3,
        name: "Disrupt Lab",
        description:
          "Apply your knowledge of future job trends to realistic and critical-thinking scenarios.",
        questions: [
          {
            id: "future-of-work-application-1",
            text: "Which job would likely grow with AI support?",
            options: [
              "Data analyst",
              "VHS rewinder",
              "Fax machine tester",
              "Pencil sharpener",
            ],
            correctAnswer: "Data analyst",
          },
          {
            id: "future-of-work-application-2",
            text: "What is an example of a hybrid job?",
            options: [
              "Digital marketing analyst",
              "Knight in shining armor",
              "Pirate accountant",
              "Horseback web designer",
            ],
            correctAnswer: "Digital marketing analyst",
          },
          {
            id: "future-of-work-application-3",
            text: "How can someone prepare for an evolving job market?",
            options: [
              "By building both soft and technical skills",
              "Ignoring new trends",
              "Sticking to one skill forever",
              "Avoiding collaboration",
            ],
            correctAnswer: "By building both soft and technical skills",
          },
          {
            id: "future-of-work-application-4",
            text: "Why might someone need to change careers more than once?",
            options: [
              "Because industries evolve and new jobs emerge",
              "To collect business cards",
              "Because jobs disappear after 5 years",
              "To win a job bingo game",
            ],
            correctAnswer: "Because industries evolve and new jobs emerge",
          },
          {
            id: "future-of-work-application-5",
            text: "Which behavior shows readiness for the future of work?",
            options: [
              "Embracing change and being open to learning",
              "Rejecting all digital tools",
              "Complaining about every update",
              "Ignoring team collaboration",
            ],
            correctAnswer: "Embracing change and being open to learning",
          },
        ],
      },
    ],
  },
];

export const badgeLevelMap: Record<number, string> = {
  0: "/badges/drapper-level-0.png",
  1: "/badges/drapper-level-1.png",
  2: "/badges/drapper-level-2.png",
  3: "/badges/drapper-level-3.png",
};
