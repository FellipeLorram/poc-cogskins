"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { ContentValidationError } from "../errors/content-validation-error";

const validateContentRequestSchema = z.object({
  contents: z.array(z.string()).min(1).max(3),
});

type ValidateContentRequest = z.infer<typeof validateContentRequestSchema>;

interface ValidateContentResponse {
  content: string;
  contentPrompt: string;
  theme?: string;
}

const validationSchema = z.object({
  coherent: z
    .boolean()
    .describe("Whether the contents are thematically related"),
  theme: z
    .string()
    .nullable()
    .describe("Main theme/topic if coherent, null if not"),
  reason: z
    .string()
    .describe("Detailed explanation of why the contents are coherent or not"),
  unifiedContent: z
    .string()
    .describe(
      "A unified and organized version of all contents, removing redundancies and organizing in a logical sequence"
    ),
  optimizedPrompt: z
    .string()
    .describe(
      "An optimized prompt that captures the essence of the content and can be used to generate questions"
    ),
});

type ValidationResult = z.infer<typeof validationSchema>;

export async function validateContents(
  request: ValidateContentRequest
): Promise<ValidateContentResponse> {
  try {
    const { contents } = validateContentRequestSchema.parse(request);

    const prompt = `
            Analyze the following contents and determine if they are thematically coherent and related enough to create a meaningful learning path:

            ${contents
              .map((content, i) => `Content ${i + 1}:\n${content}\n`)
              .join("\n")}

            Consider:
            - The contents should share a common theme or be logically connected
            - They should complement or build upon each other
            - The combination should make sense for a learning path
            - If coherent, create a unified version of the content, organizing logically and removing redundancies
            - Create an optimized prompt that captures the essence of the content for question generation
            - ALL content MUST be in Brazilian Portuguese
            - Use clear and accessible language
            - Maintain logical organization of content
            - Preserve main concepts
            - The content can be a phrase with an idea, doesn't need to be a long text (example: "Roman Empire", "Cold War", "Grain Belt")
        `;

    const { object } = await generateObject<ValidationResult>({
      model: openai("gpt-3.5-turbo"),
      schema: validationSchema,
      prompt,
      temperature: 0.3,
    });

    if (!object.coherent) {
      throw new ContentValidationError(object.reason);
    }

    return {
      content: object.unifiedContent,
      contentPrompt: object.optimizedPrompt,
      theme: object.coherent ? object.theme || undefined : undefined,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to validate contents. Please try again.";
    throw new ContentValidationError(message);
  }
}
