import { Box, Dialog, DialogContent, DialogTitle, DialogActions, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface RecipeModalProps {
  open: boolean;
  onClose: () => void;
  onStartCooking: () => void;
  recipe: {
    title: string;
    recipe: string;
    image: string;
  } | null;
}

export default function RecipeModal({ open, onClose, onStartCooking, recipe }: RecipeModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: '#FDF4ED',
        borderBottom: '1px solid',
        borderColor: 'rgba(232, 124, 75, 0.1)',
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#222222' }}>
          {recipe?.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {recipe?.image && (
          <Box sx={{ width: '100%', height: 200, overflow: 'hidden' }}>
            <img 
              src={recipe.image} 
              alt={recipe.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="body1"
            component="pre"
            sx={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              mb: 2,
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            {recipe?.recipe}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: '#FDF4ED', borderTop: '1px solid', borderColor: 'rgba(232, 124, 75, 0.1)' }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={onStartCooking} 
          variant="contained"
          sx={{
            bgcolor: '#E87C4B',
            '&:hover': {
              bgcolor: '#d86b3a',
            },
          }}
        >
          Start Cooking
        </Button>
      </DialogActions>
    </Dialog>
  );
} 