import { Mic } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

type Props = {
    listening: boolean;
    onClick: () => void;
};

export default function MicListeningButton({
    listening,
    onClick: toggleListening
}: Props) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2
            }}>
            <Box
                sx={{
                    position: "relative",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "none",
                    animation: listening ? "pulse 2s infinite" : "none",
                    "@keyframes pulse": {
                        "0%": {
                            transform: "scale(1)",
                            boxShadow: "0 0 0 0 rgba(232, 124, 75, 0.5)"
                        },
                        "70%": {
                            transform: "scale(1.2)",
                            boxShadow: "0 0 0 15px rgba(232, 124, 75, 0)"
                        },
                        "100%": {
                            transform: "scale(1)",
                            boxShadow: "0 0 0 0 rgba(232, 124, 75, 0)"
                        }
                    },
                    border: "2px solid #E87C4B",
                    color: "#E87C4B"
                }}
                onClick={toggleListening}>
                <Mic fontSize='large' />
            </Box>
            <Typography
                variant='caption'
                sx={{
                    opacity: listening ? 1 : 0.5,
                    fontSize: "16px",
                    color: "#555"
                }}>
                {listening ? "Listening..." : "Tap to listen"}
            </Typography>
        </Box>
    );
}
