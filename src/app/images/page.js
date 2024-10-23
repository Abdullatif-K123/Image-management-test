'use client';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Grid, CircularProgress, Container, Typography, Snackbar, Alert, Button, IconButton, Stack } from '@mui/material';
import ImageCard from '@/components/ImageCard'; 
import { fetchImages, deleteImage } from '@/api/api';  // Import delete and fetch API
import { useState } from 'react';
import { AddAPhoto } from '@mui/icons-material';
import UploadImageModal from './upload';  // Import the new modal component

export default function ImagesPage() {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [openModal, setOpenModal] = useState(false);  
  const [localImages, setLocalImages] = useState([]);  

  // Fetch images with React Query
  const { data: apiImages, isLoading, error } = useQuery('images', fetchImages);

  // Delete image mutation
  const deleteMutation = useMutation(deleteImage, { 
    onSuccess: (__, deletedId) => { 
      queryClient.setQueryData('images', (oldData) =>
        oldData ? oldData.filter((image) => image.id !== deletedId) : []
      );
      setSnackbar({ open: true, message: 'Image deleted successfully!', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to delete the image!', severity: 'error' });
    },
  });

  const handleDelete = (id) => {
    // Remove from localImages as well
    setLocalImages((prev) => prev.filter((image) => image.id !== id));
    deleteMutation.mutate(id);  // Pass the image ID to the mutation
  };

  const handleSnackbarMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLocalImageUpload = (newImage) => {
    setLocalImages((prevImages) => [...prevImages, newImage]);  // Add new image to local state
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load images.</Typography>;

  // Merge API images with local uploaded images
  const allImages = [...(apiImages || []), ...localImages];

  return (
    <Container>
      <Stack sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Typography variant="h4" gutterBottom>
          Image Gallery
        </Typography>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setOpenModal(true)}  // Open modal on button click
          style={{ marginBottom: '20px' }}
        >
          <IconButton
            aria-label="add"
            sx={{ float: "right", color: "white" }}
          >
            <AddAPhoto />
          </IconButton> Add Image
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {allImages?.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <ImageCard image={image} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Upload Image Modal */}
      <UploadImageModal 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        onSuccess={handleSnackbarMessage}
        queryClient={queryClient}  // Pass queryClient to refresh images on upload
        onImageUpload={handleLocalImageUpload}  // Pass the function to handle local image upload
      />
    </Container>
  );
}
