"use client";

import { Box, Typography, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';
import { communityRecipes, CommunityRecipe } from '../data/communityRecipes';

export default function CommunityRecipes() {
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = useState<CommunityRecipe | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleRecipeClick = (recipe: CommunityRecipe) => {
    setSelectedRecipe(recipe);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecipe(null);
  };

  const handleStartCooking = () => {
    if (selectedRecipe) {
      // Store the recipe in sessionStorage
      sessionStorage.setItem('currentRecipe', JSON.stringify({
        title: selectedRecipe.title,
        steps: selectedRecipe.recipe.split('\n\n').filter(line => line.trim().startsWith('Instructions:')).flatMap(section => 
          section.split('\n')
            .filter(line => line.match(/^\d+\./))
            .map((line, index) => ({
              id: index + 1,
              text: line.replace(/^\d+\.\s*/, '')
            }))
        ),
        rawText: selectedRecipe.recipe
      }));
      // Navigate to instruction list
      router.push('/instruction-list');
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: '#222222',
          mb: 3,
          textAlign: 'center'
        }}
      >
        Community Recipes
      </Typography>
      <Grid container spacing={3}>
        {communityRecipes.map((recipe, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <RecipeCard
              title={recipe.title}
              description={recipe.description}
              image={recipe.image}
              onClick={() => handleRecipeClick(recipe)}
            />
          </Grid>
        ))}
      </Grid>

      <RecipeModal
        open={openDialog}
        onClose={handleCloseDialog}
        onStartCooking={handleStartCooking}
        recipe={selectedRecipe}
      />
    </Box>
  );
} 