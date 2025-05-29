import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Alert, Snackbar } from '@mui/material';

const PROXIMITY_THRESHOLD = 500; // meters

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const ProximityNotifier = ({ dinerId }) => {
  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!dinerId) return;

    // Subscribe to diner's location updates
    const dinerQuery = query(
      collection(db, 'diners'),
      where('id', '==', dinerId)
    );

    const unsubscribe = onSnapshot(dinerQuery, async (snapshot) => {
      const diner = snapshot.docs[0]?.data();
      if (!diner || !diner.location) return;

      // Get all restaurants
      const restaurantsQuery = query(collection(db, 'restaurants'));
      const restaurantsSnapshot = await restaurantsQuery.get();
      
      restaurantsSnapshot.forEach((doc) => {
        const restaurant = doc.data();
        if (!restaurant.location) return;

        const distance = calculateDistance(
          diner.location.latitude,
          diner.location.longitude,
          restaurant.location.latitude,
          restaurant.location.longitude
        );

        if (distance <= PROXIMITY_THRESHOLD) {
          setNotification({
            message: `You're near ${restaurant.name}! Show your digital pass to earn rewards.`,
            restaurantId: doc.id
          });
          setShowNotification(true);
        }
      });
    });

    return () => unsubscribe();
  }, [dinerId]);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <Snackbar
      open={showNotification}
      autoHideDuration={6000}
      onClose={handleCloseNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleCloseNotification}
        severity="info"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};

export default ProximityNotifier; 