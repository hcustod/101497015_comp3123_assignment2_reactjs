import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Alert, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`/emp/employees/${id}`);
      setEmployee(response.data);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        'Failed to load employee details.';
      setError(message);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  if (error) {
    return (
      <Paper sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  if (!employee) {
    return (
      <Paper sx={{ p: 4 }}>
        <Typography>Loading employee details...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Employee Details
      </Typography>

      {employee.profile_picture && (
        <Box mb={2}>
          <img
            src={`http://localhost:5001${employee.profile_picture}`}
            alt="Profile"
            style={{ maxWidth: '150px' }}
          />
        </Box>
      )}

      <Typography><strong>Name:</strong> {employee.first_name} {employee.last_name}</Typography>
      <Typography><strong>Email:</strong> {employee.email}</Typography>
      <Typography><strong>Department:</strong> {employee.department}</Typography>
      <Typography><strong>Position:</strong> {employee.position}</Typography>
      <Typography><strong>Salary:</strong> {employee.salary}</Typography>
      <Typography>
        <strong>Date of Joining:</strong>{' '}
        {employee.date_of_joining
          ? new Date(employee.date_of_joining).toLocaleDateString()
          : ''}
      </Typography>

      <Box mt={3}>
        <Button variant="outlined" onClick={() => navigate('/employees')}>
          Back to List
        </Button>
      </Box>
    </Paper>
  );
};

export default EmployeeDetailsPage;
