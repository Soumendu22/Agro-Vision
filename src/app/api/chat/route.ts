import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

Respond in the same language as the user's question.
Keep responses concise, practical, and focused on farming and weather-related topics.
If asked about topics unrelated to farming or weather, politely redirect to agricultural topics.`;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ message: reply });
  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Check for specific OpenAI errors
    if (error?.response?.status === 429 || error?.status === 429) {
      return NextResponse.json(
        { error: 'Please wait a moment before sending another message.' },
        { status: 429 }
      );
    }

    if (error?.response?.status === 401 || error?.status === 401) {
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