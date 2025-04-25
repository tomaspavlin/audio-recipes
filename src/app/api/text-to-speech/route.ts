import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

// Available voices from OpenAI TTS
const AVAILABLE_VOICES = [
  { id: 'alloy', name: 'Alloy' },
  { id: 'echo', name: 'Echo' },
  { id: 'fable', name: 'Fable' },
  { id: 'onyx', name: 'Onyx' },
  { id: 'nova', name: 'Nova' },
  { id: 'shimmer', name: 'Shimmer' }
] as const;

export async function GET() {
  return NextResponse.json({ voices: AVAILABLE_VOICES });
}

export async function POST(request: Request) {
  try {
    const { text, voice = 'alloy', speed = 1.0 } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!AVAILABLE_VOICES.some(v => v.id === voice)) {
      return NextResponse.json(
        { error: 'Invalid voice selected' },
        { status: 400 }
      );
    }

    // Validate speed is within OpenAI's supported range (0.25 to 4.0)
    const validatedSpeed = Math.max(0.25, Math.min(4.0, speed));

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as OpenAIVoice,
      input: text,
      response_format: "mp3",
      speed: validatedSpeed,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    console.error('Error in text-to-speech:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate speech' },
      { status: 500 }
    );
  }
} 