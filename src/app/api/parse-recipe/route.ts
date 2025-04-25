import { NextResponse } from 'next/server';
import { parseRecipe } from '@/app/utils/recipeParser';
import { RecipeParseError } from '@/app/types/recipe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipe } = body;

    if (!recipe || typeof recipe !== 'string') {
      const error: RecipeParseError = {
        message: 'Recipe text is required',
        code: 'INVALID_INPUT'
      };
      return NextResponse.json(error, { status: 400 });
    }

    const parsedRecipe = parseRecipe(recipe);
    
    // Validate that we have steps
    if (!parsedRecipe.steps || parsedRecipe.steps.length === 0) {
      const error: RecipeParseError = {
        message: 'Could not parse any steps from the recipe',
        code: 'PARSE_ERROR'
      };
      return NextResponse.json(error, { status: 400 });
    }

    return NextResponse.json(parsedRecipe);
  } catch (error) {
    const errorResponse: RecipeParseError = {
      message: 'Failed to parse recipe',
      code: 'PARSE_ERROR'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 