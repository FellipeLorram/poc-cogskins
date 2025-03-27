import pdfParse from "pdf-parse";
import * as mammoth from "mammoth";

export type SupportedFileType = "pdf" | "doc" | "docx" | "md" | "txt";

interface ExtractContentResult {
  success: boolean;
  content: string;
  error?: string;
}

interface ExtractContentResponse {
  contents: string[];
  error?: string;
  success: boolean;
}

export async function extractContents(
  files: File[]
): Promise<ExtractContentResponse> {
  try {
    const contents: string[] = [];
    const errors: string[] = [];

    await Promise.all(
      files.map(async (file) => {
        const result = await extractSingleContent(file);
        if (result.success) {
          contents.push(result.content);
        } else {
          errors.push(`${file.name}: ${result.error}`);
        }
      })
    );

    if (errors.length > 0) {
      return {
        success: false,
        contents: [],
        error: errors.join("\n"),
      };
    }

    return {
      success: true,
      contents: contents,
    };
  } catch (error) {
    return {
      success: false,
      contents: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

async function extractSingleContent(file: File): Promise<ExtractContentResult> {
  try {
    const fileExtension = file.name
      .split(".")
      .pop()
      ?.toLowerCase() as SupportedFileType;
    const buffer = await file.arrayBuffer().then(Buffer.from);

    switch (fileExtension) {
      case "pdf":
        return await extractPdfContent(buffer);
      case "doc":
      case "docx":
        return await extractDocContent(buffer);
      case "md":
      case "txt":
        return {
          success: true,
          content: await file.text(),
        };
      default:
        return {
          success: false,
          content: "",
          error: `Unsupported file type: ${fileExtension}`,
        };
    }
  } catch (error) {
    return {
      success: false,
      content: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

async function extractPdfContent(
  buffer: Buffer
): Promise<ExtractContentResult> {
  try {
    const data = await pdfParse(buffer);
    return {
      success: true,
      content: data.text,
    };
  } catch (err) {
    return {
      success: false,
      content: "",
      error:
        err instanceof Error ? err.message : "Failed to extract PDF content",
    };
  }
}

async function extractDocContent(
  buffer: Buffer
): Promise<ExtractContentResult> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return {
      success: true,
      content: result.value,
    };
  } catch (err) {
    return {
      success: false,
      content: "",
      error:
        err instanceof Error
          ? err.message
          : "Failed to extract DOC/DOCX content",
    };
  }
}
