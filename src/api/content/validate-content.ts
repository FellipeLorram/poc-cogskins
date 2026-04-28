"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { ContentValidationError } from "../../errors/content-validation-error";
import { validateContentPrompt } from "../prompts/validate-content-prompt";

interface ValidateContentRequest {
  contents: string[];
}

interface ValidateContentResponse {
  content: string;
  contentPrompt: string;
  theme: string;
}

const validationSchema = z.object({
  coherent: z
    .boolean()
    .describe("Whether the contents are thematically related"),
  theme: z.string().describe("Main theme/topic if coherent, null if not"),
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

export async function validateContents({
  contents,
}: ValidateContentRequest): Promise<ValidateContentResponse> {
  try {
    const prompt = validateContentPrompt({ contents });

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
      theme: object.theme,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to validate contents. Please try again.";
    throw new ContentValidationError(message);
  }
}
