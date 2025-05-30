import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RestaurantRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cuisine: '',
    logo: null,
    brandColor: '#1976d2',
  });
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Get restaurant location from address
    const getLocationFromAddress = async () => {
      if (formData.address && formData.city && formData.state && formData.zipCode) {
        const address = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          if (data.results && data.results[0]) {
            const { lat, lng } = data.results[0].geometry.location;
            setLocation({ latitude: lat, longitude: lng });
          }
        } catch (err) {
          console.error('Error getting location:', err);
        }
      }
    };

    getLocationFromAddress();
  }, [formData.address, formData.city, formData.state, formData.zipCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        logo: e.target.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create restaurant document
      let logoUrl = '';
      if (formData.logo) {
        const storage = getStorage();
        const logoRef = ref(storage, `restaurants/${userCredential.user.uid}/logo`);
        await uploadBytes(logoRef, formData.logo);
        logoUrl = await getDownloadURL(logoRef);
      }
      const restaurantData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        cuisine: formData.cuisine,
        location,
        createdAt: new Date().toISOString(),
        passesIssued: 0,
        activePromotions: [],
        subscriptionStatus: 'trial',
        logo: logoUrl,
        brandColor: formData.brandColor,
        ownerId: userCredential.user.uid,
        status: 'pending',
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'restaurants', userCredential.user.uid), restaurantData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register Your Restaurant
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Restaurant Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="ZIP Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Cuisine Type"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                disabled={loading}
              >
                Upload Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </Button>
              {formData.logo && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {formData.logo.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Brand Color"
                name="brandColor"
                type="color"
                value={formData.brandColor}
                onChange={handleChange}
                sx={{ height: '56px' }}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !location}
              >
                {loading ? <CircularProgress size={24} /> : 'Register Restaurant'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RestaurantRegistration; 