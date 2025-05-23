"use server";

import { openai } from "@ai-sdk/openai";
import { uploadFiles } from "../ut-api";
import { BadgeGenerationError } from "../errors/badge-generation-error";

interface GenerateBadgeImageRequest {
  theme: string;
}

interface GenerateBadgeImageResponse {
  url: string;
}

export async function generateBadgeImage({
  theme,
}: GenerateBadgeImageRequest): Promise<GenerateBadgeImageResponse> {
  try {
    const model = openai.image("dall-e-3");
    const prompt = `Create a modern, minimalist achievement badge representing the theme: ${theme}. The badge should be simple, elegant, and suitable as an achievement icon in a cartoon style. Use a clean design with subtle details.`;

    const result = await model.doGenerate({
      prompt,
      size: "1024x1024",
      aspectRatio: "1:1",
      seed: Math.floor(Math.random() * 1000000),
      providerOptions: {},
      n: 1,
    });

    const file = convertImageDataToFile(
      result.images[0],
      `badge-${theme.toLowerCase().replace(" ", "-")}.png`
    );
    const uploadResult = await uploadFiles([file.file]);
    const url = uploadResult[0].data?.ufsUrl;

    if (!url) {
      throw new BadgeGenerationError("Failed to generate image");
    }

    return {
      url,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate image. Please try again.";
    throw new BadgeGenerationError(message);
  }
}

function convertImageDataToFile(
  imageData: string | Uint8Array,
  filename: string
): { file: File } {
  let file: File;

  if (typeof imageData === "string") {
    // If it's base64, convert to blob
    const base64Data = imageData.split(",")[1] || imageData;
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "image/png" });
    file = new File([blob], filename, { type: "image/png" });
  } else {
    // If it's Uint8Array, create the file directly
    file = new File([imageData], filename, { type: "image/png" });
  }

  return { file };
}
