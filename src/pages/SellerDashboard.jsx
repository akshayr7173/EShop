import React, { useEffect, useState } from "react";
import {
  Box, Button, Typography, Grid, Card, CardMedia, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Paper
} from "@mui/material";
import axios from "axios";

const SellerDashboard = () => {
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", description: "", price: "", imageUrl: "",
    category: "", quantity: ""
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://localhost:7040/api/Seller/MyProducts", { headers });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch seller products", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://localhost:7040/api/Order/SellerOrders", { headers });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch seller orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProductUpload = async () => {
    try {
      await axios.post("https://localhost:7040/api/Seller/UploadProduct", formData, { headers });
      setOpenUpload(false);
      setFormData({ name: "", description: "", price: "", imageUrl: "", category: "", quantity: "" });
      fetchMyProducts();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`https://localhost:7040/api/Seller/DeleteProduct/${id}`, { headers });
      fetchMyProducts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    if (tab === 0) fetchMyProducts();
    if (tab === 1) fetchSellerOrders();
  }, [tab]);

  const renderOrdersTable = () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Order ID</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell>Product</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.customerName || "N/A"}</TableCell>
            <TableCell>{order.productName}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Seller Dashboard</Typography>

      <Tabs value={tab} onChange={(e, val) => setTab(val)} sx={{ mb: 2 }}>
        <Tab label="My Products" />
        <Tab label="Orders Received" />
      </Tabs>

      {loading ? (
        <CircularProgress sx={{ mt: 3 }} />
      ) : (
        <>
          {tab === 0 && (
            <>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" onClick={() => setOpenUpload(true)}>
                  Upload New Product
                </Button>
              </Box>

              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="160"
                        image={product.imageUrl}
                        alt={product.name}
                      />
                      <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography variant="body2">₹{product.price}</Typography>
                        <Typography variant="body2">{product.category}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button color="error" onClick={() => deleteProduct(product.id)}>Delete</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {tab === 1 && (
            <Paper sx={{ mt: 2, p: 2 }}>
              {orders.length > 0 ? renderOrdersTable() : <Typography>No orders yet.</Typography>}
            </Paper>
          )}
        </>
      )}

      {/* Upload Product Modal */}
      <Dialog open={openUpload} onClose={() => setOpenUpload(false)}>
        <DialogTitle>Upload New Product</DialogTitle>
        <DialogContent>
          {["name", "description", "price", "imageUrl", "category", "quantity"].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              fullWidth
              value={formData[field]}
              onChange={handleInputChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpload(false)}>Cancel</Button>
          <Button onClick={handleProductUpload} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SellerDashboard;
