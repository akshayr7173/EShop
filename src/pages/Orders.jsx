import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
} from "@mui/material";

const Order = ({ order }) => {
  const {
    id,
    orderDate,
    totalAmount,
    paymentMethod,
    status,
    address,
    orderItems,
  } = order;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Order ID: #{id}</Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {new Date(orderDate).toLocaleString()}
        </Typography>
        <Chip label={status} color="success" sx={{ mt: 1 }} />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        {orderItems.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1">{item.product.title}</Typography>
              <Typography variant="body2">Qty: {item.quantity}</Typography>
              <Typography variant="body2">Price: ₹{item.price}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 1 }}>
        <Typography>
          <strong>Total Amount:</strong> ₹{totalAmount}
        </Typography>
        <Typography>
          <strong>Payment:</strong> {paymentMethod}
        </Typography>
        <Typography>
          <strong>Address:</strong> {address}
        </Typography>
      </Box>

      <Box>
        <Button
          variant="outlined"
          href={`https://localhost:7040/api/Order/invoice/${order.id}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 2 }}
        >
          Download Invoice
        </Button>
      </Box>
    </Paper>
  );
};

export default Order;
