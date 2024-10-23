import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Image Manager averroes test
          </Typography>
          <Button color="inherit" component={Link} href="/images">
            Images
          </Button>
          <Button color="inherit" component={Link} href="/categories">
            Categories
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
