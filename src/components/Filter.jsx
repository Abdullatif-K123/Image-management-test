// ImageFilter.js
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function ImageFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  metadataFilter,
  setMetadataFilter,
  categories,
  hideCategory = false,
  showCategoryOnly = false, // New prop to control whether to show only the category filter
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
      {!showCategoryOnly && (
        <>
          {/* Search by Name */}
          <TextField
            label="Search by Name"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />

          {/* Metadata Filter */}
          <TextField
            label="Filter by Size"
            variant="outlined"
            value={metadataFilter}
            onChange={(e) => setMetadataFilter(e.target.value)}
            fullWidth
          />
        </>
      )}

      {/* Filter by Category */}
      {!hideCategory && (
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
      )}
    </Stack>
  );
}
