"use client";

import { Container, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ParsedRecipe } from "../types/recipe";
import InstructionList from "../components/InstructionList";
import { useRouter } from "next/navigation";

export default function InstructionListPage() {
  const [recipe, setRecipe] = useState<ParsedRecipe | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get the recipe from sessionStorage
    const storedRecipe = sessionStorage.getItem('currentRecipe');
    if (storedRecipe) {
      setRecipe(JSON.parse(storedRecipe));
    } else {
      // If no recipe is found, redirect to home
      router.push('/');
    }
  }, [router]);

  if (!recipe) {
    return null; // Or a loading state
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#FDF4ED",
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#222222",
            mb: 3,
            textAlign: "center"
          }}
        >
          Recipe Instructions
        </Typography>
        
        <InstructionList recipe={recipe} />
      </Container>
    </Box>
  );
} 