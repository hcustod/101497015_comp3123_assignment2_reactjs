import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api, { FILE_BASE_URL } from "../utils/api";

const EmployeeDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`/emp/employees/${id}`);
      setEmployee(response.data);
    } catch (err) {
      console.error("Failed to fetch employee:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!employee) {
    return <Typography>No employee found.</Typography>;
  }

  const imageUrl = employee.profile_picture
    ? `${FILE_BASE_URL}${employee.profile_picture}`
    : "";

  const joiningDate = employee.date_of_joining
    ? new Date(employee.date_of_joining).toLocaleDateString()
    : "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 6,
        background: "transparent",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "85%",
          maxWidth: "1300px",
          p: 6,
          borderRadius: "40px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          color: "white",
        }}
      >
        {/* Top Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="700">
            {employee.first_name} {employee.last_name}
          </Typography>

          <Box
            sx={{
              padding: "6px 18px",
              borderRadius: "40px",
              border: "1px solid rgba(255,255,255,0.3)",
              fontSize: "0.9rem",
            }}
          >
            {employee.position}
          </Box>
        </Box>

        <Typography
          variant="subtitle1"
          sx={{ mt: 1, opacity: 0.7, fontSize: "1rem" }}
        >
          Employee Details
        </Typography>

        <Box sx={{ mt: 4, width: "100%", borderBottom: "1px solid #3a4a7a" }} />

        {/* item row */}
        <Box
          sx={{
            display: "flex",
            mt: 5,
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {/* image */}
          <Box
            sx={{
              width: "280px",
              height: "280px",
              borderRadius: "30px",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={imageUrl}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>

          {/* info */}
          <Box
            sx={{
              flexGrow: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              rowGap: 3,
              columnGap: 6,
              alignItems: "center",
              fontSize: "1rem",
            }}
          >
            <Box>
              <Typography sx={{ opacity: 0.7 }}>Email</Typography>
              <Typography variant="h6">{employee.email}</Typography>
            </Box>

            <Box>
              <Typography sx={{ opacity: 0.7 }}>Department</Typography>
              <Typography variant="h6">{employee.department}</Typography>
            </Box>

            <Box>
              <Typography sx={{ opacity: 0.7 }}>Salary</Typography>
              <Typography variant="h6">${employee.salary}</Typography>
            </Box>

            <Box>
              <Typography sx={{ opacity: 0.7 }}>Date of Joining</Typography>
              <Typography variant="h6">{joiningDate}</Typography>
            </Box>
          </Box>
        </Box>

        {/* buttons */}
        <Box
          sx={{
            mt: 6,
            display: "flex",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.4)",
              px: 4,
              py: 1,
              borderRadius: "30px",
              "&:hover": {
                borderColor: "white",
                background: "rgba(255,255,255,0.1)",
              },
            }}
            onClick={() => navigate(`/employees/${employee.employee_id}/edit`)}
          >
            Edit
          </Button>

          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #3763f4, #2d86ff)",
              px: 4,
              py: 1,
              borderRadius: "30px",
              "&:hover": {
                background: "linear-gradient(90deg, #2f55d4, #2572e6)",
              },
            }}
            onClick={() => navigate("/employees")}
          >
            Back to List
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeDetailsPage;
