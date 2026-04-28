interface Props {
  badge: {
    title: string;
    description: string;
    level: number;
    generationPrompt: string;
  };
}

export function generateBadgePrompt({ badge }: Props) {
  return `
    Create a modern, minimalist achievement badge representing the theme: ${badge.title}. 
    The badge should be simple, elegant, and suitable as an achievement icon in a cartoon style. 
    Use a clean design with subtle details.

    The badge description is: ${badge.description}
    The badge should be a level ${badge.level} badge.

    what to consider for levels:
    - Level 0: The badge should be a simple icon that represents the theme with few details and colors.
    - Level 1: The badge should be a simple icon that represents the theme.
    - Level 2: The badge should be a more complex icon that represents the theme.
    - Level 3: The badge should be a very complex icon that represents the theme.

    Here is a helper prompt that is used to generate the badge level 0:
    ${badge.generationPrompt}

    you should not strictly follow the generation prompt, but you can use it as a reference to generate the badge.
  `;
}
