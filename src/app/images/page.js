"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Grid,
  CircularProgress,
  Container,
  Typography,
  Snackbar,
  Alert,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import ImageCard from "@/components/ImageCard";
import { fetchImages, deleteImage, fetchCategories } from "@/api/api";
import { useState } from "react";
import { AddAPhoto } from "@mui/icons-material";
import UploadImageModal from "./upload";
import ImageFilter from "@/components/Filter";

export default function ImagesPage() {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [openModal, setOpenModal] = useState(false);
  const [localImages, setLocalImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [metadataFilter, setMetadataFilter] = useState("");

  const { data: apiImages, isLoading, error } = useQuery("images", fetchImages);

  const { data: categories } = useQuery("categories", fetchCategories);

  const deleteMutation = useMutation(deleteImage, {
    onSuccess: (__, deletedId) => {
      queryClient.setQueryData("images", (oldData) =>
        oldData ? oldData.filter((image) => image.id !== deletedId) : []
      );
      setSnackbar({
        open: true,
        message: "Image deleted successfully!",
        severity: "success",
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: "Failed to delete the image!",
        severity: "error",
      });
    },
  });

  const handleDelete = (id) => {
    setLocalImages((prev) => prev.filter((image) => image.id !== id));
    deleteMutation.mutate(id);
  };

  const handleSnackbarMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLocalImageUpload = (newImage) => {
    setLocalImages((prevImages) => [...prevImages, newImage]);
  };

  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Failed to load images.</Typography>;

  const allImages = [...(apiImages || []), ...localImages];

  const filteredImages = allImages.filter((image) => {
    const matchesName = image.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || image.categoryId === selectedCategory;
    const matchesMetadata = image.metadata.size.includes(metadataFilter);
    return matchesName && matchesCategory && matchesMetadata;
  });

  return (
    <Container>
      <Stack
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Image Gallery
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          style={{ marginBottom: "20px" }}
        >
          <IconButton aria-label="add" sx={{ float: "right", color: "white" }}>
            <AddAPhoto />
          </IconButton>{" "}
          Add Image
        </Button>
      </Stack>

      {/* Filters */}
      <ImageFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        metadataFilter={metadataFilter}
        setMetadataFilter={setMetadataFilter}
        categories={categories}
      />

      <Grid container spacing={2}>
        {filteredImages?.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <ImageCard image={image} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <UploadImageModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleSnackbarMessage}
        queryClient={queryClient}
        onImageUpload={handleLocalImageUpload}
      />
    </Container>
  );
}
