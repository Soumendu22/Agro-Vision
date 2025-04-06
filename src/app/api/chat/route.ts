import { NextResponse } from 'next/server';

// Add this at the top of the file after imports
interface APIError extends Error {
  response?: {
    status: number;
  };
  status?: number;
}

// Keep track of last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

const SYSTEM_PROMPT = `You are a multilingual expert agricultural and weather advisor. Your role is to:
1. Provide specific, practical farming advice
2. Explain weather patterns and their impact on crops
3. Suggest best practices for crop management
4. Answer questions about soil health and irrigation
5. Provide pest control and disease management advice
6. Give sustainable farming recommendations

Format your responses following these rules:
- For Hindi responses:
  • Use proper punctuation (।) instead of (.)
  • Start each new point on a new line
  • Use numbers (1, 2, 3) for sequential steps
  • Use bullet points (•) for lists
  • Add clear line breaks between sections
  • Never use asterisks (*) or other special characters for formatting

- For English responses:
  • Use proper punctuation
  • Start each new point on a new line
  • Use numbers (1, 2, 3) for sequential steps
  • Use bullet points (•) for lists
  • Add clear line breaks between sections
  • Never use asterisks (*) or other special characters for formatting

Respond in the same language as the user's question.
Keep responses concise, practical, and focused on farming and weather-related topics.
If asked about topics unrelated to farming or weather, politely redirect to agricultural topics.
Dont add any other text or comments to the response.
`;

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'Gemini API key not configured' },
      { status: 500 }
    );
  }

  // Check if enough time has passed since last request
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    return NextResponse.json(
      { error: 'Please wait a moment before sending another message.' },
      { status: 429 }
    );
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      );
    }

    // Update last request time
    lastRequestTime = now;

    // Prepare the request for Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [
              { text: SYSTEM_PROMPT + "\n\nUser message: " + message }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topK: 40,
            topP: 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    let reply = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      throw new Error('No response from Gemini');
    }

    // Clean up the response
    reply = reply
      .replace(/\*\*/g, '') // Remove double asterisks
      .replace(/\*/g, '') // Remove single asterisks
      .replace(/\.(?=\S)/g, '। ') // Add space after Hindi punctuation
      .replace(/([।.!?])(?=\S)/g, '$1 ') // Add space after punctuation
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
      .replace(/(\d+\.)\s*/g, '\n$1 ') // Add line break before numbered points
      .replace(/•\s*/g, '\n• ') // Add line break before bullet points
      .replace(/\n{3,}/g, '\n\n') // Clean up multiple line breaks
      .replace(/^\n+/, '') // Remove leading line breaks
      .trim();

    // Format sections with proper spacing
    reply = reply
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line) // Remove empty lines
      .join('\n')
      .replace(/(\d+\..*?)(?=\n\d+\.|$)/g, '$1\n') // Add line break between numbered sections
      .trim();

    return NextResponse.json({ message: reply });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    
    // Type guard for API error
    const apiError = error as APIError;
    
    // Check for specific errors
    if (apiError?.response?.status === 429 || apiError?.status === 429) {
      return NextResponse.json(
        { error: 'Please wait a moment before sending another message.' },
        { status: 429 }
      );
    }

    if (apiError?.response?.status === 401 || apiError?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your configuration.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get response from AI. Please try again.' },
      { status: 500 }
    );
  }
} 