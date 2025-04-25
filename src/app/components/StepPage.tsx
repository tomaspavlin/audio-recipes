"use client";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import SpeechRecognition, {
    useSpeechRecognition
} from "react-speech-recognition";

export default function StepPage({
    steps
}: {
    steps: { id: number; text: string }[];
}) {
    const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
    const router = useRouter();
    const recognitionRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
=======
>>>>>>> 513b6a8a8560970f6ea1f29d38eb05424386fabd

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({});

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            SpeechRecognition.startListening({
                continuous: true
            });
        }
    };

    const handleNext = () => {
        setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrevious = () => {
        setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNewResult = (result: string) => {
        const nextKeywords = ["next", "continue", "další"];
        const previousKeywords = ["previous", "back", "zpátky"];

        if (nextKeywords.some((keyword) => result.includes(keyword))) {
            resetTranscript(); // Clear text
            handleNext();
        } else if (
            previousKeywords.some((keyword) => result.includes(keyword))
        ) {
            resetTranscript(); // Clear text
            handlePrevious();
        }
    };

    useEffect(() => {
        if (transcript) handleNewResult(transcript.toLowerCase().trim());
    }, [transcript, handleNewResult]);

    const speakStep = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/text-to-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: steps[currentStepIndex].text }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate speech');
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
            } else {
                const audio = new Audio(audioUrl);
                audio.onended = () => {
                    setIsPlaying(false);
                    URL.revokeObjectURL(audioUrl);
                };
                audio.play();
                audioRef.current = audio;
            }
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        speakStep();
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, [currentStepIndex]);

    const handleNewRecipe = () => {
        router.push("/");
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                bgcolor: "#FDF4ED",
                textAlign: "center",
                px: 2,
                position: "relative"
            }}>
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                <Typography variant='h4' sx={{ mb: 2 }}>
                    Step {currentStepIndex + 1} of {steps.length}
                </Typography>
                <Typography variant='h5' sx={{ mb: 4 }}>
                    {steps[currentStepIndex].text}
                </Typography>
                <Button
                    variant='contained'
                    onClick={speakStep}
                    disabled={isLoading}
                    sx={{
                        mb: 4,
                        bgcolor: "#E87C4B",
                        "&:hover": { bgcolor: "#d86b3a" }
                    }}>
                    {isLoading ? (
                        <>
                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                            Loading...
                        </>
                    ) : (
                        "🔊 Replay Step"
                    )}
                </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Button
                    variant='contained'
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    sx={{
                        bgcolor: "#E87C4B",
                        "&:hover": { bgcolor: "#d86b3a" }
                    }}>
                    Previous
                </Button>
                <Button
                    variant='contained'
                    onClick={handleNext}
                    disabled={currentStepIndex === steps.length - 1}
                    sx={{
                        bgcolor: "#E87C4B",
                        "&:hover": { bgcolor: "#d86b3a" }
                    }}>
                    Next
                </Button>
            </Box>
            <Button
                variant='outlined'
                onClick={handleNewRecipe}
                sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    borderColor: "#E87C4B",
                    color: "#E87C4B",
                    "&:hover": { borderColor: "#d86b3a", color: "#d86b3a" }
                }}>
                Enter New Recipe
            </Button>
            <Button
                variant='contained'
                onClick={toggleListening}
                disabled={!browserSupportsSpeechRecognition}
                sx={{
                    mb: 4,
                    bgcolor: listening ? "#4CAF50" : "#E87C4B",
                    "&:hover": { bgcolor: listening ? "#45A049" : "#d86b3a" },
                    position: "relative"
                }}>
                {listening ? "🎙️ Stop Listening" : "🎙️ Start Listening"}
                {listening && (
                    <Typography
                        variant='caption'
                        sx={{
                            position: "absolute",
                            bottom: -20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "0.75rem",
                            color: "#fff",
                            textAlign: "center"
                        }}>
                        {transcript || "Listening..."}
                    </Typography>
                )}
            </Button>
        </Box>
    );
}
