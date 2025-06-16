import { useState } from "react";
import { Container, TextField, Button, Typography, Box, Link } from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/Auth/register", form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. " + err?.response?.data);
    }
};

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField label="Name" name="name" onChange={handleChange} fullWidth />
        <TextField label="Email" name="email" onChange={handleChange} fullWidth />
        <TextField label="Password" name="password" type="password" onChange={handleChange} fullWidth />
        <TextField label="Address" name="address" onChange={handleChange} fullWidth />
        <Button variant="contained" onClick={handleSubmit}>Register</Button>
        <Typography variant="body2" align="center">
          Already have an account?{" "}
          <Link onClick={() => navigate("/login")} sx={{ cursor: "pointer" }}>
            Log in
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
