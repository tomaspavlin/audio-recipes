export interface RecipeStep {
    id: number;
    text: string;
    equipment?: string;
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

export interface Photo {
    id: string;
    dataUrl: string;
    text?: string;
}
