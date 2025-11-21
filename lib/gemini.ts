import { GoogleGenAI } from '@google/genai';

function getGeminiClient() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables. Please add it to your .env.local file.');
  }
  
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

export interface MenuItem {
  name: string;
  price: number;
  category?: 'drink' | 'food';
}

/**
 * Analyze a restaurant menu image and extract food items with prices
 * @param imageBase64 - Base64 encoded image string
 * @param mimeType - MIME type of the image (e.g., 'image/jpeg', 'image/png')
 * @returns Array of menu items with name and price
 */
export async function analyzeMenuImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<MenuItem[]> {
  try {
    const ai = getGeminiClient();
    
    const prompt = `Extract all food items and their prices from this restaurant menu image. 
For prices, extract only the numeric value (e.g., if price is '100 Birr' or 'ETB 100', extract 100).
Ignore any items that don't have prices.

For each item, classify it into one of these categories:
- "drink": Beverages, juices, coffee, tea, soft drinks, etc.
- "food": All food items (meals, dishes, snacks, etc.)

Return all menu items found in the image.`;

    const menuItemSchema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Food item name',
          },
          price: {
            type: 'number',
            description: 'Price as numeric value (e.g., 100 for 100 Birr)',
          },
          category: {
            type: 'string',
            enum: ['drink', 'food'],
            description: 'Category: "drink" for beverages, "food" for all food items',
          },
        },
        required: ['name', 'price', 'category'],
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        {
          inlineData: {
            mimeType,
            data: imageBase64,
          },
        },
        { text: prompt },
      ],
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: menuItemSchema,
      },
    });

    // Parse the JSON response
    // The response structure might vary, so we need to check different possible formats
    let text: string;
    if (typeof response.text === 'string') {
      text = response.text;
    } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = response.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected Gemini API response structure:', JSON.stringify(response, null, 2));
      throw new Error('No response text found in Gemini API response');
    }
    
    if (!text) {
      console.error('Gemini API response:', response);
      throw new Error('No response from Gemini API');
    }
    
    let menuItems: MenuItem[];
    try {
      menuItems = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response. Raw text:', text);
      throw new Error('Invalid response format from Gemini API');
    }

    // Validate and filter results
    return menuItems.filter(
      (item) =>
        item.name &&
        typeof item.name === 'string' &&
        typeof item.price === 'number' &&
        item.price > 0 &&
        (item.category === 'drink' || item.category === 'food')
    ).map((item) => ({
      ...item,
      category: item.category || 'food', // Default to 'food' if not provided
    }));
  } catch (error: any) {
    console.error('Error analyzing menu image:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('GEMINI_API_KEY')) {
      throw new Error('Gemini API key is not configured. Please contact support.');
    }
    if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your configuration.');
    }
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    
    throw new Error(error.message || 'Failed to analyze menu image. Please try again.');
  }
}

