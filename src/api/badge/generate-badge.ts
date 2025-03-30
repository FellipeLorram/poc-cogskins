"use server";

import { openai } from "@ai-sdk/openai";
import { uploadFiles } from "../ut-api";

interface GenerateBadgeImageRequest {
  theme: string;
}

interface GenerateBadgeImageResponse {
  url: string;
}

export async function generateBadgeImage({
  theme,
}: GenerateBadgeImageRequest): Promise<
  GenerateBadgeImageResponse | { error: string }
> {
  try {
    const model = openai.image("dall-e-3");
    const prompt = `Create a modern, minimalist achievement badge representing the theme: ${theme}. The badge should be simple, elegant, and suitable as an achievement icon. Use a clean design with subtle details.`;

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
      throw new Error("Falha ao gerar imagem");
    }

    return {
      url,
    };
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    return {
      error: error instanceof Error ? error.message : "Falha ao gerar imagem",
    };
  }
}

function convertImageDataToFile(
  imageData: string | Uint8Array,
  filename: string
): { file: File } {
  let file: File;

  if (typeof imageData === "string") {
    // Se for base64, converter para blob
    const base64Data = imageData.split(",")[1] || imageData;
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "image/png" });
    file = new File([blob], filename, { type: "image/png" });
  } else {
    // Se for Uint8Array, criar o file diretamente
    file = new File([imageData], filename, { type: "image/png" });
  }

  return { file };
}
