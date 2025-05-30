import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const referralOptions = [
  'Social Media',
  'Friend/Family',
  'Online Search',
  'Walk-in',
  'Other'
];

const DinerRegistration = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    heardAbout: '',
    birthday: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passUrl, setPassUrl] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    // Request location permission when component mounts
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission(true),
        () => setLocationPermission(false)
      );
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Get current location if permission granted
      let location = null;
      if (locationPermission) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp
        };
      }

      await addDoc(collection(db, 'diners'), {
        ...form,
        restaurantId,
        birthday: form.birthday ? Timestamp.fromDate(new Date(form.birthday)) : null,
        createdAt: Timestamp.now(),
        location,
        locationPermission
      });

      // Call backend to generate pass
      const response = await axios.post(`${BACKEND_URL}/api/digital-passes/generate`, {
        name: form.name,
        phone: form.phone,
        birthday: form.birthday,
        restaurantId,
        location
      });
      if (response.data.success) {
        setPassUrl(response.data.downloadUrl);
      }
      setSuccess(true);
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    if (confirmed) {
      return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for registering! Your digital pass has been added to your wallet.
          </Alert>
          <Typography variant="h5" gutterBottom>
            Show this pass at the restaurant to earn rewards and enjoy exclusive offers!
          </Typography>
          {locationPermission && (
            <Alert severity="info" sx={{ mb: 3 }}>
              You will receive notifications when you are near the restaurant.
            </Alert>
          )}
          <Button variant="contained" color="primary" size="large" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </Container>
      );
    }
    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Registration successful! Add your digital pass to your phone below.
        </Alert>
        {passUrl ? (
          <Button
            variant="contained"
            color="success"
            size="large"
            href={passUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setConfirmed(true)}
          >
            Download Your Pass
          </Button>
        ) : (
          <Typography>Generating your pass...</Typography>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Join Our Loyalty Program
      </Typography>
      <Typography variant="body1" paragraph align="center" color="text.secondary">
        Register to receive your digital pass and start earning rewards!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Birthday"
          name="birthday"
          type="date"
          value={form.birthday}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          select
          label="How did you hear about us?"
          name="heardAbout"
          value={form.heardAbout}
          onChange={handleChange}
          margin="normal"
        >
          {referralOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        {!locationPermission && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Enable location services to receive notifications when you&apos;re near the restaurant.
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </form>
    </Container>
  );
};

export default DinerRegistration; 