import { NextResponse } from 'next/server';
import { parseRecipeWithLLM } from '@/app/utils/llmRecipeParser';
import { RecipeParseError } from '@/app/types/recipe';

interface ParseRecipeRequest {
    recipe: string;
    photos?: {
        id: string;
        dataUrl: string;
        text?: string;
    }[];
}

export async function POST(request: Request) {
    try {
        const { recipe, photos } = await request.json() as ParseRecipeRequest;

        if (!recipe) {
            return NextResponse.json(
                { error: 'Recipe text is required' },
                { status: 400 }
            );
        }

        // Combine recipe text with photo text if available
        let fullRecipe = recipe;
        if (photos && photos.length > 0) {
            const photoTexts = photos
                .filter(photo => photo.text)
                .map(photo => `Text from photo: ${photo.text}`)
                .join('\n');
            if (photoTexts) {
                fullRecipe = `${recipe}\n\n${photoTexts}`;
            }
        }

        const parsedRecipe = await parseRecipeWithLLM(fullRecipe);
        
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
        console.error('Error parsing recipe:', error);
        const errorResponse: RecipeParseError = {
            message: 'Failed to parse recipe',
            code: 'PARSE_ERROR'
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
} 