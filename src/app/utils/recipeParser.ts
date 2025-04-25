export interface RecipeStep {
  id: number;
  text: string;
}

export function parseRecipe(text: string): RecipeStep[] {
  // Split text into lines and filter out empty lines
  const lines = text
    .split(/\n+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Convert lines into recipe steps
  return lines.map((line, index) => ({
    id: index + 1,
    text: line
  }));
}

export function validateRecipe(text: string): boolean {
  return text.trim().length > 0;
} 