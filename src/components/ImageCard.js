import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCategories } from "@/hooks/useCategories";
export default function ImageCard({ image, onDelete }) {
      
    const {data: categories, isLoading, error} = useCategories();
    if (!categories) {
        return <p>Loading category...</p>; 
      }
    const matchedCategory = categories.find(category => category.id === image.categoryId);
  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={image.url}
        alt={image.name}
        loading="lazy"
      />
      <CardContent>
        <Typography gutterBottom variant="h5"  sx={{fontweight: 600}}>
          {image.name}
        </Typography>
        <p style={{fontFamily: "sans-serif"}}>Category: {matchedCategory?.name}</p>
        <p>Size: {image?.metadata?.size}</p>
        

        <IconButton
          aria-label="delete"
          onClick={() => onDelete(image.id)}
          sx={{ float: "right" }}
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}
