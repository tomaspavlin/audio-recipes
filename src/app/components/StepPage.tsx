"use client";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useRouter } from 'next/navigation';

export default function StepPage({ steps }: { steps: { id: number; text: string }[] }) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNewRecipe = () => {
    router.push('/'); // Navigate back to the home page to input a new recipe
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: '#FDF4ED',
        textAlign: 'center',
        px: 2,
        position: 'relative', // Ensure proper positioning for the button
      }}
    >
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Step {currentStepIndex + 1} of {steps.length}
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          {steps[currentStepIndex].text}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          sx={{ bgcolor: '#E87C4B', '&:hover': { bgcolor: '#d86b3a' } }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          sx={{ bgcolor: '#E87C4B', '&:hover': { bgcolor: '#d86b3a' } }}
        >
          Next
        </Button>
      </Box>
      <Button
        variant="outlined"
        onClick={handleNewRecipe}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          borderColor: '#E87C4B',
          color: '#E87C4B',
          '&:hover': { borderColor: '#d86b3a', color: '#d86b3a' },
        }}
      >
        Enter New Recipe
      </Button>
    </Box>
  );
}
