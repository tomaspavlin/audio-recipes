'use client';

import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Stack } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const sampleRecipe = `Classic Chocolate Chip Cookies

Ingredients:
- 2 1/4 cups all-purpose flour
- 1 cup butter, softened
- 3/4 cup sugar
- 3/4 cup brown sugar
- 2 eggs
- 1 tsp vanilla extract
- 1 tsp baking soda
- 1/2 tsp salt
- 2 cups chocolate chips

Instructions:
1. Preheat oven to 375°F (190°C)
2. Cream together butter and sugars until fluffy
3. Beat in eggs and vanilla
4. Mix in dry ingredients
5. Stir in chocolate chips
6. Drop rounded tablespoons onto baking sheets
7. Bake for 9 to 11 minutes
8. Cool on wire rack`;

export default function RecipeInput() {
  const [recipe, setRecipe] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle recipe submission
    console.log('Recipe submitted:', recipe);
  };

  const handleSampleRecipe = () => {
    setRecipe(sampleRecipe);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, my: 4 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Paste your recipe here"
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
          placeholder="Enter your recipe steps..."
          sx={{ mb: 2 }}
        />
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<RestaurantIcon />}
          >
            Start Cooking
          </Button>
          <Button
            type="button"
            variant="outlined"
            size="large"
            startIcon={<ContentCopyIcon />}
            onClick={handleSampleRecipe}
          >
            Try Sample Recipe
          </Button>
        </Stack>
      </form>
    </Paper>
  );
} 