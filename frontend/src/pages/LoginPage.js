import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // /user/login either email or username can be used
      const response = await api.post("/user/login", {
        email: formValues.email,
        password: formValues.password,
      });

      const token = response.data?.jwt_token;
      if (!token) {
        throw new Error("No jwt_token returned from backend.");
      }

      localStorage.setItem("token", token);
      navigate("/employees");
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)", // below navbar
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        // IMPORTANT: no background here – we use Layout's gradient only
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          bgcolor: "rgba(15,23,42,0.96)",
          boxShadow: "0 40px 80px rgba(15,23,42,0.9)",
          border: "1px solid rgba(148,163,184,0.4)",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "#e5e7eb" }}>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            required
            type="email"
            value={formValues.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={formValues.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
