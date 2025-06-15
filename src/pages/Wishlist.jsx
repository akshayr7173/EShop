import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const userId = localStorage.getItem("userId");
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(
        `https://localhost:7040/api/Wishlist/User/${userId}`
      );
      setWishlist(res.data);
    } catch (err) {
      console.error("Fetch wishlist error", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `https://localhost:7040/api/Wishlist/Remove/${productId}`
      );
      fetchWishlist();
    } catch (err) {
      console.error("Remove from wishlist error", err);
    }
  };

  const viewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) return <CircularProgress sx={{ m: 5 }} />;

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Wishlist
      </Typography>

      {wishlist.length === 0 ? (
        <Typography variant="body1">Your wishlist is empty.</Typography>
      ) : (
        wishlist.map((item) => (
          <Box key={item.id}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3} md={2}>
                <img
                  src={item.imageUrl || "/assets/default.png"}
                  alt={item.title}
                  width="100%"
                  style={{ borderRadius: 6 }}
                />
              </Grid>
              <Grid item xs={7} md={9}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography color="text.secondary">₹ {item.price}</Typography>
                <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => viewProduct(item.id)}
                  >
                    View Product
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
          </Box>
        ))
      )}
    </Paper>
  );
};

export default WishlistPage;
