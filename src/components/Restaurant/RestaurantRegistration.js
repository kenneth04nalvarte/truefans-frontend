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
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from 'firebase/auth';

const RestaurantRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cuisine: '',
    logo: null,
    brandColor: '#1976d2',
    promotionalText: '',
  });
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      console.log("Auth state changed, user:", firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!user) {
        setError("You must be logged in to register a restaurant.");
        setLoading(false);
        return;
      }
      console.log("Current user before logo upload:", user);
      // TEMP: Bypass geocoding/location for testing
      // const location = { latitude: 0, longitude: 0 };
      // Create restaurant document
      let logoUrl = '';
      if (formData.logo) {
        const storage = getStorage();
        const logoRef = ref(storage, `restaurants/${Date.now()}/logo`);
        await uploadBytes(logoRef, formData.logo);
        logoUrl = await getDownloadURL(logoRef);
      }
      const restaurantData = {
        ownerId: user.uid,
        name: formData.name,
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
        promotionalText: formData.promotionalText,
        status: 'pending',
        updatedAt: new Date().toISOString()
      };
      // Use a random id for the restaurant
      const restaurantId = `rest_${Date.now()}`;
      await setDoc(doc(db, 'restaurants', restaurantId), restaurantData);
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
              <TextField
                required
                fullWidth
                label="Promotional Text"
                name="promotionalText"
                value={formData.promotionalText}
                onChange={handleChange}
                disabled={loading}
                helperText="This text will be shown to your customers and can be edited anytime."
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