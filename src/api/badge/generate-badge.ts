import { BadgeGenerationError } from "@/errors/badge-generation-error";
import { generateBadgePrompt } from "@/api/prompts/generate-badge-prompt";
import { uploadFiles } from "@/api/ut-api";
import { convertImageDataToFile } from "@/api/utils/convert-image-to-file";
import { openai } from "@ai-sdk/openai";

interface GenerateBadgeImageRequest {
  badge: {
    title: string;
    description: string;
    level: number;
    generationPrompt: string;
  };
}

export async function generateBadgeImage({ badge }: GenerateBadgeImageRequest) {
  const model = openai.image("dall-e-3");
  const prompt = generateBadgePrompt({ badge });

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
    `badge-${badge.title.toLowerCase().replace(" ", "-")}.png`
  );

  const uploadResult = await uploadFiles([file.file]);
  const url = uploadResult[0].data?.ufsUrl;

  if (!url) {
    throw new BadgeGenerationError("Failed to generate image");
  }

  return {
    url,
  };
}
