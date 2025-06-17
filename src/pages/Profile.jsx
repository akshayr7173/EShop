import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Edit, 
  Store, 
  ShoppingBag, 
  Person,
  Email,
  LocationOn,
  Phone
} from "@mui/icons-material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const ProfileContainer = styled(Box)(({ theme }) => ({
  maxWidth: 900,
  margin: "auto",
  marginTop: theme.spacing(4),
  padding: theme.spacing(0, 2),
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
  }
}));

const ActionCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0284c7, #c026d3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
  }
}));

const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [editing, setEditing] = useState(false);
  const [openSellerDialog, setOpenSellerDialog] = useState(false);
  const [sellerForm, setSellerForm] = useState({
    shopName: "",
    shopAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/User/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      setError("Failed to load profile data");
    }
  };

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSellerFormChange = (e) =>
    setSellerForm({ ...sellerForm, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await api.put(`/User/${userId}`, user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error("Failed to update user", err);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeSeller = async () => {
    if (!sellerForm.shopName || !sellerForm.shopAddress) {
      setError("Please fill in all seller details");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/User/BecomeSeller", sellerForm, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccess("🎉 Congratulations! You are now a seller.");
      setOpenSellerDialog(false);
      setSellerForm({ shopName: "", shopAddress: "" });
      
      // Update local storage and redirect
      setTimeout(() => {
        localStorage.setItem("role", "Seller");
        window.location.reload(); // Refresh to update auth context
      }, 2000);
    } catch (err) {
      console.error("Failed to become seller", err);
      setError("Failed to register as seller. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <ProfileContainer>
      <ProfilePaper>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Person sx={{ fontSize: '2rem', color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            My Profile
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Full Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              fullWidth
              disabled={!editing}
              InputProps={{
                startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Email Address"
              name="email"
              value={user.email}
              onChange={handleChange}
              fullWidth
              disabled
              InputProps={{
                startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <StyledTextField
              label="Address"
              name="address"
              value={user.address || ""}
              onChange={handleChange}
              fullWidth
              disabled={!editing}
              multiline
              rows={2}
              InputProps={{
                startAdornment: <LocationOn sx={{ color: 'text.secondary', mr: 1, alignSelf: 'flex-start', mt: 1 }} />
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <StyledTextField
              label="Phone Number"
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              fullWidth
              disabled={!editing}
              InputProps={{
                startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {editing ? (
            <>
              <GradientButton 
                variant="contained" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </GradientButton>
              <Button 
                variant="outlined" 
                onClick={() => setEditing(false)}
                sx={{ borderRadius: '12px', textTransform: 'none' }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outlined" 
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
                sx={{ borderRadius: '12px', textTransform: 'none' }}
              >
                Edit Profile
              </Button>
              <Button 
                variant="contained" 
                startIcon={<ShoppingBag />}
                onClick={() => navigate("/orders")}
                sx={{ borderRadius: '12px', textTransform: 'none' }}
              >
                My Orders
              </Button>
              {user.role !== "Seller" && user.role !== "Admin" && (
                <GradientButton
                  variant="contained"
                  startIcon={<Store />}
                  onClick={() => setOpenSellerDialog(true)}
                >
                  Become a Seller
                </GradientButton>
              )}
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleLogout}
                sx={{ borderRadius: '12px', textTransform: 'none' }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </ProfilePaper>

      {/* Become Seller Dialog */}
      <Dialog 
        open={openSellerDialog} 
        onClose={() => setOpenSellerDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '20px', p: 2 }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Store sx={{ fontSize: '3rem', color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Become a Seller
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start selling your products on MyShop
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <StyledTextField
                label="Shop Name"
                name="shopName"
                value={sellerForm.shopName}
                onChange={handleSellerFormChange}
                fullWidth
                required
                placeholder="Enter your shop name"
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                label="Shop Address"
                name="shopAddress"
                value={sellerForm.shopAddress}
                onChange={handleSellerFormChange}
                fullWidth
                required
                multiline
                rows={3}
                placeholder="Enter your shop address"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenSellerDialog(false)}
            sx={{ borderRadius: '12px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <GradientButton
            onClick={handleBecomeSeller}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register as Seller'}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </ProfileContainer>
  );
};

export default Profile;