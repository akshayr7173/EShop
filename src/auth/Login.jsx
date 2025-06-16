import { useState } from "react";
import { Container, TextField, Button, Typography, Box, Link } from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
    try {
      const res = await api.post("/Auth/login", form);
      login(res.data, res.data.token); 
      navigate("/home");
    } catch (err) {
      alert("Login failed: " + err?.response?.data || err.message);
    }
};


  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField label="Email" name="email" onChange={handleChange} fullWidth />
        <TextField label="Password" name="password" type="password" onChange={handleChange} fullWidth />
        <Button variant="contained" onClick={handleSubmit}>Login</Button>
        <Typography variant="body2" align="center">
          New user?{" "}
          <Link onClick={() => navigate("/register")} sx={{ cursor: "pointer" }}>
            Register here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
