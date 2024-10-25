"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import InfiniteScroll from "react-infinite-scroll-component"; // Import InfiniteScroll component
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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import ImageCard from "@/components/ImageCard";
import {
  fetchImages,
  deleteImage,
  fetchCategories,
  updateImageDetails,
} from "@/api/api"; // API imports
import { AddAPhoto } from "@mui/icons-material";
import UploadImageModal from "./upload"; // Import UploadImageModal component

export default function ImagesPage() {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [openModal, setOpenModal] = useState(false);
  const [localImages, setLocalImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // For filtering by name
  const [selectedCategory, setSelectedCategory] = useState(""); // For filtering by category
  const [metadataFilter, setMetadataFilter] = useState(""); // For metadata filter
  const [page, setPage] = useState(1); // Track the current page for infinite scrolling
  const [hasMore, setHasMore] = useState(true); // Determine if there's more data to load
  const [paginatedImages, setPaginatedImages] = useState([]); // Store paginated images
  

  const {
    data: apiImages,
    isLoading,
    error,
  } = useQuery(["images", page], () => fetchImages(page), {
    keepPreviousData: true, // Ensure previous data stays while fetching new data
  });

  const { data: categories } = useQuery("categories", fetchCategories);

  // Fetch new data when the `apiImages` query updates
  useEffect(() => {
    if (apiImages && apiImages.length > 0) {
      setLocalImages((prevImages) => [...prevImages, ...apiImages]); // Append new images to the existing list
    } else {
      setHasMore(false); // No more images to load
    }
  }, [apiImages]);

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
      setLocalImages((prev) => prev.filter((image) => image.id !== deletedId));
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: "Failed to delete the image!",
        severity: "error",
      });
    },
  });

  const handleDelete = async(id) => {
    
    await deleteMutation.mutate(id);
   
  };

  const handleLocalImageUpload = (newImage) => {
    console.log(newImage)
    setLocalImages((prevImages) => [...prevImages, newImage]);
  };

  if (isLoading && page === 1)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh"
        }}
      >
        {" "}
        <CircularProgress />
      </div>
    );
  if (error)
    return <Typography color="error">Failed to load images.</Typography>;

  // Merge API images with local uploaded images
  const allImages = [...paginatedImages, ...localImages];
    console.log(localImages)
  // Function to filter images based on search query, category, and metadata
  const filteredImages = localImages.filter((image) => {
    console.log(image)
    const matchesName = image??  image.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || image.categoryId === selectedCategory;
    const matchesMetadata =image?? image.metadata.size.includes(metadataFilter);
    return matchesName && matchesCategory && matchesMetadata;
  });

  // Load more images when scrolling
  const fetchMoreImages = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number
  };

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
      <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {categories?.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Filter by Size"
          variant="outlined"
          value={metadataFilter}
          onChange={(e) => setMetadataFilter(e.target.value)}
          fullWidth
        />
      </Stack>

      {/* Infinite Scroll */}
      <InfiniteScroll
        dataLength={filteredImages.length}
        next={fetchMoreImages}
        hasMore={hasMore}
        loader={<CircularProgress />}
        style={{overflow: "hidden"}}
        endMessage={
          <Typography sx={{ textAlign: "center", fontWeight: 500 }}>
            No more images to show.
          </Typography>
        }
      >
        <Grid container spacing={2}>
          {filteredImages?.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <ImageCard
                setSnackbar={setSnackbar}
                image={image}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>

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
        onSuccess={handleLocalImageUpload}
        onImageUpload={handleLocalImageUpload}
        queryClient={queryClient}
        setSnackbar={setSnackbar}
      />
    </Container>
  );
}
