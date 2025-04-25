"use client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    FormControl,
    IconButton,
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
import MicListeningButton from "./MicListeningButton";

interface Voice {
    id: string;
    name: string;
}

export default function StepPage({
    steps,
    recipeName
}: {
    steps: { id: number; text: string }[];
    recipeName: string;
}) {
    const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
    const router = useRouter();
    const recognitionRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [voices, setVoices] = React.useState<Voice[]>([]);
    const [selectedVoice, setSelectedVoice] = React.useState("alloy");
    const [speechSpeed, setSpeechSpeed] = React.useState(1.0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(true);
    const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);
    const [audioCache, setAudioCache] = useState<Record<number, string>>({});

    const isLoading = audioCache[steps[currentStepIndex].id] === undefined;
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
        browserSupportsSpeechRecognition,
        browserSupportsContinuousListening
    } = useSpeechRecognition({});

    const startListening = () => {
        SpeechRecognition.startListening({
            continuous: true
        });
    };
    useEffect(() => {
        // startListening();
    }, []);

    const toggleListening = () => {
        console.log("bafiki");
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            startListening();
        }
    };

    const handleNext = () => {
        setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrevious = () => {
        setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleRepeat = () => {
        speakStep();
    };

    const handleNewResult = (result: string) => {
        const nextKeywords = ["next", "continue", "další", "pokrač", "pak"];
        const previousKeywords = [
            "previous",
            "back",
            "zpátky",
            "zpět",
            "předchozí",
            "předtím"
        ];
        const repeatKeywords = ["repeat", "again", "opak", "znov"];

        if (nextKeywords.some((keyword) => result.includes(keyword))) {
            resetTranscript(); // Clear text
            handleNext();
        } else if (
            previousKeywords.some((keyword) => result.includes(keyword))
        ) {
            resetTranscript(); // Clear text
            handlePrevious();
        } else if (repeatKeywords.some((keyword) => result.includes(keyword))) {
            resetTranscript(); // Clear text
            handleRepeat();
        }
    };

    useEffect(() => {
        console.log("Transcript:", transcript);
        if (transcript) handleNewResult(transcript.toLowerCase().trim());
    }, [transcript, handleNewResult]);

    const getAudioUrl = async (text: string) => {
        const response = await fetch("/api/text-to-speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                voice: selectedVoice,
                speed: speechSpeed
            })
        });

        if (!response.ok) {
            throw new Error("Failed to generate speech");
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        return audioUrl;
    };

    const getStepAudioUrl = async (stepIndex: number) => {
        const step = steps[stepIndex];
        if (audioCache[step.id]) {
            return audioCache[step.id]; // Return cached URL if available
        }

        try {
            const audioUrl = await getAudioUrl(step.text);
            setAudioCache((prev) => ({
                ...prev,
                [step.id]: audioUrl
            }));
            return audioUrl;
        } catch (error) {
            console.error("Error fetching audio URL:", error);
            return null;
        }
    };

    useEffect(() => {
        setAudioCache({});
    }, [selectedVoice, speechSpeed]);

    const getCurrentAudioUrl = async () => {
        //load next onex
        getStepAudioUrl(currentStepIndex + 1);
        return await getStepAudioUrl(currentStepIndex);
    };

    const speakStep = async () => {
        try {
            const audioUrl = await getCurrentAudioUrl();

            if (!audioUrl) {
                console.log("Audio is loading for the current step...");
                return; // Exit early if audio is not yet loaded
            }

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

    const toggleSettingsPopup = () => {
        setIsSettingsPopupOpen((prev) => !prev);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
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
                    display: "flex",
                    flexDirection: {
                        xs: "row",
                        sm: "column"
                    },
                    alignItems: "center",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 2,
                    color: !listening ? "grey.700" : "#E87C4B",
                    gap: 1
                }}>
                <IconButton
                    onClick={toggleSettingsPopup}
                    sx={{
                        color: "grey.700"
                    }}>
                    <SettingsIcon />
                </IconButton>
                <MicListeningButton
                    listening={listening}
                    onClick={toggleListening}
                    disabled={
                        !browserSupportsSpeechRecognition ||
                        !browserSupportsContinuousListening
                    }
                />
            </Box>
            <Box />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: { xs: 2, sm: 4, md: 6 }
                }}>
                <Typography
                    variant='h3'
                    sx={{
                        mb: 4,
                        fontWeight: "bold",
                        color: "#E87C4B",
                        maxWidth: "600px",
                        textAlign: "center",
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }
                    }}>
                    {recipeName}
                </Typography>
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
                        <Typography
                            variant='h5'
                            sx={{ mb: 2, lineHeight: 1.5 }}>
                            {steps[currentStepIndex].text}
                        </Typography>
                        <Button
                            variant='contained'
                            onClick={speakStep}
                            disabled={isLoading}
                            startIcon={
                                isLoading ? (
                                    <CircularProgress
                                        size={20}
                                        color='inherit'
                                    />
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

            <Dialog
                open={isSettingsPopupOpen}
                onClose={toggleSettingsPopup}
                maxWidth='sm'
                fullWidth>
                <DialogContent>
                    <Typography variant='h6' sx={{ mb: 2, fontWeight: "bold" }}>
                        Voice Settings
                    </Typography>
                    <Box>
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
                                }>
                                {voices.map((voice) => (
                                    <MenuItem key={voice.id} value={voice.id}>
                                        {voice.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant='body2'>
                                Speech Speed: {speechSpeed.toFixed(1)}x
                            </Typography>
                            <Slider
                                value={speechSpeed}
                                onChange={handleSpeedChange}
                                min={0.25}
                                max={4.0}
                                step={0.25}
                            />
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
