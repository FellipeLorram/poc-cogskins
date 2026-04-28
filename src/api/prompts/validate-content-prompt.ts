interface Props {
  contents: string[];
}

export function validateContentPrompt({ contents }: Props) {
  return `
  Analyze the following contents and determine if they are thematically coherent and related enough to create a meaningful learning path:

  ${contents.map((content, i) => `Content ${i + 1}:\n${content}\n`).join("\n")}

  Consider:
  - The contents should share a common theme or be logically connected
  - They should complement or build upon each other
  - The combination should make sense for a learning path
  - If coherent, create a unified version of the content, organizing logically and removing redundancies
  - Create an optimized prompt that captures the essence of the content for question generation
  - Use clear and accessible language
  - Maintain logical organization of content
  - Preserve main concepts
  - The content can be a phrase with an idea, doesn't need to be a long text (example: "Roman Empire", "Cold War", "Grain Belt")
`;
}
