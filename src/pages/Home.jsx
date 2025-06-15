import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../pages/ProductCard";
import FlashDeals from "../pages/FlashDeals";

const Home = () => {
  const [flashProducts, setFlashProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const BASE_URL = "https://localhost:7040";

  useEffect(() => {
    fetchFlashProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, [page, selectedCategory]);

  const fetchFlashProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/Product/FlashSale`);
      const data = await res.json();
      setFlashProducts(data);
    } catch (err) {
      console.error("Error loading flash products", err);
    }
  };

  const fetchAllProducts = async () => {
    try {
      let url = `${BASE_URL}/api/Product/Approved?page=${page}&pageSize=${pageSize}`;
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setAllProducts(data.products || []);
      setTotalProducts(data.total || 0);
    } catch (err) {
      console.error("Error loading all products", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/Product/Categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const sliderImages = [
    "/assets/banner1.jpg",
    "/assets/banner2.jpg",
    "/assets/banner3.jpg",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Container sx={{ mt: 3 }}>
      {/* ✅ Hero Slider */}
      <Box sx={{ mb: 5 }}>
        <Slider {...sliderSettings}>
          {sliderImages.map((img, index) => (
            <Box key={index}>
              <img
                src={process.env.PUBLIC_URL + img}
                alt={`banner-${index}`}
                style={{
                  width: "100%",
                  height: "400px",
                  borderRadius: 8,
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.src = "/assets/default.png";
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* ✅ Flash Sale Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        ⚡ Flash Sale
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto", gap: 2, mb: 5 }}>
        {flashProducts.map((product) => (
          <Box key={product.id} sx={{ minWidth: "250px" }}>
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>

      {/* ✅ Flash Deals Component */}
      <FlashDeals />

      {/* ✅ All Products + Filter */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">🛒 All Products</Typography>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat, i) => (
            <MenuItem key={i} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* ✅ Products Grid */}
      <Grid container spacing={3}>
        {allProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* ✅ Pagination */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(totalProducts / pageSize)}
          page={page}
          onChange={(e, val) => setPage(val)}
        />
      </Box>
    </Container>
  );
};

export default Home;
