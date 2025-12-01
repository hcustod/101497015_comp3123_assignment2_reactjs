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

const SignupPage = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // POST /user/signup to create new user
      await api.post("/user/signup", {
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
      });

      setSuccessMsg("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        "Signup failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        // No background here either
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
          Signup
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            required
            value={formValues.username}
            onChange={handleChange}
          />
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
            {loading ? "Signing up..." : "Signup"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignupPage;
