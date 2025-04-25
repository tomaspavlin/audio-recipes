import { ParsedRecipe, RecipeStep } from '../types/recipe';

interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

function extractIngredients(text: string): Ingredient[] {
  const ingredients: Ingredient[] = [];
  const lines = text.split('\n');
  let inIngredientsSection = false;

  for (const line of lines) {
    const trimmedLine = line.trim().toLowerCase();
    
    if (trimmedLine.includes('ingredients:')) {
      inIngredientsSection = true;
      continue;
    }
    
    if (inIngredientsSection && (trimmedLine.includes('instructions:') || 
        trimmedLine.includes('directions:') || 
        trimmedLine.includes('steps:'))) {
      break;
    }

    if (inIngredientsSection && line.trim()) {
      // Match patterns like "2 1/4 cups flour" or "1 cup butter"
      const match = line.trim().match(/^[-•*]?\s*([\d./]+\s*(?:cup|tablespoon|teaspoon|tbsp|tsp|oz|ounce|g|gram|ml|pound|lb)s?)\s+(.+)$/i);
      if (match) {
        ingredients.push({
          amount: match[1].trim(),
          name: match[2].trim(),
          unit: match[1].match(/(cup|tablespoon|teaspoon|tbsp|tsp|oz|ounce|g|gram|ml|pound|lb)/i)?.[0]
        });
      }
    }
  }

  return ingredients;
}

function createEquipmentSteps(): RecipeStep[] {
  return [
    {
      id: 1,
      text: "Take a large mixing bowl",
      equipment: "large mixing bowl"
    },
    {
      id: 2,
      text: "Take a measuring cup",
      equipment: "measuring cup"
    }
  ];
}

function createIngredientSteps(ingredients: Ingredient[], startId: number): RecipeStep[] {
  const steps: RecipeStep[] = [];
  let currentId = startId;

  for (const ingredient of ingredients) {
    // Step to measure the ingredient
    steps.push({
      id: currentId++,
      text: `Measure ${ingredient.amount} of ${ingredient.name}`,
      equipment: "measuring cup"
    });

    // Step to add the ingredient
    steps.push({
      id: currentId++,
      text: `Put ${ingredient.name} into the mixing bowl`,
      container: "mixing bowl"
    });
  }

  return steps;
}

function createInstructionSteps(text: string, startId: number): RecipeStep[] {
  const steps: RecipeStep[] = [];
  let currentId = startId;
  const lines = text.split('\n');
  let inInstructionsSection = false;

  for (const line of lines) {
    const trimmedLine = line.trim().toLowerCase();
    
    if (trimmedLine.includes('instructions:') || 
        trimmedLine.includes('directions:') || 
        trimmedLine.includes('steps:')) {
      inInstructionsSection = true;
      continue;
    }

    if (inInstructionsSection && line.trim()) {
      // Remove bullet points or numbers
      const cleanLine = line.trim().replace(/^[-•*\d.]\s*/, '');
      
      // Split complex instructions into simple steps
      if (cleanLine.toLowerCase().includes('mix') || 
          cleanLine.toLowerCase().includes('stir') || 
          cleanLine.toLowerCase().includes('combine')) {
        steps.push({
          id: currentId++,
          text: `Mix everything in the bowl until well combined`,
          container: "mixing bowl"
        });
      } else if (cleanLine.toLowerCase().includes('bake')) {
        steps.push({
          id: currentId++,
          text: "Take a baking sheet",
          equipment: "baking sheet"
        });
        steps.push({
          id: currentId++,
          text: "Drop rounded tablespoons of mixture onto the baking sheet",
          container: "baking sheet"
        });
        steps.push({
          id: currentId++,
          text: "Put the baking sheet in the oven",
          container: "oven"
        });
        steps.push({
          id: currentId++,
          text: cleanLine,
          container: "oven"
        });
      } else if (cleanLine.toLowerCase().includes('cool')) {
        steps.push({
          id: currentId++,
          text: "Take a wire rack",
          equipment: "wire rack"
        });
        steps.push({
          id: currentId++,
          text: "Move cookies to the wire rack",
          container: "wire rack"
        });
        steps.push({
          id: currentId++,
          text: "Let cookies cool on the wire rack",
          container: "wire rack"
        });
      } else {
        steps.push({
          id: currentId++,
          text: cleanLine
        });
      }
    }
  }

  return steps;
}

export function parseRecipe(rawText: string): ParsedRecipe {
  const lines = rawText.split('\n');
  const title = lines[0].trim();
  
  // Extract ingredients
  const ingredients = extractIngredients(rawText);
  
  // Create all steps
  const equipmentSteps = createEquipmentSteps();
  const ingredientSteps = createIngredientSteps(ingredients, equipmentSteps.length + 1);
  const instructionSteps = createInstructionSteps(rawText, equipmentSteps.length + ingredientSteps.length + 1);
  
  // Combine all steps
  const steps = [...equipmentSteps, ...ingredientSteps, ...instructionSteps];

  return {
    title,
    steps,
    rawText
  };
}

export function validateRecipe(text: string): boolean {
  return text.trim().length > 0;
} 