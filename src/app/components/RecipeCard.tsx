import { Box, Card, CardActionArea, Typography, CardMedia } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

interface RecipeCardProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}

export default function RecipeCard({ title, description, image, onClick }: RecipeCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
        border: '1px solid',
        borderColor: 'rgba(232, 124, 75, 0.1)',
        background: `
          linear-gradient(white, white) padding-box,
          linear-gradient(to bottom right, rgba(232, 124, 75, 0.2), rgba(232, 124, 75, 0.05)) border-box
        `,
        overflow: 'hidden',
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <CardMedia
          component="img"
          height="160"
          image={image}
          alt={title}
          sx={{
            width: '100%',
            objectFit: 'cover',
          }}
        />
        <Box sx={{ p: 2, width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
            }}
          >
            <RestaurantIcon sx={{ color: '#E87C4B' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#222222',
              }}
            >
              {title}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: '#666666',
              flex: 1,
            }}
          >
            {description}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
} 