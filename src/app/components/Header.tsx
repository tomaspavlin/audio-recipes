'use client';

import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export default function Header() {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Audio Recipes
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Recipes you can hear — no more greasy screens
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 