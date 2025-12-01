import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const EmployeeAddPage = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
    salary: '',
    date_of_joining: '',
    department: '',
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfilePictureFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (profilePictureFile) {
        formData.append('profile_picture', profilePictureFile);
      }

      await api.post('/emp/employees', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg('Employee created successfully.');
      setTimeout(() => navigate('/employees'), 1000);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        'Failed to create employee.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Add Employee
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
          label="First Name"
          name="first_name"
          fullWidth
          margin="normal"
          required
          value={formValues.first_name}
          onChange={handleChange}
        />
        <TextField
          label="Last Name"
          name="last_name"
          fullWidth
          margin="normal"
          required
          value={formValues.last_name}
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
          label="Position"
          name="position"
          fullWidth
          margin="normal"
          required
          value={formValues.position}
          onChange={handleChange}
        />
        <TextField
          label="Salary"
          name="salary"
          fullWidth
          margin="normal"
          required
          type="number"
          value={formValues.salary}
          onChange={handleChange}
        />
        <TextField
          label="Date of Joining"
          name="date_of_joining"
          type="date"
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
          value={formValues.date_of_joining}
          onChange={handleChange}
        />
        <TextField
          label="Department"
          name="department"
          fullWidth
          margin="normal"
          required
          value={formValues.department}
          onChange={handleChange}
        />

        <Box mt={2}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Profile Picture (optional)
          </Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Employee'}
        </Button>
      </Box>
    </Paper>
  );
};

export default EmployeeAddPage;
