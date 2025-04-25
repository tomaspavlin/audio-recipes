"use client";

import { Box, Button, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { ParsedRecipe } from "../types/recipe";
import RestaurantIcon from "@mui/icons-material/Restaurant";

export default function InstructionList({ recipe }: { recipe: ParsedRecipe }) {
  const router = useRouter();

  const handleStartCooking = () => {
    // Store the recipe in sessionStorage if not already there
    sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
    // Navigate to the step page
    router.push("/step-page");
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        width: "100%",
        maxWidth: 800,
        borderRadius: 3,
        bgcolor: "white"
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        {recipe.title}
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Instructions ({recipe.steps.length} steps)
      </Typography>
      
      <List sx={{ mb: 4 }}>
        {recipe.steps.map((step) => (
          <ListItem key={step.id} sx={{ py: 1 }}>
            <ListItemText
              primary={
                <Typography variant="body1">
                  <strong>Step {step.id}:</strong> {step.text}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<RestaurantIcon />}
          onClick={handleStartCooking}
          sx={{
            bgcolor: "#E87C4B",
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            "&:hover": {
              bgcolor: "#d86b3a"
            }
          }}
        >
          Start Cooking
        </Button>
      </Box>
    </Paper>
  );
} 