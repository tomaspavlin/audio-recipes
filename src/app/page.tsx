import { Container, Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import RecipeInput from './components/RecipeInput';

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Container component="main" maxWidth="md" sx={{ flex: 1, py: 4 }}>
        <RecipeInput />
      </Container>
      <Footer />
    </Box>
  );
}
