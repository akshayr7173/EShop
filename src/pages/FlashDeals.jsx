import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FlashDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await axios.get("https://localhost:7040/api/Product/Trending");
      setDeals(res.data);
    } catch (err) {
      console.error("Error fetching trending products", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (deals.length === 0) {
    return (
      <Typography variant="h6" sx={{ mt: 3 }} color="text.secondary">
        No trending deals available right now.
      </Typography>
    );
  }

  return (
    <Box sx={{ px: 3, py: 5 }}>
      <Typography variant="h5" gutterBottom color="secondary">
        ⚡ Flash Deals
      </Typography>

      <Grid container spacing={3}>
        {deals.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={product.imageUrl || "/assets/default.png"}
                alt={product.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="subtitle1" noWrap>
                  {product.title}
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹ {product.price}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View Deal
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FlashDeals;
