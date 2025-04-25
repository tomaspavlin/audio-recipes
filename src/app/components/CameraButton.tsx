'use client';

import { useState, useRef } from 'react';
import { IconButton, Box, Dialog, DialogTitle, DialogContent, Button, Stack } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

export default function CameraButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCameraOpen(true);
      closeDialog();
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        // Here you can handle the captured image (e.g., send it to an API)
        console.log('Image captured:', imageData);
        closeCamera();
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result;
        // Here you can handle the selected image (e.g., send it to an API)
        console.log('Image selected:', imageData);
      };
      reader.readAsDataURL(file);
    }
    closeDialog();
  };

  return (
    <>
      <IconButton
        onClick={openDialog}
        sx={{
          bgcolor: '#E87C4B',
          color: 'white',
          '&:hover': {
            bgcolor: '#D76B3A',
          },
        }}
      >
        <CameraAltIcon />
      </IconButton>

      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>Add Photo</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              startIcon={<CameraAltIcon />}
              onClick={openCamera}
              sx={{
                bgcolor: '#E87C4B',
                '&:hover': {
                  bgcolor: '#D76B3A',
                },
              }}
            >
              Take a Photo
            </Button>
            <Button
              variant="outlined"
              startIcon={<PhotoLibraryIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                borderColor: '#E87C4B',
                color: '#E87C4B',
                '&:hover': {
                  borderColor: '#D76B3A',
                  color: '#D76B3A',
                },
              }}
            >
              Choose from Library
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </Stack>
        </DialogContent>
      </Dialog>

      {isCameraOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '90%', maxWidth: 500, borderRadius: 8 }}
          />
          <IconButton
            onClick={closeCamera}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={captureImage}
            sx={{
              position: 'absolute',
              bottom: 16,
              bgcolor: '#E87C4B',
              color: 'white',
              '&:hover': {
                bgcolor: '#D76B3A',
              },
            }}
          >
            <CameraAltIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
} 