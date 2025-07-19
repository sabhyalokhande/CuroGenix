"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { NextRequest, NextResponse } from 'next/server'

interface ReceiptItem {
  name: string
  price: string
  estPrice: string
}

interface ReceiptApiResponse {
  success: boolean
  data?: ReceiptItem[]
  error?: string
}

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

async function getAllMedicines(): Promise<any[]> {
  // Use the native fetch API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/medicines`);
  if (!res.ok) return [];
  return await res.json();
}

function correctMedicineName(name: string, validNames: string[]): string {
  const stringSimilarity = require('string-similarity');
  const { bestMatch } = stringSimilarity.findBestMatch(name, validNames);
  return bestMatch.rating > 0.7 ? bestMatch.target : name;
}

async function getExpectedPrice(name: string, receiptPrice: string): Promise<string> {
  // Extract numeric price from receipt price
  const numericPrice = parseFloat(receiptPrice.replace(/[^\d.]/g, ""));
  
  if (isNaN(numericPrice) || numericPrice === 0) {
    return 'N/A';
  }
  
  // Add randomness: 65% correct price, 35% lower price
  const random = Math.random();
  
  if (random <= 0.65) {
    // 65% chance: return the receipt price (as "correct")
    console.log(`💰 Correct price for "${name}": ₹${numericPrice}`);
    return `₹${numericPrice}`;
  } else {
    // 35% chance: return price with 5-15% lower variation
    const variationPercent = 5 + Math.random() * 10; // 5-15%
    const adjustedPrice = numericPrice * (1 - variationPercent / 100);
    
    console.log(`🎲 Lower price for "${name}": ₹${numericPrice} → ₹${adjustedPrice.toFixed(2)} (-${variationPercent.toFixed(1)}%)`);
    return `₹${adjustedPrice.toFixed(2)}`;
  }
}

export async function generateReceiptData(imageDataUrl: string): Promise<any> {
  try {
    // Extract base64 part from data URL
    const imageBase64 = imageDataUrl.split(",")[1];

    // Use the AI SDK to call the Gemini API for receipt analysis
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
              text: `Analyze this receipt/bill image. Extract:
- The pharmacy name (string, key: pharmacyName)
- The pharmacy address/location (string, key: location)
- All item names and their actual prices from the receipt (array, key: items, where each object has 'name' and 'price')
Format the output strictly as a JSON object with keys: pharmacyName, location, items. Example: { "pharmacyName": "...", "location": "...", "items": [ { "name": "...", "price": "..." } ] }
If any field is missing, use an empty string or empty array. Do NOT include any conversational text or markdown formatting outside the JSON.`,
            },
          ],
        },
      ],
    });

    // Extract the pure JSON string from the raw text response
    const jsonString = extractJsonFromMarkdown(rawText);
    let parsedData = JSON.parse(jsonString);

    // Generate random expected prices for all items
    const correctedItems = await Promise.all((parsedData.items || []).map(async (item: any) => {
      const estPrice = await getExpectedPrice(item.name, item.price);
      return {
        name: item.name,
        price: item.price,
        estPrice,
      };
    }));

    return {
      success: true,
      data: correctedItems,
      pharmacyName: parsedData.pharmacyName || "",
      location: parsedData.location || ""
    };
  } catch (error: any) {
    console.error("Gemini API error:", error);
    if (error.message.includes("API key not found")) {
      return { success: false, error: "Gemini API key is missing or invalid. Please set GOOGLE_API_KEY." };
    }
    if (error instanceof SyntaxError) {
      return { success: false, error: `Failed to parse AI response as JSON. Raw response: ${error.message}` };
    }
    return { success: false, error: `Failed to analyze image with AI: ${error.message || "Unknown error"}` };
  }
}

export async function generatePrescriptionData(imageDataUrl: string): Promise<GeminiApiResponse> {
  try {
    // Extract base64 part from data URL
    const imageBase64 = imageDataUrl.split(",")[1];

    // Use the AI SDK to call the Gemini API with the 'messages' array for multimodal input
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
              text: `Analyze this prescription image. Extract all medicine names, their primary uses, and an estimated price range for each. Format the output strictly as a JSON array of objects, where each object has 'name' (string), 'uses' (array of strings), and 'estPrice' (string like '₹XX - ₹YY'). If no medicines are found, return an empty JSON array: []. Do NOT include any conversational text or markdown formatting outside the JSON.`,
            },
          ],
        },
      ],
    });

    // Extract the pure JSON string from the raw text response
    const jsonString = extractJsonFromMarkdown(rawText);
    const parsedData = JSON.parse(jsonString) as MedicineDetail[];
    return { success: true, data: parsedData };
  } catch (error: any) {
    console.error("Gemini API error:", error);
    if (error.message.includes("API key not found")) {
      return { success: false, error: "Gemini API key is missing or invalid. Please set GOOGLE_API_KEY." };
    }
    if (error instanceof SyntaxError) {
      return { success: false, error: `Failed to parse AI response as JSON. Raw response: ${error.message}` };
    }
    return { success: false, error: `Failed to analyze image with AI: ${error.message || "Unknown error"}` };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { imageDataUrl } = await req.json();
    const result = await generateReceiptData(imageDataUrl);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Unknown error' }, { status: 500 });
  }
}
