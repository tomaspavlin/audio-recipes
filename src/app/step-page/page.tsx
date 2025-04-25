"use client";
import StepPage from "../components/StepPage";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ParsedRecipe } from "../types/recipe";

export default function StepPageRoute() {
    const [recipe, setRecipe] = useState<ParsedRecipe | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        // Get the recipe from sessionStorage
        const storedRecipe = sessionStorage.getItem('currentRecipe');
        if (storedRecipe) {
            setRecipe(JSON.parse(storedRecipe));
        }
    }, []);

    if (!recipe) {
        return null; // Or a loading state
    }

    return <StepPage steps={recipe.steps} />;
}
