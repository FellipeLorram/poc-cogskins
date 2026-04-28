interface Props {
  theme: string;
  content: string;
  contentPrompt: string;
}

export function generateTrailPrompt({ theme, content, contentPrompt }: Props) {
  return `
    Generate a learning trail based on the following content and theme:

    Theme: ${theme}
    Content: ${content}
    Content Prompt: ${contentPrompt}

    Create an engaging learning experience with:
    - An attractive title that reflects the content
    - Estimated duration in minutes
    - 3 quests with progressive difficulty (1 to 3)
    - A badge that represents the achievement
    - A prompt that will be used as an enhancer for the badge generation, outlining that its a badge level 0
    
    Consider:
    - ALL content MUST be in English
    - Use clear and accessible language
    - The title should be captivating and descriptive
    - The duration should be realistic for the content
    - Quests should have increasing complexity
    - The badge should have engaging title and description
    - Generation prompts should be optimized to generate relevant questions
    - Quest needs a description that explains what the quest is about
`;
}
