import React, { useState } from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function RecipeInput() {
  const [recipe, setRecipe] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle recipe submission
    console.log('Recipe submitted:', recipe);
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
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<RestaurantIcon />}
          >
            Start Cooking
          </Button>
        </Box>
      </form>
    </Paper>
  );
} 