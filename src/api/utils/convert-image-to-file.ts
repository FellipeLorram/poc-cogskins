export function convertImageDataToFile(
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
