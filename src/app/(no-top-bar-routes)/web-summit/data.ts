import { Trail } from "./types";

export const trails: Trail[] = [
  {
    id: "hybrid-intelligence",
    title: "Hybrid Intelligence",
    summary:
      "Explore the synergy between human and artificial intelligence through memory, comprehension, and application quests.",
    quests: [
      {
        type: "Memory",
        level: 1,
        name: "Neural Recall",
        description:
          "Recall basic facts and definitions about Hybrid Intelligence.",
        questions: [
          {
            id: "hybrid-intelligence-memory-1",
            text: "What is the main goal of Hybrid Intelligence (HI)?",
            options: [
              "To replace humans with robots",
              "To create an AI that thinks exactly like humans",
              "To combine human and artificial intelligence for better outcomes",
              "To make humans dependent on machines",
            ],
            correctAnswer:
              "To combine human and artificial intelligence for better outcomes",
          },
          {
            id: "hybrid-intelligence-memory-2",
            text: "How can AI assist in learning?",
            options: [
              "By assigning the same lesson to everyone",
              "By organizing students into straight rows",
              "By adapting tasks to each student’s level",
              "By making students copy from the board",
            ],
            correctAnswer: "By adapting tasks to each student’s level",
          },
          {
            id: "hybrid-intelligence-memory-3",
            text: "Which of the following is an example of AI-human collaboration?",
            options: [
              "A student reading a book alone",
              "A robot replacing a teacher",
              "A platform suggesting lessons based on a student’s progress",
              "A computer that only runs PowerPoint",
            ],
            correctAnswer:
              "A platform suggesting lessons based on a student’s progress",
          },
          {
            id: "hybrid-intelligence-memory-4",
            text: "What is a key risk of algorithm-based content recommendation?",
            options: [
              "Exposure to too many opinions",
              "Getting trapped in filter bubbles",
              "Losing interest in technology",
              "Learning too deeply",
            ],
            correctAnswer: "Getting trapped in filter bubbles",
          },
          {
            id: "hybrid-intelligence-memory-5",
            text: "Which industry is using Hybrid Intelligence to assist with diagnosis?",
            options: ["Automotive", "Education", "Medicine", "Tourism"],
            correctAnswer: "Medicine",
          },
        ],
      },
      {
        type: "Comprehension",
        level: 2,
        name: "Synaptic Decode",
        description:
          "Understand concepts, compare ideas, and identify consequences of Hybrid Intelligence.",
        questions: [
          {
            id: "hybrid-intelligence-comprehension-1",
            text: "What makes human intelligence essential in Hybrid Intelligence?",
            options: [
              "It can charge devices",
              "It brings creativity, empathy, and critical thinking",
              "It stores more data than machines",
              "It avoids emotional decision-making",
            ],
            correctAnswer:
              "It brings creativity, empathy, and critical thinking",
          },
          {
            id: "hybrid-intelligence-comprehension-2",
            text: "How does traditional learning differ from AI-assisted learning?",
            options: [
              "AI-assisted learning gives the same content to all",
              "Traditional learning is more global",
              "AI-assisted learning adapts content to each learner",
              "Traditional learning is automated",
            ],
            correctAnswer:
              "AI-assisted learning adapts content to each learner",
          },
          {
            id: "hybrid-intelligence-comprehension-3",
            text: "What is one danger of over-relying on AI suggestions?",
            options: [
              "It improves memory",
              "It narrows our exposure to diverse ideas",
              "It increases reading speed",
              "It enhances deep thinking",
            ],
            correctAnswer: "It narrows our exposure to diverse ideas",
          },
          {
            id: "hybrid-intelligence-comprehension-4",
            text: "Which best explains the idea of ‘cognitive offloading’?",
            options: [
              "Letting AI do the physical work",
              "Using AI to store or process info we don’t need to memorize",
              "Asking others to study for us",
              "Taking a break during mental tasks",
            ],
            correctAnswer:
              "Using AI to store or process info we don’t need to memorize",
          },
          {
            id: "hybrid-intelligence-comprehension-5",
            text: "Why might personalized AI learning raise ethical questions?",
            options: [
              "Because it uses algorithms without human review",
              "Because everyone learns better this way",
              "Because it always improves test scores",
              "Because students prefer textbooks",
            ],
            correctAnswer: "Because it uses algorithms without human review",
          },
        ],
      },
      {
        type: "Application",
        level: 3,
        name: "Hybrid Hacks",
        description:
          "Use your knowledge to solve real-world scenarios involving Hybrid Intelligence.",
        questions: [
          {
            id: "hybrid-intelligence-application-1",
            text: "You are asked to improve feedback in a large online class. What Hybrid Intelligence solution would help?",
            options: [
              "Install a projector",
              "Use AI to analyze student answers and give instant feedback",
              "Print more textbooks",
              "Ask students to email questions only",
            ],
            correctAnswer:
              "Use AI to analyze student answers and give instant feedback",
          },
          {
            id: "hybrid-intelligence-application-2",
            text: "A hospital wants to speed up patient diagnosis. Which approach uses Hybrid Intelligence?",
            options: [
              "Replace doctors with AI",
              "Use AI to suggest diagnoses, with doctors confirming",
              "Only allow patients to self-diagnose",
              "Use online forums for advice",
            ],
            correctAnswer:
              "Use AI to suggest diagnoses, with doctors confirming",
          },
          {
            id: "hybrid-intelligence-application-3",
            text: "You’re designing a learning app. What would improve both human and AI collaboration?",
            options: [
              "Remove quizzes",
              "Add auto-grading and teacher-guided discussions",
              "Focus only on video content",
              "Ban feedback features",
            ],
            correctAnswer: "Add auto-grading and teacher-guided discussions",
          },
          {
            id: "hybrid-intelligence-application-4",
            text: "A company wants to avoid AI bias. What should they do?",
            options: [
              "Let the AI learn on its own",
              "Limit AI access to all users",
              "Use diverse data and human oversight",
              "Only train AI with random examples",
            ],
            correctAnswer: "Use diverse data and human oversight",
          },
          {
            id: "hybrid-intelligence-application-5",
            text: "You're applying HI in a remote rural school. What’s a realistic first step?",
            options: [
              "Set up VR labs for every subject",
              "Provide mobile devices with AI learning tools and teacher training",
              "Eliminate all human teachers",
              "Only use books from the city",
            ],
            correctAnswer:
              "Provide mobile devices with AI learning tools and teacher training",
          },
        ],
      },
    ],
  },
  {
    id: "future-of-work",
    title: "Future of Work",
    summary:
      "Explore the changes in jobs, skills, and work environments driven by automation and AI.",
    quests: [
      {
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
  {
    id: "tech-industry",
    title: "Tech Industry",
    summary:
      "Dive into the essential concepts and innovations behind today's tech revolution.",
    quests: [
      {
        type: "Memory",
        level: 1,
        name: "Binary Roots",
        description:
          "Recall fundamental facts and definitions about hardware, software, and tech evolution.",
        questions: [
          {
            id: "tech-industry-memory-1",
            text: "What is considered hardware?",
            options: [
              "RAM",
              "Microsoft Word",
              "Photoshop",
              "Cloud storage unicorn",
            ],
            correctAnswer: "RAM",
          },
          {
            id: "tech-industry-memory-2",
            text: "Which of these is a software?",
            options: ["CPU", "Motherboard", "Google Docs", "Toaster chip"],
            correctAnswer: "Google Docs",
          },
          {
            id: "tech-industry-memory-3",
            text: "What’s the key difference between software and hardware?",
            options: [
              "Hardware is downloaded; software is plugged in",
              "Hardware can be touched; software is digital",
              "Software glows; hardware doesn’t",
              "Hardware speaks Latin",
            ],
            correctAnswer: "Hardware can be touched; software is digital",
          },
          {
            id: "tech-industry-memory-4",
            text: "Which of these needs physical replacement to upgrade?",
            options: [
              "Operating system",
              "Graphics card",
              "App version",
              "Email filter",
            ],
            correctAnswer: "Graphics card",
          },
          {
            id: "tech-industry-memory-5",
            text: "Which example is a mix-up of hardware and software?",
            options: [
              "Smartphone and Android OS",
              "RAM and RAM app",
              "CPU and motherboard",
              "Wi-Fi and Wi-Fiction",
            ],
            correctAnswer: "Smartphone and Android OS",
          },
        ],
      },
      {
        type: "Understanding",
        level: 2,
        name: "Cloud Logic",
        description:
          "Understand how cloud computing and the Internet of Things (IoT) are transforming our world.",
        questions: [
          {
            id: "tech-industry-understanding-1",
            text: "What does 'cloud computing' mainly offer?",
            options: [
              "Remote storage and computing via internet",
              "Physical clouds generating power",
              "Air-based data compression",
              "Rain-powered data centers",
            ],
            correctAnswer: "Remote storage and computing via internet",
          },
          {
            id: "tech-industry-understanding-2",
            text: "What is an example of SaaS?",
            options: [
              "Google Docs",
              "Hard disk",
              "LAN cable",
              "Sodium-as-a-Sandwich",
            ],
            correctAnswer: "Google Docs",
          },
          {
            id: "tech-industry-understanding-3",
            text: "Which describes IoT?",
            options: [
              "A social media for robots",
              "A network of connected devices collecting data",
              "A printer network at school",
              "A human-powered computing circle",
            ],
            correctAnswer: "A network of connected devices collecting data",
          },
          {
            id: "tech-industry-understanding-4",
            text: "Which IoT example is used in agriculture?",
            options: [
              "Soil moisture sensors",
              "Digital books",
              "Spotify recommendations",
              "Virtual cows",
            ],
            correctAnswer: "Soil moisture sensors",
          },
          {
            id: "tech-industry-understanding-5",
            text: "What is a major challenge of IoT?",
            options: [
              "Device colors",
              "Data security and hacking risks",
              "Lack of Bluetooth speakers",
              "Bored devices",
            ],
            correctAnswer: "Data security and hacking risks",
          },
        ],
      },
      {
        type: "Application",
        level: 3,
        name: "Quantum Leap",
        description:
          "Apply your knowledge to real-world tech scenarios and evaluate ongoing innovations.",
        questions: [
          {
            id: "tech-industry-application-1",
            text: "Which of these is an AI-generated content tool?",
            options: ["ChatGPT", "WordPad", "Paint", "Echo Banana Translator"],
            correctAnswer: "ChatGPT",
          },
          {
            id: "tech-industry-application-2",
            text: "What role does AI play in healthcare?",
            options: [
              "Generating weather reports",
              "Running surgeries solo",
              "Image-based diagnosis support",
              "Feeding patients with drones",
            ],
            correctAnswer: "Image-based diagnosis support",
          },
          {
            id: "tech-industry-application-3",
            text: "Which company offers IaaS (Infrastructure as a Service)?",
            options: [
              "Amazon Web Services (AWS)",
              "Spotify",
              "Instagram",
              "Cloud Castle Inc.",
            ],
            correctAnswer: "Amazon Web Services (AWS)",
          },
          {
            id: "tech-industry-application-4",
            text: "What is a current concern about AI use?",
            options: [
              "It uses too much sugar",
              "Algorithmic bias and job replacement",
              "Too many buttons",
              "It refuses to talk to humans",
            ],
            correctAnswer: "Algorithmic bias and job replacement",
          },
          {
            id: "tech-industry-application-5",
            text: "What is an innovative workplace tool using immersive environments?",
            options: [
              "Microsoft Mesh",
              "Google Sheets",
              "Microsoft Paint",
              "Augmented Pancake Space",
            ],
            correctAnswer: "Microsoft Mesh",
          },
        ],
      },
    ],
  },
];

export const badgeLevelMap: Record<number, string> = {
  0: "/badges/wsr_level0.png",
  1: "/badges/wsr_level1.png",
  2: "/badges/wsr_level2.png",
  3: "/badges/wsr_level3.png",
  4: "/badges/wsr_level4.png",
  5: "/badges/wsr_level5.png",
  6: "/badges/wsr_level6.png",
  7: "/badges/wsr_level7.png",
  8: "/badges/wsr_level8.png",
  9: "/badges/wsr_level9.png",
};
