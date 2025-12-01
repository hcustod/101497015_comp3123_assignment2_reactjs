import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/Work";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, #1d4ed8 0, #020617 45%, #020617 100%)",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(90deg, #020617, #0f172a 40%, #1d4ed8)",
          borderBottom: "1px solid rgba(148,163,184,0.3)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              edge="start"
              color="inherit"
              sx={{
                bgcolor: "rgba(15,23,42,0.9)",
                borderRadius: 2,
                "&:hover": { bgcolor: "rgba(30,64,175,0.9)" },
              }}
            >
              <WorkOutlineIcon />
            </IconButton>
            <Typography variant="h6" sx={{ letterSpacing: 0.6 }}>
              Employee Management System
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              color="inherit"
              component={Link}
              to="/employees"
              sx={{ fontSize: 14, opacity: 0.9 }}
            >
              Employees
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              sx={{
                ml: 1,
                borderRadius: 999,
                borderColor: "rgba(248,250,252,0.4)",
                px: 2.5,
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
