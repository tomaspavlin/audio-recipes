import { NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

export async function POST(request: Request) {
    try {
        const { image } = await request.json();
        
        // Remove the data URL prefix
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        
        // Perform OCR using Tesseract.js
        const { data: { text } } = await Tesseract.recognize(
            `data:image/jpeg;base64,${base64Data}`,
            'eng',
            {
                logger: m => console.log(m)
            }
        );
        
        return NextResponse.json({ text });
    } catch (error) {
        console.error('OCR Error:', error);
        return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }
        );
    }
} 