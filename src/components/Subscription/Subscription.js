import React from 'react';
import { Container, Paper, Typography, Button, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Subscription = () => {
  const handleSubscribe = async () => {
    // try {
    //   const res = await fetch('/api/stripe/create-checkout-session', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    //   const data = await res.json();
    //   if (!data.sessionId) throw new Error('Failed to create Stripe session');
    //   const stripe = await stripePromise;
    //   await stripe.redirectToCheckout({ sessionId: data.sessionId });
    // } catch (err) {
    //   alert('Stripe Checkout error: ' + err.message);
    // }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Upgrade to Premium
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          $9/month
        </Typography>
        <Typography variant="body1" paragraph>
          Unlock all premium features for your restaurant:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
            <ListItemText primary="See pass uploads and diner analytics" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
            <ListItemText primary="Edit promo texts anytime" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
            <ListItemText primary="Keep QR codes active for diners to scan and upload passes" />
          </ListItem>
        </List>
        <Box mt={4}>
          <Button variant="contained" color="primary" size="large" onClick={handleSubscribe}>
            Subscribe with Stripe
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Subscription; 