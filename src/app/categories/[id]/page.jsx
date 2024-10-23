"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Grid,
  CircularProgress,
  Container,
  Typography,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import ImageCard from "@/components/ImageCard";
import { fetchImages, deleteImage } from "@/api/api"; // Import delete and fetch API
import { useState } from "react";
import { AddAPhoto } from "@mui/icons-material";
import { useCategories } from "@/hooks/useCategories";
import ImageFilter from "@/components/Filter";

export default function CategoryImagesPage({ params }) {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [openModal, setOpenModal] = useState(false);
  const [localImages, setLocalImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [metadataFilter, setMetadataFilter] = useState("");
  const categoryId = params.id; // Use the params object to get the id

  // Fetch images with React Query, filtering by categoryId
  const {
    data: apiImages,
    isLoading,
    error,
  } = useQuery(["images", categoryId], () => fetchImages(categoryId));
  console.log(apiImages);
  // Delete image mutation
  const deleteMutation = useMutation(deleteImage, {
    onSuccess: (__, deletedId) => {
      queryClient.setQueryData(["images", categoryId], (oldData) =>
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
  const { data: categories } = useCategories();

  const handleDelete = (id) => {
    setLocalImages((prev) => prev.filter((image) => image.id !== id));
    deleteMutation.mutate(id);
  };

  if (isLoading)
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
  if (error)
    return <Typography color="error">Failed to load images.</Typography>;

  const filteredApiImages = apiImages.filter(
    (singleImage) => singleImage.categoryId == categoryId
  );
  // Merge filtered API images with local uploaded images
  const allImages = [...filteredApiImages];
  const filteredImages = allImages.filter((image) => {
    const matchesName = image.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesMetadata = image.metadata.size.includes(metadataFilter);
    return matchesName && matchesMetadata;
  });
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
  const matchedCategory = categories.find(
    (category) => category.id === Number(categoryId)
  );
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
          Image Gallery for Category {matchedCategory?.name}
        </Typography>
      </Stack>

      {/* Filters */}
      <ImageFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        metadataFilter={metadataFilter}
        setMetadataFilter={setMetadataFilter}
        categories={categories}
        hideCategory={true}
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
    </Container>
  );
}
