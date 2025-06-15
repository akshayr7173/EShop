import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="180"
        image={product.imageUrl || "/assets/default.png"}
        alt={product.title}
        sx={{ objectFit: "contain", p: 1 }}
      />
      <CardContent>
        <Typography variant="h6" noWrap>{product.title}</Typography>
        <Typography color="text.secondary">₹ {product.price}</Typography>
      </CardContent>
      <CardActions sx={{ mt: "auto", justifyContent: "space-between" }}>
        <Button size="small" onClick={() => navigate(`/product/${product.id}`)}>
          Buy Now
        </Button>
        <IconButton>
          <FavoriteBorderIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
