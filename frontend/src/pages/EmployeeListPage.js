import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Chip,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const EmployeeListPage = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // search fields
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [name, setName] = useState("");

  const fetchEmployees = async (useSearch = false) => {
    setLoading(true);
    setError("");

    try {
      let response;

      if (useSearch && (department || position || name)) {
        const params = {};
        if (department) params.department = department;
        if (position) params.position = position;
        if (name) params.name = name;

        response = await api.get("/emp/employees/search", { params });
      } else {
        response = await api.get("/emp/employees");
      }

      setEmployees(response.data || []);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to load employees.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(false);
  }, []);

  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await api.delete("/emp/employees", {
        params: { eid: employeeId },
      });
      setEmployees((prev) =>
        prev.filter((emp) => emp.employee_id !== employeeId)
      );
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Failed to delete employee.";
      alert(message);
    }
  };

  const handleAddEmployee = () => {
    navigate("/employees/add");
  };

  const handleViewEmployee = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/employees/${employeeId}/edit`);
  };

  const handleSearch = () => {
    fetchEmployees(true);
  };

  const handleClearSearch = () => {
    setDepartment("");
    setPosition("");
    setName("");
    fetchEmployees(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* main card */}
      <Box
        sx={{
          borderRadius: 5,
          p: 4,
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.9))",
          boxShadow: "0 30px 80px rgba(15,23,42,0.9)",
          border: "1px solid rgba(148,163,184,0.4)",
        }}
      >
        {/* header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h5" sx={{ color: "#e5e7eb" }}>
              Employee List
            </Typography>
            <Chip
              label={`${employees.length} employee${
                employees.length === 1 ? "" : "s"
              }`}
              size="small"
              sx={{
                mt: 0.75,
                backgroundColor: "rgba(16,185,129,0.15)",
                color: "#6ee7b7",
                borderRadius: 999,
              }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleAddEmployee}
            sx={{
              borderRadius: 999,
              px: 3,
              boxShadow: "0 12px 30px rgba(59,130,246,0.6)",
              background: "linear-gradient(90deg,#3b82f6,#2563eb)",
              "&:hover": {
                background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
              },
            }}
          >
            Add Employee
          </Button>
        </Box>

        {/* filters */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 2.5,
            borderRadius: 3,
            bgcolor: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(148,163,184,0.4)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              variant="outlined"
              sx={{ bgcolor: "rgba(15,23,42,0.9)", borderRadius: 2 }}
            />
            <TextField
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              size="small"
              variant="outlined"
              sx={{ bgcolor: "rgba(15,23,42,0.9)", borderRadius: 2 }}
            />
            <TextField
              label="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              size="small"
              variant="outlined"
              sx={{ bgcolor: "rgba(15,23,42,0.9)", borderRadius: 2 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ borderRadius: 999, px: 3 }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleClearSearch}
                sx={{ borderRadius: 999, px: 2.5 }}
              >
                Clear
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* states */}
        {loading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        )}

        {error && !loading && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && employees.length === 0 && (
          <Typography sx={{ mt: 3, color: "#e5e7eb" }}>
            No employees found.
          </Typography>
        )}

        {/* table */}
        {!loading && !error && employees.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              mt: 4,
              borderRadius: 3,
              bgcolor: "rgba(15,23,42,0.98)",
              overflow: "hidden",
              border: "1px solid rgba(15,23,42,0.9)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background:
                      "linear-gradient(90deg, rgba(15,23,42,1), rgba(30,64,175,0.85))",
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "#e5e7eb" }}>
                    Full Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#e5e7eb" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#e5e7eb" }}>
                    Department
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#e5e7eb" }}>
                    Position
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "#e5e7eb" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp, index) => (
                  <TableRow
                    key={emp.employee_id}
                    sx={{
                      backgroundColor:
                        index % 2 === 0
                          ? "rgba(15,23,42,0.98)"
                          : "rgba(15,23,42,0.9)",
                    }}
                  >
                    <TableCell sx={{ color: "#e5e7eb" }}>
                      {emp.first_name} {emp.last_name}
                    </TableCell>
                    <TableCell sx={{ color: "#cbd5f5" }}>
                      {emp.email}
                    </TableCell>
                    <TableCell sx={{ color: "#cbd5f5" }}>
                      {emp.department}
                    </TableCell>
                    <TableCell sx={{ color: "#cbd5f5" }}>
                      {emp.position}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        sx={{ mr: 1, borderRadius: 999 }}
                        variant="outlined"
                        onClick={() => handleViewEmployee(emp.employee_id)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        sx={{ mr: 1, borderRadius: 999 }}
                        variant="outlined"
                        onClick={() => handleEditEmployee(emp.employee_id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ borderRadius: 999 }}
                        onClick={() => handleDelete(emp.employee_id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default EmployeeListPage;
