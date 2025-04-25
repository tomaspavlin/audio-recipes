'use client';

import { Box, Container, Typography, Paper } from '@mui/material';

export default function Footer() {
  return (
    <Paper 
      component="footer" 
      sx={{ 
        py: 3, 
        mt: 'auto',
        backgroundColor: 'grey.100'
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h6" align="center" gutterBottom>
          How it works
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="body2">1. Paste your recipe</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="body2">2. Start cooking</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="body2">3. Use voice commands</Typography>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
} 