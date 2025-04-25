"use client";
import { useEffect, useState } from "react";
import StepPage from "../components/StepPage";
import { ParsedRecipe } from "../types/recipe";

export default function StepPageRoute() {
    const [recipe, setRecipe] = useState<ParsedRecipe | null>(null);

    useEffect(() => {
        // Get the recipe from sessionStorage
        const storedRecipe = sessionStorage.getItem("currentRecipe");
        if (storedRecipe) {
            setRecipe(JSON.parse(storedRecipe));
        }
    }, []);

    if (!recipe) {
        return null; // Or a loading state
    }

    return <StepPage steps={recipe.steps} recipeName={recipe.title} />;
}
