'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Button, TextField, Input, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { uploadImage } from '@/api/api';


export default function ImageUpload({ categories }) {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [category, setCategory] = useState('');

  const mutation = useMutation(uploadImage, {
    onSuccess: () => {
      // Invalidate and refetch the images list to update the UI
      queryClient.invalidateQueries('images');
    },
  });

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile || !imageName || !category) {
      alert('Please fill all fields!');
      return;
    }

    // Simulate image upload (send file name and category)
    const newImage = {
      name: imageName,
      category,
      metadata: { size: `${selectedFile.size} bytes`, type: selectedFile.type },
      uploadDate: new Date().toISOString(),
    };

    mutation.mutate(newImage);
  };

  return (
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
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Input type="file" onChange={handleFileChange} fullWidth margin="normal" />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Upload Image
      </Button>
    </form>
  );
}
