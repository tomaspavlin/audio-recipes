"use client";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
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

    const speakStep = () => {
        speakText(steps[currentStepIndex].text);
    };
    const speakText = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "cs-CZ"; // nebo 'en-US', podle potřeby
        speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        speakStep();
        return () => {
            speechSynthesis.cancel(); // Stop any ongoing speech synthesis
        };
    }, [currentStepIndex]);

    const handleNewRecipe = () => {
        router.push("/");
    };

    // Add recognized text display in the UI
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
                    sx={{
                        mb: 4,
                        bgcolor: "#E87C4B",
                        "&:hover": { bgcolor: "#d86b3a" }
                    }}>
                    🔊 Replay Step
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
