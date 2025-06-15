import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  InputBase,
  Menu,
  MenuItem,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { ShoppingCart, Favorite, AccountCircle } from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProductSearchContext } from "../context/ProductSearchContext";
import Fuse from "fuse.js";

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "400px",
  },
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  width: "100%",
}));

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  const isCustomer = user?.role === "Customer";
  const isSeller = user?.role === "Seller";
  const isAdmin = user?.role === "Admin";

  // 🔍 Fuse.js search integration
  const { allProducts } = React.useContext(ProductSearchContext);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);

  const fuse = new Fuse(allProducts, {
    keys: ["name", "category", "description"],
    threshold: 0.4,
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      const matched = fuse.search(value).map((res) => res.item);
      setResults(matched.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  const handleSelect = (productId) => {
    navigate(`/product/${productId}`);
    setQuery("");
    setResults([]);
  };

  return (
    <AppBar position="sticky" color="default" sx={{ mb: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer", fontWeight: "bold" }}
        >
          🛒 MyShop
        </Typography>

        {/* 🔍 Search Bar */}
        <Box sx={{ position: "relative", width: "400px" }}>
          <SearchWrapper>
            <SearchInput
              placeholder="Search products..."
              value={query}
              onChange={handleSearchChange}
            />
          </SearchWrapper>
          {results.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                top: "40px",
                zIndex: 10,
                width: "100%",
                maxHeight: 250,
                overflowY: "auto",
              }}
            >
              <List dense>
                {results.map((product) => (
                  <ListItem
                    button
                    key={product.id}
                    onClick={() => handleSelect(product.id)}
                  >
                    <ListItemText
                      primary={product.name}
                      secondary={`₹${product.price}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Buttons & Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button onClick={() => navigate("/")}>Home</Button>
          <Button onClick={() => navigate("/products")}>Products</Button>

          {user ? (
            <>
              {isCustomer && (
                <>
                  <IconButton onClick={() => navigate("/wishlist")}> 
                    <Badge badgeContent={0} color="error">
                      <Favorite />
                    </Badge>
                  </IconButton>

                  <IconButton onClick={() => navigate("/cart")}> 
                    <Badge badgeContent={0} color="primary">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </>
              )}

              <IconButton onClick={handleMenuOpen}>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>Edit Profile</MenuItem>
                {isCustomer && (
                  <>
                    <MenuItem onClick={() => { navigate("/orders"); handleMenuClose(); }}>My Orders</MenuItem>
                    <MenuItem onClick={() => { navigate("/wishlist"); handleMenuClose(); }}>Wishlist</MenuItem>
                  </>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button variant="outlined" onClick={() => navigate("/login")}>Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
