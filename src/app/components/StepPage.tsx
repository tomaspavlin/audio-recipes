"use client";
import { Box, Button, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, Paper, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import SpeechRecognition, {
    useSpeechRecognition
} from "react-speech-recognition";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';

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
    const [selectedVoice, setSelectedVoice] = React.useState('alloy');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Fetch available voices
    useEffect(() => {
        const fetchVoices = async () => {
            try {
                const response = await fetch('/api/text-to-speech');
                if (response.ok) {
                    const data = await response.json();
                    setVoices(data.voices);
                }
            } catch (error) {
                console.error('Error fetching voices:', error);
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
            const response = await fetch('/api/text-to-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    text: steps[currentStepIndex].text,
                    voice: selectedVoice
                }),
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
    }, [currentStepIndex, selectedVoice]);

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
                    }}
                >
                    <Typography variant='h5' sx={{ mb: 2, lineHeight: 1.5 }}>
                        {steps[currentStepIndex].text}
                    </Typography>
                    <Button
                        variant='contained'
                        onClick={speakStep}
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <VolumeUpIcon />}
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
            
            <Box sx={{ 
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
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#555" }}>
                    Voice Settings
                </Typography>
                <Divider sx={{ width: "100%", mb: 1 }} />
                
                <Box sx={{ 
                    display: "flex", 
                    flexDirection: { xs: "column", sm: "row" }, 
                    alignItems: "center", 
                    gap: 2,
                    width: "100%",
                    justifyContent: "center"
                }}>
                    <FormControl sx={{ minWidth: 200, flexGrow: 1 }}>
                        <InputLabel id="voice-select-label">Select Voice</InputLabel>
                        <Select
                            labelId="voice-select-label"
                            value={selectedVoice}
                            label="Select Voice"
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            sx={{
                                bgcolor: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#E87C4B',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d86b3a',
                                },
                                borderRadius: 2
                            }}
                        >
                            {voices.map((voice) => (
                                <MenuItem key={voice.id} value={voice.id}>
                                    {voice.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <Button
                        variant='contained'
                        onClick={toggleListening}
                        disabled={!browserSupportsSpeechRecognition}
                        startIcon={listening ? <MicOffIcon /> : <MicIcon />}
                        sx={{
                            bgcolor: listening ? "#4CAF50" : "#E87C4B",
                            "&:hover": { bgcolor: listening ? "#45A049" : "#d86b3a" },
                            borderRadius: 2,
                            py: 1,
                            px: 3,
                            minWidth: "180px"
                        }}>
                        {listening ? "Stop Listening" : "Start Listening"}
                    </Button>
                </Box>
                
                {listening && (
                    <Typography
                        variant='body2'
                        sx={{
                            color: "#555",
                            fontStyle: "italic",
                            mt: 1
                        }}>
                        {transcript || "Listening..."}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
}
