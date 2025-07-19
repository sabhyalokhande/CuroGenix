"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { NextRequest, NextResponse } from 'next/server'

interface MedicineScanData {
  batchNumber: string | null
  medicineName: string | null
  manufacturer: string | null
  expiryDate: string | null
  confidence: "high" | "medium" | "low"
}

interface MedicineScanResponse {
  success: boolean
  data?: MedicineScanData
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

export async function generateMedicineScanData(imageDataUrl: string): Promise<MedicineScanResponse> {
  try {
    // Extract base64 part from data URL
    const imageBase64 = imageDataUrl.split(",")[1];

    // Use the AI SDK to call the Gemini API for medicine analysis
    const { text: rawText } = await generateText({
      model: google("gemini-1.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              mimeType: "image/jpeg",
              image: imageBase64,
            },
            {
              type: "text",
              text: `Analyze this medicine image and extract the following information:
1. Batch Number (BNO) - Look for patterns like "BNO:", "Batch:", "Lot:", "Batch No:", followed by alphanumeric characters
2. Medicine Name
3. Manufacturer
4. Expiry Date (if visible)

Focus especially on finding the batch number. Look for:
- Numbers and letters in sequence (e.g., DOBS8382, DOBS3984, ABC123456)
- Text that appears after "BNO", "Batch", "Lot", "Batch No"
- Any alphanumeric code that could be a batch identifier
- Common patterns: DOBS followed by numbers, or similar alphanumeric codes

IMPORTANT: Extract the batch number exactly as it appears, including any letters and numbers. Do not modify or format it.

Format the output strictly as a JSON object with this exact structure:
{
  "batchNumber": "extracted batch number exactly as shown or null if not found",
  "medicineName": "medicine name or null if not found",
  "manufacturer": "manufacturer name or null if not found",
  "expiryDate": "expiry date or null if not found",
  "confidence": "high/medium/low based on clarity of text"
}

If you cannot find any batch number, set batchNumber to null and confidence to "low".
Do NOT include any conversational text or markdown formatting outside the JSON.`,
            },
          ],
        },
      ],
    });

    // Extract the pure JSON string from the raw text response
    const jsonString = extractJsonFromMarkdown(rawText);
    const parsedData = JSON.parse(jsonString) as MedicineScanData;
    
    return { success: true, data: parsedData };
  } catch (error: any) {
    console.error("Medicine scan Gemini API error:", error);
    if (error.message.includes("API key not found")) {
      return { success: false, error: "Gemini API key is missing or invalid. Please set GOOGLE_API_KEY." };
    }
    if (error instanceof SyntaxError) {
      return { success: false, error: `Failed to parse AI response as JSON. Raw response: ${error.message}` };
    }
    return { success: false, error: `Failed to analyze medicine image with AI: ${error.message || "Unknown error"}` };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { imageDataUrl } = await req.json();
    const result = await generateMedicineScanData(imageDataUrl);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Unknown error' }, { status: 500 });
  }
} 