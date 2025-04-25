import { Container, Box, Typography, Paper } from '@mui/material';
import Footer from './components/Footer';
import RecipeInput from './components/RecipeInput';
import CommunityRecipes from './components/CommunityRecipes';
import RecipeSuggestions from './components/RecipeSuggestions';
import Image from 'next/image';

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#FDF4ED',
      }}
    >
      <Container 
        component="main" 
        maxWidth="md" 
        sx={{ 
          flex: 1, 
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Image
            src="/flavicon-orange-bg.png"
            alt="Audio Recipes Logo"
            fill
            style={{
              objectFit: 'contain',
            }}
            priority
          />
        </Box>

        {/* Headline and Subheadline */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              color: '#222222',
              mb: 1,
            }}
          >
            Recipes you can hear
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#555555',
              fontWeight: 'normal',
            }}
          >
            — no more greasy screens.
          </Typography>
        </Box>

        {/* Recipe Input */}
        <RecipeInput />

        {/* Recipe Suggestions */}
        <RecipeSuggestions />

        {/* Community Recipes */}
        <CommunityRecipes />
      </Container>
      <Footer />
    </Box>
  );
}
