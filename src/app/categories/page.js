'use client'
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Container,
  Typography,
  Button,
  Modal,
  Box,
  Snackbar,
  Alert,
  Card,
  CardActions,
  CardContent,
  Grid,
  CardMedia,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Delete, Edit } from "@mui/icons-material";
import Link from 'next/link'; // Import Link from Next.js
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/api/api";
import ImageFilter from '@/components/Filter';  // Import ImageFilter
import Swal from "sweetalert2";

export default function CategoriesPage() {
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: "" });
  const [selectedCategory, setSelectedCategory] = useState('');  // State for filtering categories
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { data: categories, isLoading, error } = useQuery("categories", fetchCategories);

  const createMutation = useMutation(createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
      setSnackbar({
        open: true,
        message: "Category created successfully!",
        severity: "success",
      });
      resetForm();
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: "Failed to create category.",
        severity: "error",
      });
    },
  });

  const updateMutation = useMutation(updateCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
      setSnackbar({
        open: true,
        message: "Category updated successfully!",
        severity: "success",
      });
      resetForm();
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: "Failed to update category.",
        severity: "error",
      });
    },
  });

  const deleteMutation = useMutation(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
      setSnackbar({
        open: true,
        message: "Category deleted successfully!",
        severity: "success",
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: "Failed to delete category.",
        severity: "error",
      });
    },
  });

  const handleSave = () => {
    if (editMode) {
      updateMutation.mutate({
        id: currentCategory.id,
        updatedCategory: currentCategory,
      });
    } else {
      createMutation.mutate(currentCategory);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Error!",
      text: "Do you want to delete this category?",
      icon: "warning",
      confirmButtonText: "Delete",
      confirmButtonColor: "red",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);;
    });
    
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setEditMode(true);
    setOpenModal(true);
  };

  const resetForm = () => {
    setCurrentCategory({ name: "" });
    setEditMode(false);
    setOpenModal(false);
  };

  if (isLoading) return  <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh"
  }}
>
  {" "}
  <CircularProgress />
</div>;
  if (error) return <div>Error fetching categories</div>;

  return (
    <Container>
      <Stack sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h4" gutterBottom>
          Categories Management
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          startIcon={<Add />}
          sx={{ marginBottom: "20px" }}
        >
          Add Category
        </Button>
      </Stack>

      {/* Category Filter */}
      <ImageFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        showCategoryOnly={true}  // Only show the category filter
      />

      <Grid container spacing={3}>
        {categories
          ?.filter(category => !selectedCategory || category.id === selectedCategory)  // Apply the category filter
          .map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
                textDecoration: "none",
              }}
            >
              <Link href={`/categories/${category.id}`} style={{ textDecoration: 'none', color: "#000" }} passHref>
                <CardMedia
                  component="img"
                  height="140"
                  image={category.image}
                  alt={category.name}
                />
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2">{category.description}</Typography>
                </CardContent>
              </Link>
              <CardActions>
                <Button size="small" onClick={() => handleEdit(category)}>
                  Edit <Edit/>
                </Button>
                <Button
                  size="small"
                  onClick={() => handleDelete(category.id)}
                  color="error"
                >
                  Delete <Delete/>
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={openModal} onClose={() => resetForm()}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">
            {editMode ? "Edit" : "Add"} Category
          </Typography>
          <TextField
            label="Category Name"
            value={currentCategory.name}
            onChange={(e) =>
              setCurrentCategory({ ...currentCategory, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            fullWidth
          >
            {editMode ? "Update" : "Create"} Category
          </Button>
        </Box>
      </Modal>

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
