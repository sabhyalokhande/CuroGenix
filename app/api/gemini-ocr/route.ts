"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"

interface MedicineDetail {
  name: string
  uses: string[]
  estPrice: string
}

interface GeminiApiResponse {
  success: boolean
  data?: MedicineDetail[]
  error?: string
}

/**
 * Extracts a JSON string from a text that might be wrapped in Markdown code blocks.
 * @param text The input text, potentially containing '```json' and '```'.
 * @returns The extracted JSON string, or the original text if no Markdown block is found.
 */
function extractJsonFromMarkdown(text: string): string {
  const jsonBlockRegex = /```json\n([\s\S]*?)\n```/
  const match = text.match(jsonBlockRegex)
  if (match && match[1]) {
    return match[1].trim()
  }
  // If no markdown block is found, assume the text itself is the JSON or an error message
  return text.trim()
}

export async function generatePrescriptionData(imageDataUrl: string): Promise<GeminiApiResponse> {
  try {
    // Extract base64 part from data URL
    const imageBase64 = imageDataUrl.split(",")[1]

    // Use the AI SDK to call the Gemini API with the 'messages' array for multimodal input
    const { text: rawText } = await generateText({
      model: google("gemini-1.5-flash"), // Using the recommended gemini-1.5-flash model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              mimeType: "image/jpeg", // Assuming the captured image is JPEG
              image: imageBase64,
            },
            {
              type: "text",
              text: `Analyze this prescription image. Extract all medicine names, their primary uses, and an estimated price range for each.
                     Format the output strictly as a JSON array of objects, where each object has 'name' (string), 'uses' (array of strings),
                     and 'estPrice' (string like '₹XX - ₹YY').
                     If no medicines are found, return an empty JSON array: [].
                     Do NOT include any conversational text or markdown formatting outside the JSON.`,
            },
          ],
        },
      ],
    })

    // Extract the pure JSON string from the raw text response
    const jsonString = extractJsonFromMarkdown(rawText)

    // Parse the JSON response from the AI model
    const parsedData = JSON.parse(jsonString) as MedicineDetail[]
    return { success: true, data: parsedData }
  } catch (error: any) {
    console.error("Gemini API error:", error)
    if (error.message.includes("API key not found")) {
      return { success: false, error: "Gemini API key is missing or invalid. Please set GOOGLE_API_KEY." }
    }
    // Catch JSON parsing errors specifically
    if (error instanceof SyntaxError) {
      return { success: false, error: `Failed to parse AI response as JSON. Raw response: ${error.message}` }
    }
    return { success: false, error: `Failed to analyze image with AI: ${error.message || "Unknown error"}` }
  }
}

export async function POST(req: Request) {
  try {
    const { imageDataUrl } = await req.json();
    if (!imageDataUrl) {
      return new Response(JSON.stringify({ success: false, error: 'Missing imageDataUrl' }), { status: 400 });
    }
    const result = await generatePrescriptionData(imageDataUrl);
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message || 'Unknown error' }), { status: 500 });
  }
}
