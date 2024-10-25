'use client';
import { useState } from 'react';
import { Box, TextField, Button, Typography, Modal, FormControl, InputLabel, Select, MenuItem, CardContent, Card } from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import { fetchCategories, uploadImage } from '@/api/api';
import Image from 'next/image';

export default function UploadImageModal({ open, onClose, onSuccess, queryClient, onImageUpload, setSnackbar }) {
  const [imageName, setImageName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
 
  // Fetch categories using React Query
  const { data: categories, isLoading, error } = useQuery('categories', fetchCategories);


  
  const mutation = useMutation(uploadImage, {
    onSuccess: () => {
      // Invalidate and refetch the images list to update the UI
      queryClient.invalidateQueries('images');
      console.log("Hello")
      setSnackbar({
        open: true,
        message: "Image added successfully!",
        severity: "success",
      }); 
      onClose(); 
      resetForm();
      setLoading(false);
    },
  });
  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile || !imageName || !category) {
      alert('Please fill all fields!');
      return;
    }
    setLoading(true);
    const newImage = {
      id: Date.now(),  // Simulated ID (since we don't have an actual backend)
      name: imageName,
      category,
      metadata: { size: `${selectedFile.size} bytes`, type: selectedFile.type },
      uploadDate: new Date().toISOString(),
    };

    // Simulate successful upload by calling onImageUpload
    mutation.mutate(newImage);
    onImageUpload(newImage);  // Add new image to local state
    
  };
  // handling uploading img file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(URL.createObjectURL(file)); // Create a URL for the selected file
    }
}; 
  const resetForm = () => {
    setImageName('');
    setCategory('');
    setSelectedFile(null);
  };
 console.log(categories)
  return (
    <Modal open={open} onClose={onClose}>
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Upload New Image
        </Typography>

        <form onSubmit={handleUpload}>
          <TextField
            label="Image Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories?.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Card variant="outlined" style={{ maxWidth: 400, margin: 'auto', padding: '20px', textAlign: 'center' }}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    Image Upload
                </Typography>
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*"
                    style={{ display: 'none' }}  
                    id="file-input"
                />
                <label htmlFor="file-input">
                    <Button variant="contained" component="span">
                        Upload Image
                    </Button>
                </label>
                {selectedFile && (
                    <div style={{ marginTop: '20px' }}>
                        <Image 
                            width={300}
                            height={300}
                            src={selectedFile} 
                            alt="Selected" 
                            style={{ maxWidth: '100%', maxHeight: '300px', border: '2px dashed #ccc' }} 
                        />
                    </div>
                )}
            </CardContent>
        </Card>
          <Button type="submit" disabled={loading} variant="contained" color="primary" fullWidth>
            Upload
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
