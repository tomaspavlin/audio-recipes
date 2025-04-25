"use client";

import { Box, Button } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { communityRecipes } from '../data/communityRecipes';

export default function RecipeSuggestions() {
  const handleRecipeClick = (recipe: string) => {
    // Find the TextField input element
    const textField = document.querySelector('.MuiFilledInput-input') as HTMLTextAreaElement;
    if (textField) {
      // Create and dispatch an input event with the recipe text
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(textField, recipe);
        textField.dispatchEvent(new Event('input', { bubbles: true }));
        textField.focus();
      }
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 1.5, 
      justifyContent: 'center',
      flexWrap: 'wrap',
      mt: 0.5,
      mb: 3
    }}>
      {communityRecipes.slice(0, 3).map((recipe) => (
        <Button
          key={recipe.title}
          variant="outlined"
          size="small"
          startIcon={<RestaurantIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => handleRecipeClick(recipe.recipe)}
          sx={{
            borderRadius: 1.5,
            px: 1.5,
            py: 0.5,
            fontSize: '0.85rem',
            borderColor: 'rgba(232, 124, 75, 0.2)',
            color: '#E87C4B',
            bgcolor: 'white',
            '&:hover': {
              borderColor: '#E87C4B',
              bgcolor: 'white',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {recipe.title === "Classic Chocolate Chip Cookies" 
            ? "Cookies" 
            : recipe.title === "Simple Pasta Carbonara"
                ? "Pasta Carbonara"
                : recipe.title.split(' ').slice(0, 2).join(' ')}
        </Button>
      ))}
    </Box>
  );
} 