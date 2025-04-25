import { Mic } from "@mui/icons-material";
import { Box } from "@mui/material";

type Props = {
    listening: boolean;
    onClick: () => void;
    disabled?: boolean;
};

export default function MicListeningButton({
    listening,
    onClick: toggleListening,
    disabled
}: Props) {
    const size = 32;
    return disabled ? null : (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 2
            }}>
            {/* <Typography
                variant='caption'
                sx={{
                    opacity: listening ? 1 : 0.5,
                    fontSize: "16px",
                    color: "#555"
                }}>
                {listening ? "" : "Tap to listen"}
            </Typography> */}
            <Box
                sx={{
                    position: "relative",
                    width: size,
                    height: size,
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
                    borderColor: "inherit"
                }}
                onClick={toggleListening}>
                <Mic fontSize='small' />
            </Box>
        </Box>
    );
}
