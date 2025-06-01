import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppBar, Box, Button, Container, Grid, IconButton, Paper, Tab, Tabs, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const mockBrand = { name: 'Taco Bros' };
const mockLocations = [
  { id: '1', name: 'Main St.' },
  { id: '2', name: '2nd Ave.' },
];
const mockPasses = [
  { id: '1', name: 'Empanada Pass' },
];

const BrandManager = () => {
  const navigate = useNavigate();
  const { brandId } = useParams();
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{mockBrand.name}</Typography>
          <Box>
            <Button onClick={() => navigate(-1)} sx={{ mr: 2 }}>Back</Button>
            <IconButton><AccountCircleIcon /></IconButton>
          </Box>
        </Box>
        <AppBar position="static" color="default" sx={{ mb: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Locations" />
            <Tab label="Digital Passes" />
            <Tab label="Settings" />
          </Tabs>
        </AppBar>
        {tab === 0 && (
          <Box>
            <Typography variant="subtitle1">Locations:</Typography>
            {mockLocations.map(loc => (
              <Grid container alignItems="center" spacing={2} key={loc.id} sx={{ mb: 1 }}>
                <Grid item xs={6}>{loc.name}</Grid>
                <Grid item xs={6}>
                  <Button size="small">Edit</Button>
                  <Button size="small" color="error">Remove</Button>
                </Grid>
              </Grid>
            ))}
            <Button variant="contained" sx={{ mt: 2 }}>Add New Location</Button>
          </Box>
        )}
        {tab === 1 && (
          <Box>
            <Typography variant="subtitle1">Digital Passes:</Typography>
            {mockPasses.map(pass => (
              <Grid container alignItems="center" spacing={2} key={pass.id} sx={{ mb: 1 }}>
                <Grid item xs={6}>{pass.name}</Grid>
                <Grid item xs={6}>
                  <Button size="small">Edit</Button>
                  <Button size="small" color="warning">Deactivate</Button>
                  <Button size="small">View</Button>
                </Grid>
              </Grid>
            ))}
            <Button variant="contained" sx={{ mt: 2 }}>Create New Pass</Button>
          </Box>
        )}
        {tab === 2 && (
          <Box>
            <Typography>Settings coming soon...</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BrandManager; 