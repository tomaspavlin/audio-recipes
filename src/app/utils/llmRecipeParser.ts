import OpenAI from "openai";
import { ParsedRecipe, RecipeStep } from "../types/recipe";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are a recipe parser that converts recipe text into clear, step-by-step instructions optimized for text-to-speech.
Your task is to:
1. Extract the recipe title
2. Break down the recipe into clear, actionable steps
3. Make steps clear and concise for voice reading

IMPORTANT: Format the text to be speech-friendly by:
- Replace symbols with words (e.g., "350°F" becomes "350 degrees Fahrenheit")
- Replace abbreviations with full words (e.g., "tbsp" becomes "tablespoon", "tsp" becomes "teaspoon")
- Replace fractions with words (e.g., "1/2" becomes "one half", "1/4" becomes "one quarter")
- etc.

Format the output as a JSON object with:
- title: string
- steps: array of objects with:
  - id: number (starting from 1)
  - text: string (clear instruction)

Also make sure that:
- All ingredient quantities and units (e.g. “1 kilogram of potatoes”, “3 tablespoons of oil”) are clearly mentioned in the relevant steps.
- Do not drop or omit measurements that are needed for preparation.
- When using ingredients in a step, include the exact amount from the original recipe (converted to natural speech, like “one kilogram” or “two cups”).
- Keep instructions concise but complete.

Make sure each step is:
- Clear and actionable
- Suitable for voice reading
- Broken down into simple, single actions
- Uses natural language that sounds good when read aloud
- Each step should contain only one main action.
- Avoid combining preparation and processing in one step`;

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
