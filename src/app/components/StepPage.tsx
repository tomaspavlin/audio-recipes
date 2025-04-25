"use client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from "@mui/icons-material/Home";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SpeedIcon from "@mui/icons-material/Speed";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slider,
    Typography
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
    useSpeechRecognition
} from "react-speech-recognition";

interface Voice {
    id: string;
    name: string;
}

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
    const [voices, setVoices] = React.useState<Voice[]>([]);
    const [selectedVoice, setSelectedVoice] = React.useState("alloy");
    const [speechSpeed, setSpeechSpeed] = React.useState(1.0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(true);

    // Fetch available voices
    useEffect(() => {
        const fetchVoices = async () => {
            try {
                const response = await fetch("/api/text-to-speech");
                if (response.ok) {
                    const data = await response.json();
                    setVoices(data.voices);
                }
            } catch (error) {
                console.error("Error fetching voices:", error);
            }
        };
        fetchVoices();
    }, []);

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
            const response = await fetch("/api/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: steps[currentStepIndex].text,
                    voice: selectedVoice,
                    speed: speechSpeed
                })
            });

            if (!response.ok) {
                throw new Error("Failed to generate speech");
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
            console.error("Error playing audio:", error);
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
                audioRef.current.src = "";
            }
        };
    }, [currentStepIndex, selectedVoice, speechSpeed]);

    const handleNewRecipe = () => {
        router.push("/");
    };

    const handleSpeedChange = (_event: Event, newValue: number | number[]) => {
        setSpeechSpeed(newValue as number);
    };

    const toggleVoiceSettings = () => {
        setIsVoiceSettingsOpen((prev) => !prev);
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
            <Button
                variant='outlined'
                onClick={handleNewRecipe}
                startIcon={<HomeIcon />}
                sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    borderColor: "#E87C4B",
                    color: "#E87C4B",
                    "&:hover": { borderColor: "#d86b3a", color: "#d86b3a" }
                }}>
                New Recipe
            </Button>

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    maxWidth: "800px",
                    width: "100%"
                }}>
                <Typography variant='h4' sx={{ mb: 2, fontWeight: "bold" }}>
                    Step {currentStepIndex + 1} of {steps.length}
                </Typography>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        bgcolor: "white",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                    }}>
                    <Typography variant='h5' sx={{ mb: 2, lineHeight: 1.5 }}>
                        {steps[currentStepIndex].text}
                    </Typography>
                    <Button
                        variant='contained'
                        onClick={speakStep}
                        disabled={isLoading}
                        startIcon={
                            isLoading ? (
                                <CircularProgress size={20} color='inherit' />
                            ) : (
                                <VolumeUpIcon />
                            )
                        }
                        sx={{
                            mt: 2,
                            bgcolor: "#E87C4B",
                            "&:hover": { bgcolor: "#d86b3a" },
                            borderRadius: 2,
                            py: 1,
                            px: 3
                        }}>
                        {isLoading ? "Loading..." : "Replay Step"}
                    </Button>
                </Paper>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mb: 4,
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                <Button
                    variant='contained'
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        bgcolor: "#E87C4B",
                        "&:hover": { bgcolor: "#d86b3a" },
                        borderRadius: 2,
                        py: 1,
                        px: 3
                    }}>
                    Previous
                </Button>
                <Button
                    variant='contained'
                    onClick={handleNext}
                    disabled={currentStepIndex === steps.length - 1}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                        bgcolor: "#E87C4B",
                        "&:hover": { bgcolor: "#d86b3a" },
                        borderRadius: 2,
                        py: 1,
                        px: 3
                    }}>
                    Next
                </Button>
            </Box>

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    bgcolor: "white",
                    width: "100%",
                    maxWidth: "800px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2
                }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%"
                    }}>
                    <Typography
                        variant='h6'
                        sx={{ fontWeight: "bold", color: "#555" }}>
                        Voice Settings
                    </Typography>
                    <Button
                        onClick={toggleVoiceSettings}
                        sx={{
                            color: "#E87C4B",
                            textTransform: "none",
                            fontWeight: "bold"
                        }}>
                        {isVoiceSettingsOpen ? "Collapse" : "Expand"}
                    </Button>
                </Box>
                {isVoiceSettingsOpen && (
                    <>
                        <Divider sx={{ width: "100%", mb: 1 }} />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: "center",
                                gap: 2,
                                width: "100%",
                                justifyContent: "center"
                            }}>
                            <FormControl sx={{ minWidth: 200, flexGrow: 1 }}>
                                <InputLabel id='voice-select-label'>
                                    Select Voice
                                </InputLabel>
                                <Select
                                    labelId='voice-select-label'
                                    value={selectedVoice}
                                    label='Select Voice'
                                    onChange={(e) =>
                                        setSelectedVoice(e.target.value)
                                    }
                                    sx={{
                                        bgcolor: "white",
                                        textAlign: "left", // Align text to the left
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#E87C4B"
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: "#d86b3a"
                                            },
                                        borderRadius: 2
                                    }}>
                                    {voices.map((voice) => (
                                        <MenuItem
                                            key={voice.id}
                                            value={voice.id}>
                                            {voice.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant='contained'
                                onClick={toggleListening}
                                disabled={!browserSupportsSpeechRecognition}
                                startIcon={
                                    listening ? <MicOffIcon /> : <MicIcon />
                                }
                                sx={{
                                    bgcolor: listening ? "#4CAF50" : "#E87C4B",
                                    "&:hover": {
                                        bgcolor: listening
                                            ? "#45A049"
                                            : "#d86b3a"
                                    },
                                    borderRadius: 2,
                                    py: 1,
                                    px: 3,
                                    minWidth: "180px"
                                }}>
                                {listening
                                    ? "Stop Listening"
                                    : "Start Listening"}
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                width: "100%",
                                mt: 2,
                                px: 2
                            }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1
                                }}>
                                <SpeedIcon sx={{ mr: 1, color: "#E87C4B" }} />
                                <Typography
                                    variant='body2'
                                    sx={{ color: "#555" }}>
                                    Speech Speed: {speechSpeed.toFixed(1)}x
                                </Typography>
                            </Box>
                            <Slider
                                value={speechSpeed}
                                onChange={handleSpeedChange}
                                min={0.25}
                                max={4.0}
                                step={0.25}
                                marks={[
                                    { value: 0.25, label: "0.25x" },
                                    { value: 1.0, label: "1.0x" },
                                    { value: 2.0, label: "2.0x" },
                                    { value: 4.0, label: "4.0x" }
                                ]}
                                sx={{
                                    color: "#E87C4B",
                                    "& .MuiSlider-thumb": {
                                        "&:hover, &.Mui-focusVisible": {
                                            boxShadow:
                                                "0px 0px 0px 8px rgba(232, 124, 75, 0.16)"
                                        }
                                    },
                                    "& .MuiSlider-rail": {
                                        opacity: 0.5
                                    }
                                }}
                            />
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
}
