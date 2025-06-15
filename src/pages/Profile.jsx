import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`https://localhost:7040/api/User/${userId}`);
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await axios.put(`https://localhost:7040/api/User/${userId}`, user);
      alert("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Failed to update profile.");
    }
  };

  const handleEditToggle = () => setEditing((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const goToOrders = () => {
    navigate("/my-orders");
  };

  const becomeSeller = async () => {
    try {
      await axios.post(
        `https://localhost:7040/api/User/BecomeSeller`,
        { userId },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("You are now a seller!");
      navigate("/dashboard"); // or seller dashboard route
    } catch (err) {
      console.error("Failed to become seller", err);
      alert("Failed to become a seller.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              fullWidth
              disabled={!editing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={user.address || ""}
              onChange={handleChange}
              fullWidth
              disabled={!editing}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              fullWidth
              disabled={!editing}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {editing ? (
            <>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleEditToggle}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" onClick={handleEditToggle}>
                Edit Profile
              </Button>
              <Button variant="contained" onClick={goToOrders}>
                My Orders
              </Button>
              <Button variant="contained" onClick={becomeSeller}>
                Become a Seller
              </Button>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
