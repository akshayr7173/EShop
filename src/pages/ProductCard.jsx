import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
  Box,
  Chip,
  Rating,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BoltIcon from "@mui/icons-material/Bolt";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: '16px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
    '& .product-image': {
      transform: 'scale(1.05)',
    },
    '& .quick-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  }
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  objectFit: "cover",
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
}));

const QuickActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  opacity: 0,
  transform: 'translateY(-10px)',
  transition: 'all 0.3s ease',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  width: 40,
  height: 40,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1)',
  }
}));

const PriceBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
}));

const CurrentPrice = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  textDecoration: 'line-through',
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: 'white',
  fontSize: '0.75rem',
  height: 24,
  fontWeight: 600,
}));

const BuyButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 20px',
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0284c7, #c026d3)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)',
  }
}));

const AddToCartButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '10px 20px',
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(14, 165, 233, 0.3)',
  }
}));

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Calculate discount percentage (mock data)
  const originalPrice = product.price * 1.2; // Assuming 20% discount
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Add wishlist API call here
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Add to cart API call here
    console.log('Added to cart:', product.id);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  return (
    <StyledCard className="animate-fade-in-up">
      <Box sx={{ position: 'relative' }}>
        <ProductImage
          className="product-image"
          component="img"
          image={product.imageUrl || "/assets/default.png"}
          alt={product.title || product.name}
          onClick={() => navigate(`/product/${product.id}`)}
        />
        
        <QuickActions className="quick-actions">
          <ActionButton onClick={handleWishlistToggle}>
            {isWishlisted ? (
              <FavoriteIcon sx={{ color: 'error.main' }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </ActionButton>
          <ActionButton onClick={handleAddToCart}>
            <ShoppingCartIcon />
          </ActionButton>
        </QuickActions>

        {discountPercent > 0 && (
          <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
            <DiscountChip label={`${discountPercent}% OFF`} size="small" />
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: '1rem',
            fontWeight: 600,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.title || product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={4.2} precision={0.1} size="small" readOnly />
          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
            (4.2)
          </Typography>
        </Box>

        <PriceBox>
          <CurrentPrice>₹{product.price}</CurrentPrice>
          {discountPercent > 0 && (
            <OriginalPrice>₹{Math.round(originalPrice)}</OriginalPrice>
          )}
        </PriceBox>

        {product.category && (
          <Chip 
            label={product.category} 
            size="small" 
            variant="outlined"
            sx={{ mt: 1, fontSize: '0.75rem' }}
          />
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <BuyButton
          variant="contained"
          startIcon={<BoltIcon />}
          onClick={handleBuyNow}
          fullWidth
        >
          Buy Now
        </BuyButton>
        <AddToCartButton
          variant="outlined"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          fullWidth
        >
          Add to Cart
        </AddToCartButton>
      </CardActions>
    </StyledCard>
  );
};

export default ProductCard;