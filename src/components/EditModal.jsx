import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const EditImageModal = ({ open, onClose, image, categories, onSave }) => {
  console.log(image);
  const [updatedImage, setUpdatedImage] = useState({
    name: image.name,
    categoryId: image.categoryId,
    metadata: image.metadata,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedImage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(updatedImage);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 4,
        }}
      >
        <h2>Edit Image Details</h2>

        <TextField
          label="Name"
          name="name"
          value={updatedImage.name}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={updatedImage.categoryId}
            onChange={handleInputChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default EditImageModal;
