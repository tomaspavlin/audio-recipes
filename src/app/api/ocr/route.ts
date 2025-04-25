import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { image } = await request.json();
        
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Extract all text from this image. If it's a recipe, focus on ingredients and instructions. Return only the text, no additional formatting or explanations."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: image
                            }
                        }
                    ]
                }
            ],
            max_tokens: 1000
        });

        const text = response.choices[0].message.content;
        console.log(text);
        return NextResponse.json({ text });
    } catch (error) {
        console.error('OCR Error:', error);
        return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }
        );
    }
} 