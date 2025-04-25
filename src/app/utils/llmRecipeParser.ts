import OpenAI from "openai";
import { ParsedRecipe, RecipeStep } from "../types/recipe";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are a recipe parser that converts recipe text into clear, step-by-step instructions.
Your task is to:
1. Extract the recipe title
2. Break down the recipe into clear, actionable steps
3. Make steps clear and concise for voice reading

Format the output as a JSON object with:
- title: string
- steps: array of objects with:
  - id: number (starting from 1)
  - text: string (clear instruction)

Make sure each step is:
- Clear and actionable
- Suitable for voice reading
- Broken down into simple, single actions`;

export async function parseRecipeWithLLM(
    rawText: string
): Promise<ParsedRecipe> {
    try {
        // Log the prompt
        console.log("=== OpenAI API Call ===");
        console.log("System Prompt:", SYSTEM_PROMPT);
        console.log("User Input:", rawText);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: rawText }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3 // Lower temperature for more consistent output
        });

        // Log the response
        console.log("=== OpenAI API Response ===");
        console.log("Response:", completion.choices[0].message.content);
        console.log("=== End of API Call ===");

        const result = JSON.parse(
            completion.choices[0].message.content || "{}"
        );

        // Validate the response
        if (!result.title || !Array.isArray(result.steps)) {
            throw new Error("Invalid response format from LLM");
        }

        // Ensure each step has an id
        const steps = result.steps.map((step: RecipeStep, index: number) => ({
            ...step,
            id: index + 1
        }));

        return {
            title: result.title,
            steps,
            rawText
        };
    } catch (error) {
        console.error("Error parsing recipe with LLM:", error);
        throw error;
    }
}
