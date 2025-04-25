"use client";

import CloseIcon from "@mui/icons-material/Close";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    IconButton,
    Link,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ParsedRecipe, Photo } from "../types/recipe";
import CameraButton from "./CameraButton";

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
    const [recipeText, setRecipeText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSampleDialog, setShowSampleDialog] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const router = useRouter();

    const handlePhotoAdd = (imageData: string) => {
        const newPhoto: Photo = {
            id: Date.now().toString(),
            dataUrl: imageData
        };
        setPhotos([...photos, newPhoto]);
    };

    const handleSubmit = async () => {
        if (!recipeText.trim()) return;
        
        setIsLoading(true);
        try {
            const response = await fetch("/api/parse-recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ recipe: recipeText, photos })
            });

            if (!response.ok) {
                throw new Error("Failed to parse recipe");
            }

            const data = await response.json();
            sessionStorage.setItem("currentRecipe", JSON.stringify(data));
            router.push("/step-page");
        } catch (error) {
            console.error("Error parsing recipe:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                bgcolor: 'white',
                transition: 'all 0.2s ease-in-out',
                border: '1px solid',
                borderColor: 'rgba(232, 124, 75, 0.1)',
                background: `
                    linear-gradient(white, white) padding-box,
                    linear-gradient(to bottom right, rgba(232, 124, 75, 0.2), rgba(232, 124, 75, 0.05)) border-box
                `,
                boxShadow: `
                    0 1px 2px rgba(0,0,0,0.02),
                    0 4px 16px rgba(0,0,0,0.02),
                    0 4px 24px rgba(232,124,75,0.04)
                `,
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `
                        0 1px 2px rgba(0,0,0,0.02),
                        0 4px 16px rgba(0,0,0,0.04),
                        0 8px 32px rgba(232,124,75,0.08)
                    `,
                    borderColor: 'rgba(232, 124, 75, 0.2)',
                },
            }}
        >
            {/* Main Text Input */}
            <TextField
                multiline
                rows={8}
                value={recipeText}
                onChange={(e) => setRecipeText(e.target.value)}
                placeholder="Paste your recipe here..."
                fullWidth
                variant="filled"
                sx={{
                    '& .MuiFilledInput-root': {
                        bgcolor: 'transparent',
                        '&:hover, &.Mui-focused': {
                            bgcolor: 'transparent',
                        },
                        '&:before, &:after': {
                            display: 'none',
                        },
                    },
                    '& .MuiFilledInput-input': {
                        px: 3,
                        py: 3,
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                    },
                }}
            />

            {/* Action Buttons Container */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'grey.100',
                }}
            >
                {/* Left Side - Camera Button */}
                <CameraButton onPhotoAdd={handlePhotoAdd} />

                {/* Right Side - Actions */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => setShowSampleDialog(true)}
                        sx={{
                            color: '#666',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        Try with sample recipe
                    </Link>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!recipeText.trim() || isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <RestaurantIcon />}
                        sx={{
                            bgcolor: '#E87C4B',
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontSize: '1rem',
                            textTransform: 'none',
                            minWidth: '140px',
                            boxShadow: '0 2px 8px rgba(232,124,75,0.3)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                bgcolor: '#d86b3a',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(232,124,75,0.4)',
                            },
                        }}
                    >
                        {isLoading ? 'Processing...' : 'Start Cooking'}
                    </Button>
                </Box>
            </Box>

            {/* Sample Recipe Dialog */}
            <Dialog
                open={showSampleDialog}
                onClose={() => setShowSampleDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Sample Recipe</Typography>
                        <IconButton
                            onClick={() => setShowSampleDialog(false)}
                            size="small"
                            sx={{ color: 'grey.500' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography
                        variant="body1"
                        component="pre"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'inherit',
                            mb: 2,
                        }}
                    >
                        {sampleRecipe}
                    </Typography>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            setRecipeText(sampleRecipe);
                            setShowSampleDialog(false);
                        }}
                        sx={{
                            bgcolor: '#E87C4B',
                            '&:hover': {
                                bgcolor: '#d86b3a',
                            },
                        }}
                    >
                        Use this recipe
                    </Button>
                </DialogContent>
            </Dialog>
        </Paper>
    );
}
