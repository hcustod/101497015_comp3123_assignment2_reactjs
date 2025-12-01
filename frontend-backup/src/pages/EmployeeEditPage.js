import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const EmployeeEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // employee_id

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
  const [currentProfilePicture, setCurrentProfilePicture] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchEmployee = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/emp/employees/${id}`);
      const emp = response.data;
      setFormValues({
        first_name: emp.first_name || '',
        last_name: emp.last_name || '',
        email: emp.email || '',
        position: emp.position || '',
        salary: emp.salary || '',
        date_of_joining: emp.date_of_joining
          ? emp.date_of_joining.slice(0, 10)
          : '',
        department: emp.department || '',
      });
      setCurrentProfilePicture(emp.profile_picture || null);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || 'Failed to load employee.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
    setSaving(true);

    try {
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (profilePictureFile) {
        formData.append('profile_picture', profilePictureFile);
      }

      await api.put(`/emp/employees/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg('Employee updated successfully.');
      setTimeout(() => navigate('/employees'), 1000);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        'Failed to update employee.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4 }}>
        <Typography>Loading employee...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Edit Employee
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

      {currentProfilePicture && (
        <Box mb={2}>
          <Typography variant="body2">Current Profile Picture:</Typography>
          <img
            src={`http://localhost:5000${currentProfilePicture}`}
            alt="Profile"
            style={{ maxWidth: '150px', marginTop: '8px' }}
          />
        </Box>
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
            New Profile Picture (optional)
          </Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Paper>
  );
};

export default EmployeeEditPage;
