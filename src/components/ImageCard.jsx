"use client"; // Since you are managing state and interactions in a client-side environment

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import Edit icon
import { useCategories } from "@/hooks/useCategories";
import EditImageModal from "./EditModal";
import { useState } from "react";
import { updateImageDetails } from "@/api/api";
import { useQueryClient } from "react-query";
import Swal from "sweetalert2";
export default function ImageCard({ image, onDelete, setSnackbar }) {
  // Local state to store the image details and ensure re-render on update
  const [imageData, setImageData] = useState(image);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedImageForEdit, setSelectedImageForEdit] = useState(null);
  const queryClient = useQueryClient();

  const { data: categories } = useCategories();
  if (!categories) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {" "}
        <CircularProgress />
      </div>
    );
  }

  // Find the category name for the current image's categoryId
  const matchedCategory = categories.find(
    (category) => category.id === imageData.categoryId // use imageData instead of image
  );

  // Handle edit button click
  const handleEdit = (image) => {
    setSelectedImageForEdit(image);
    setOpenEditModal(true);
  };

  // Handle save changes in the modal
  const handleSaveChanges = (updatedImage) => {
    // Call the API to update the image details
    updateImageDetails(updatedImage)
      .then(() => {
        // After successful update, update the local state with the new image details
        setImageData((prev) => ({
          ...prev,
          ...updatedImage, // Merge updated fields into local state
        }));

        queryClient.invalidateQueries("images"); // Optionally, refresh the images list

        setSnackbar({
          open: true,
          message: "Image updated successfully!",
          severity: "success",
        });

        setOpenEditModal(false); // Close the modal
        setSelectedImageForEdit(null); // Clear selected image for edit
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: "Failed to update image!",
          severity: "error",
        });
      });
  };
  // For uploaded photo date
  const date = new Date(imageData.uploadDate);

  // Format it to a more human-readable format
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric", // "2024"
    month: "long", // "October"
    day: "numeric", // "21"
  });

  // Handle delete with warning sweetAlert
  const handleDelete = (id) => {
    Swal.fire({
      title: "Error!",
      text: "Do you want to delete this image?",
      icon: "warning",
      confirmButtonText: "Delete",
      confirmButtonColor: "red",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) onDelete(id);
    });
  };
  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={imageData.url} // Display updated image URL
        alt={imageData.name} // Display updated image name
        loading="lazy"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" sx={{ fontweight: 600 }}>
          {imageData.name} {/* Display updated image name */}
        </Typography>
        <p style={{ fontFamily: "sans-serif" }}>
          Category: {matchedCategory?.name} {/* Display updated category */}
        </p>
        <p style={{ fontFamily: "sans-serif" }}>
          Size: {imageData?.metadata?.size}
        </p>{" "}
        {/* Display updated size */}
        {/* Edit Button */}
        <p style={{ fontFamily: "sans-serif" }}>Uploaded: {formattedDate}</p>
        <IconButton
          aria-label="edit"
          color="primary"
          onClick={() => handleEdit(imageData)} // Pass current image data to edit
        >
          <EditIcon />
        </IconButton>
        {/* Delete Button */}
        <IconButton
          aria-label="delete"
          onClick={() => handleDelete(imageData.id)} // Handle delete
          color="error"
          sx={{ float: "right" }}
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>

      {/* Edit Image Modal */}
      {selectedImageForEdit && (
        <EditImageModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          image={selectedImageForEdit}
          categories={categories}
          onSave={handleSaveChanges} // Save changes handler
        />
      )}
    </Card>
  );
}
