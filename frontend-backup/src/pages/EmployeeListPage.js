import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const EmployeeListPage = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search fields
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');

  const fetchEmployees = async (useSearch = false) => {
    setLoading(true);
    setError('');

    try {
      let response;
      if (useSearch && (department || position)) {
        response = await api.get('/emp/employees/search', {
          params: { department, position },
        });
      } else {
        response = await api.get('/emp/employees');
      }
      setEmployees(response.data || []);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to load employees.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await api.delete('/emp/employees', {
        params: { eid: employeeId },
      });
      setEmployees((prev) =>
        prev.filter((emp) => emp.employee_id !== employeeId)
      );
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        'Failed to delete employee.';
      alert(message);
    }
  };

  const handleAddEmployee = () => {
    navigate('/employees/add');
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
    setDepartment('');
    setPosition('');
    fetchEmployees(false);
  };

  return (
    <Paper sx={{ padding: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Employee List
        </Typography>
        <Button variant="contained" onClick={handleAddEmployee}>
          Add Employee
        </Button>
      </Box>

      {/* Search filters */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <TextField
          label="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleClearSearch}>
          Clear
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && employees.length === 0 && (
        <Typography>No employees found.</Typography>
      )}

      {!loading && !error && employees.length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.employee_id}>
                  <TableCell>
                    {emp.first_name} {emp.last_name}
                  </TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      sx={{ mr: 1 }}
                      variant="outlined"
                      onClick={() => handleViewEmployee(emp.employee_id)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      sx={{ mr: 1 }}
                      variant="outlined"
                      onClick={() => handleEditEmployee(emp.employee_id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
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
    </Paper>
  );
};

export default EmployeeListPage;
