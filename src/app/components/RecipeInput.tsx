'use client';

import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Stack, Link } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CameraButton from './CameraButton';

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
    <Paper 
      elevation={2} 
      sx={{ 
        p: 4, 
        width: '100%',
        maxWidth: 600,
        borderRadius: 3,
        bgcolor: 'white',
      }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Enter a recipe"
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
          placeholder="Paste your recipe here..."
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '1.1rem',
            },
            '& .MuiInputLabel-root': {
              fontSize: '1.1rem',
            },
          }}
        />
        <Stack spacing={2} alignItems="center">
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<RestaurantIcon />}
              sx={{
                bgcolor: '#E87C4B',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: '#d86b3a',
                },
              }}
            >
              Start Cooking
            </Button>
            <CameraButton />
          </Box>
          <Link
            component="button"
            variant="body2"
            onClick={handleSampleRecipe}
            sx={{
              color: '#555555',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Try with sample recipe
          </Link>
        </Stack>
      </form>
    </Paper>
  );
} 