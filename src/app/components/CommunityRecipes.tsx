"use client";

import { Box, Card, CardActionArea, Typography, Grid, Dialog, DialogContent, DialogTitle, DialogActions, Button, IconButton, CardMedia } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const communityRecipes = [
  {
    title: "Classic Chocolate Chip Cookies",
    description: "A timeless favorite with crispy edges and chewy centers.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=450&q=80",
    recipe: `Classic Chocolate Chip Cookies

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
8. Cool on wire rack`
  },
  {
    title: "Simple Pasta Carbonara",
    description: "A creamy Italian classic with pancetta and parmesan.",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=450&q=80",
    recipe: `Simple Pasta Carbonara

Ingredients:
- 1 pound spaghetti
- 4 large eggs
- 1 cup grated parmesan cheese
- 4 ounces pancetta, diced
- 2 cloves garlic, minced
- Salt and black pepper to taste
- 1/4 cup chopped fresh parsley

Instructions:
1. Cook pasta according to package instructions
2. While pasta cooks, whisk eggs and cheese in a bowl
3. Cook pancetta until crispy, add garlic
4. Drain pasta, reserving some water
5. Mix hot pasta with egg mixture
6. Add pancetta and garlic
7. Season with salt and pepper
8. Garnish with parsley`
  },
  {
    title: "Easy Vegetable Stir Fry",
    description: "A quick and healthy Asian-inspired dish.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=450&q=80",
    recipe: `Easy Vegetable Stir Fry

Ingredients:
- 2 cups mixed vegetables (broccoli, carrots, bell peppers)
- 2 tbsp soy sauce
- 1 tbsp sesame oil
- 1 clove garlic, minced
- 1 inch ginger, minced
- 1 tbsp cornstarch
- 2 tbsp water
- Cooked rice for serving

Instructions:
1. Mix soy sauce, sesame oil, garlic, and ginger
2. Heat oil in a large wok or pan
3. Add vegetables and stir-fry for 3-4 minutes
4. Mix cornstarch with water
5. Add sauce mixture to vegetables
6. Cook until sauce thickens
7. Serve over rice`
  }
];

export default function CommunityRecipes() {
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = useState<{title: string, recipe: string, image: string} | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleRecipeClick = (recipe: {title: string, recipe: string, image: string}) => {
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
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
                border: '1px solid',
                borderColor: 'rgba(232, 124, 75, 0.1)',
                background: `
                  linear-gradient(white, white) padding-box,
                  linear-gradient(to bottom right, rgba(232, 124, 75, 0.2), rgba(232, 124, 75, 0.05)) border-box
                `,
                overflow: 'hidden',
              }}
            >
              <CardActionArea
                onClick={() => handleRecipeClick(recipe)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={recipe.image}
                  alt={recipe.title}
                  sx={{
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ p: 2, width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <RestaurantIcon sx={{ color: '#E87C4B' }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: '#222222',
                      }}
                    >
                      {recipe.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666666',
                      flex: 1,
                    }}
                  >
                    {recipe.description}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recipe Modal */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: '#FDF4ED',
          borderBottom: '1px solid',
          borderColor: 'rgba(232, 124, 75, 0.1)',
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#222222' }}>
            {selectedRecipe?.title}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedRecipe?.image && (
            <Box sx={{ width: '100%', height: 200, overflow: 'hidden' }}>
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="body1"
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                mb: 2,
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              {selectedRecipe?.recipe}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#FDF4ED', borderTop: '1px solid', borderColor: 'rgba(232, 124, 75, 0.1)' }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleStartCooking} 
            variant="contained"
            sx={{
              bgcolor: '#E87C4B',
              '&:hover': {
                bgcolor: '#d86b3a',
              },
            }}
          >
            Start Cooking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 