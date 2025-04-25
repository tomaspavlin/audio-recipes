import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that parses recipes into structured format. Extract ingredients and steps from the recipe text. For ingredients, include quantity, unit, and name. For steps, include the step number and description."
                },
                {
                    role: "user",
                    content: fullRecipe
                }
            ],
            model: "gpt-4-turbo-preview",
        });

        const parsedRecipe = JSON.parse(completion.choices[0].message.content || '{}');

        return NextResponse.json(parsedRecipe);
    } catch (error) {
        console.error('Error parsing recipe:', error);
        return NextResponse.json(
            { error: 'Failed to parse recipe' },
            { status: 500 }
        );
    }
} 