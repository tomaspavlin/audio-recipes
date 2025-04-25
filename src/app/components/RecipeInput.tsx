"use client";

import CloseIcon from "@mui/icons-material/Close";
import RestaurantIcon from "@mui/icons-material/Restaurant";
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
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ParsedRecipe, Photo, RecipeParseError } from "../types/recipe";
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
    const [recipe, setRecipe] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const router = useRouter();

    const handlePhotoAdd = async (imageData: string) => {
        if (photos.length >= 6) {
            setError("Maximum 6 photos allowed");
            return;
        }

        const newPhoto: Photo = {
            id: Date.now().toString(),
            dataUrl: imageData
        };

        setPhotos([...photos, newPhoto]);
    };

    const handlePhotoRemove = (id: string) => {
        setPhotos(photos.filter((photo) => photo.id !== id));
    };

    const handleReadText = async () => {
        if (photos.length === 0) {
            setError("No photos to read text from");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const allTexts: string[] = [];
            let processedCount = 0;

            for (const photo of photos) {
                if (!photo.text) {
                    try {
                        const response = await fetch("/api/ocr", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ image: photo.dataUrl })
                        });

                        if (!response.ok) {
                            throw new Error(
                                `Failed to process image ${processedCount + 1}`
                            );
                        }

                        const { text } = await response.json();
                        if (text && text.trim()) {
                            photo.text = text;
                            allTexts.push(text);
                        }
                    } catch (err) {
                        console.error(
                            `Error processing image ${processedCount + 1}:`,
                            err
                        );
                        // Continue with next image even if one fails
                    }
                } else {
                    allTexts.push(photo.text);
                }
                processedCount++;
            }

            // Update photos with new text
            setPhotos([...photos]);

            // Combine all texts and add to recipe field
            if (allTexts.length > 0) {
                const combinedText = allTexts.join("\n\n");
                setRecipe((prevRecipe) => {
                    if (prevRecipe) {
                        return `${prevRecipe}\n\n${combinedText}`;
                    }
                    return combinedText;
                });
            } else {
                setError("No text could be extracted from the images");
            }
        } catch (err) {
            setError("Failed to read text from images");
            console.error("Error reading text:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setParsedRecipe(null);

        try {
            const response = await fetch("/api/parse-recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ recipe, photos })
            });

            const data = await response.json();

            if (!response.ok) {
                const error = data as RecipeParseError;
                throw new Error(error.message);
            }

            setParsedRecipe(data as ParsedRecipe);
            sessionStorage.setItem("currentRecipe", JSON.stringify(data));
            router.push("/instruction-list");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to parse recipe"
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoClick = (photo: Photo) => {
        setSelectedPhoto(photo);
    };

    const handleClosePreview = () => {
        setSelectedPhoto(null);
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 4,
                width: "100%",
                maxWidth: 600,
                borderRadius: 3,
                bgcolor: "white"
            }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant='outlined'
                    label='Enter a recipe'
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                    placeholder='Paste your recipe here...'
                    sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            fontSize: "1.1rem"
                        },
                        "& .MuiInputLabel-root": {
                            fontSize: "1.1rem"
                        }
                    }}
                />

                {photos.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1
                            }}>
                            <Typography variant='subtitle1'>Photos:</Typography>
                            <Button
                                variant='outlined'
                                startIcon={<TextSnippetIcon />}
                                onClick={handleReadText}
                                disabled={loading}
                                sx={{
                                    borderColor: "#E87C4B",
                                    color: "#E87C4B",
                                    "&:hover": {
                                        borderColor: "#D76B3A",
                                        color: "#D76B3A"
                                    }
                                }}>
                                Read Text from Images
                            </Button>
                        </Box>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {photos.map((photo) => (
                                <Box
                                    key={photo.id}
                                    sx={{
                                        position: "relative",
                                        width: 100,
                                        height: 100,
                                        cursor: "pointer",
                                        "&:hover": {
                                            opacity: 0.9
                                        }
                                    }}
                                    onClick={() => handlePhotoClick(photo)}>
                                    <img
                                        src={photo.dataUrl}
                                        alt='Recipe photo'
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: 8
                                        }}
                                    />
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePhotoRemove(photo.id);
                                        }}
                                        sx={{
                                            position: "absolute",
                                            top: 4,
                                            right: 4,
                                            bgcolor: "rgba(0,0,0,0.5)",
                                            color: "white",
                                            "&:hover": {
                                                bgcolor: "rgba(0,0,0,0.7)"
                                            },
                                            width: 24,
                                            height: 24
                                        }}>
                                        <CloseIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                    {photo.text && (
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                bgcolor: "rgba(0,0,0,0.7)",
                                                color: "white",
                                                p: 0.5,
                                                fontSize: "0.7rem",
                                                borderBottomLeftRadius: 8,
                                                borderBottomRightRadius: 8
                                            }}>
                                            {photo.text}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                <Stack spacing={2} alignItems='center'>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Button
                            type='submit'
                            variant='contained'
                            size='large'
                            startIcon={
                                loading ? (
                                    <CircularProgress
                                        size={20}
                                        color='inherit'
                                    />
                                ) : (
                                    <RestaurantIcon />
                                )
                            }
                            disabled={loading || !recipe}
                            sx={{
                                bgcolor: "#E87C4B",
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                fontSize: "1.1rem",
                                "&:hover": {
                                    bgcolor: "#d86b3a"
                                }
                            }}>
                            {loading ? "Processing..." : "Start Cooking"}
                        </Button>
                        <CameraButton onPhotoAdd={handlePhotoAdd} />
                    </Box>
                    <Link
                        component='button'
                        type='button'
                        variant='body2'
                        onClick={(e) => {
                            e.preventDefault();
                            setRecipe(sampleRecipe);
                        }}
                        sx={{
                            color: "#555555",
                            textDecoration: "none",
                            "&:hover": {
                                textDecoration: "underline"
                            }
                        }}>
                        Try with sample recipe
                    </Link>
                </Stack>
            </form>

            <Dialog
                open={!!selectedPhoto}
                onClose={handleClosePreview}
                maxWidth='md'
                fullWidth>
                <DialogContent sx={{ p: 0, position: "relative" }}>
                    {selectedPhoto && (
                        <>
                            <img
                                src={selectedPhoto.dataUrl}
                                alt='Enlarged recipe photo'
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    maxHeight: "80vh",
                                    objectFit: "contain"
                                }}
                            />
                            <IconButton
                                onClick={handleClosePreview}
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    bgcolor: "rgba(0,0,0,0.5)",
                                    color: "white",
                                    "&:hover": {
                                        bgcolor: "rgba(0,0,0,0.7)"
                                    }
                                }}>
                                <CloseIcon />
                            </IconButton>
                            {selectedPhoto.text && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        bgcolor: "rgba(0,0,0,0.7)",
                                        color: "white",
                                        p: 2
                                    }}>
                                    <Typography variant='body2'>
                                        {selectedPhoto.text}
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Paper>
    );
}
