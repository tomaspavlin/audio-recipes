export interface RecipeStep {
  id: number;
  text: string;
  equipment?: string;  // Optional equipment needed for this step
  container?: string;  // Optional container where the action happens
}

export interface ParsedRecipe {
  title: string;
  steps: RecipeStep[];
  rawText: string;
}

export interface RecipeParseError {
  message: string;
  code: string;
} 