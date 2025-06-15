import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`https://localhost:7040/api/Cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
      calculateTotal(res.data);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotalBill(total);
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`https://localhost:7040/api/Cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCartItems();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const cancelCart = async () => {
    try {
      await Promise.all(
        cartItems.map((item) =>
          axios.delete(`https://localhost:7040/api/Cart/${item.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setCartItems([]);
      setTotalBill(0);
    } catch (err) {
      console.error("Cancel cart error", err);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography>No items in cart</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {cartItems.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
                  <img
                    src={item.product.imageUrl || "/assets/default.png"}
                    alt={item.product.title}
                    width="100"
                    height="100"
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="h6">{item.product.title}</Typography>
                    <Typography>₹ {item.product.price}</Typography>
                    <Typography>Qty: {item.quantity}</Typography>
                  </Box>
                  <IconButton onClick={() => removeItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6">Total: ₹ {totalBill}</Typography>

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
            <Button variant="outlined" color="error" onClick={cancelCart}>
              Cancel All
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;
