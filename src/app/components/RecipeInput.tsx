"use client";

import CloseIcon from "@mui/icons-material/Close";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CookieIcon from '@mui/icons-material/Cookie';
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
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
    Typography,
    Collapse
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

    const handlePhotoRemove = (id: string) => {
        setPhotos(photos.filter(photo => photo.id !== id));
    };

    const handleReadText = async () => {
        if (photos.length === 0) return;

        setIsLoading(true);
        try {
            const allTexts: string[] = [];

            for (const photo of photos) {
                try {
                    const response = await fetch("/api/ocr", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ image: photo.dataUrl })
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to process image`);
                    }

                    const { text } = await response.json();
                    if (text && text.trim()) {
                        allTexts.push(text);
                    }
                } catch (err) {
                    console.error('Error processing image:', err);
                }
            }

            if (allTexts.length > 0) {
                const combinedText = allTexts.join("\n\n");
                setRecipeText((prevRecipe) => {
                    if (prevRecipe) {
                        return `${prevRecipe}\n\n${combinedText}`;
                    }
                    return combinedText;
                });
            }
        } catch (err) {
            console.error("Error reading text:", err);
        } finally {
            setIsLoading(false);
        }
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
            router.push("/instruction-list");
        } catch (error) {
            console.error("Error parsing recipe:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
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

                {/* Photos Section */}
                <Collapse in={photos.length > 0}>
                    <Box
                        sx={{
                            px: 3,
                            py: 2,
                            borderTop: '1px solid',
                            borderColor: 'grey.100',
                        }}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                        }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {photos.length} {photos.length === 1 ? 'photo' : 'photos'} added
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<TextSnippetIcon />}
                                onClick={handleReadText}
                                disabled={isLoading}
                                sx={{
                                    borderColor: '#E87C4B',
                                    color: '#E87C4B',
                                    '&:hover': {
                                        borderColor: '#d86b3a',
                                        bgcolor: 'rgba(232,124,75,0.04)',
                                    },
                                }}
                            >
                                Read text from images
                            </Button>
                        </Box>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 1.5,
                            flexWrap: 'wrap'
                        }}>
                            {photos.map((photo) => (
                                <Box
                                    key={photo.id}
                                    sx={{
                                        position: 'relative',
                                        width: 80,
                                        height: 80,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        },
                                    }}
                                >
                                    <img
                                        src={photo.dataUrl}
                                        alt="Recipe"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => handlePhotoRemove(photo.id)}
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            padding: '4px',
                                            '&:hover': {
                                                bgcolor: 'rgba(0,0,0,0.7)',
                                            },
                                        }}
                                    >
                                        <CloseIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Collapse>

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
            </Paper>

            {/* Sample Recipe Link */}
            <Box
                onClick={() => setShowSampleDialog(true)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    color: '#666',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        color: '#E87C4B',
                        transform: 'translateY(-1px)',
                    },
                }}
            >
                <CookieIcon sx={{ fontSize: 20 }} />
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 500,
                        textDecoration: 'none',
                        '&:hover': {
                            textDecoration: 'none',
                        },
                    }}
                >
                    Not sure what to cook? Try our chocolate chip cookies recipe!
                </Typography>
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
        </Box>
    );
}
