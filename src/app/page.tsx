import { Container, Box, Typography, Paper } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RecipeInput from "./components/RecipeInput";
import RestaurantIcon from "@mui/icons-material/Restaurant";

export default function Home() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                bgcolor: "#FDF4ED"
            }}>
            <Header />
            <Container
                component='main'
                maxWidth='md'
                sx={{
                    flex: 1,
                    py: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4
                }}>
                {/* Icon */}
                <img
                    src='/flavicon-orange-bg.png'
                    alt='App Icon'
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 16
                    }}
                />

                {/* Headline and Subheadline */}
                <Box sx={{ textAlign: "center" }}>
                    <Typography
                        variant='h2'
                        sx={{
                            fontWeight: "bold",
                            color: "#222222",
                            mb: 1
                        }}>
                        Recipes you can hear
                    </Typography>
                    <Typography
                        variant='h5'
                        sx={{
                            color: "#555555",
                            fontWeight: "normal"
                        }}>
                        — no more greasy screens.
                    </Typography>
                </Box>

                {/* Recipe Input */}
                <RecipeInput />

                {/* Instructions */}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Typography
                        variant='body1'
                        sx={{ color: "#555555", mb: 1 }}>
                        1. Paste a recipe
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{ color: "#555555", mb: 1 }}>
                        2. Hit start
                    </Typography>
                    <Typography variant='body1' sx={{ color: "#555555" }}>
                        3. Listen and cook!
                    </Typography>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
}
