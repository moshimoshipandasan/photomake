
import type { Part } from '@google/genai';

/**
 * Converts a File object to a base64 string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 encoded string.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // result is a data URL (e.g., "data:image/jpeg;base64,..."), we only need the base64 part
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Converts a File object into a Generative Part object for the Gemini API.
 * @param file The file to convert.
 * @returns A promise that resolves to a Gemini Part object.
 */
export async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedData = await fileToBase64(file);
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}
