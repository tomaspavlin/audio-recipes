import { NextResponse } from 'next/server';
import { parseRecipe, validateRecipe } from '@/app/utils/recipeParser';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!validateRecipe(text)) {
      return NextResponse.json(
        { error: 'Invalid recipe text' },
        { status: 400 }
      );
    }

    const steps = parseRecipe(text);
    return NextResponse.json({ steps });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to parse recipe' },
      { status: 500 }
    );
  }
} 