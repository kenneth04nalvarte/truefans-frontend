import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
import UsersList from './UsersList';
import RestaurantsList from './RestaurantsList';
import Analytics from './Analytics';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRestaurants: 0,
        activeSubscriptions: 0,
        totalPasses: 0
    });
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.REACT_APP_API_URL || '';
                const response = await fetch(`${apiUrl}/api/admin/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard stats');
                }

                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Total Users
                        </Typography>
                        <Typography component="p" variant="h4">
                            {stats.totalUsers}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Total Restaurants
                        </Typography>
                        <Typography component="p" variant="h4">
                            {stats.totalRestaurants}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Active Subscriptions
                        </Typography>
                        <Typography component="p" variant="h4">
                            {stats.activeSubscriptions}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Total Passes
                        </Typography>
                        <Typography component="p" variant="h4">
                            {stats.totalPasses}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Tabs */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Tabs
                            value={currentTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="Users" />
                            <Tab label="Restaurants" />
                            <Tab label="Analytics" />
                        </Tabs>
                    </Paper>
                </Grid>

                {/* Tab Content */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        {currentTab === 0 && <UsersList />}
                        {currentTab === 1 && <RestaurantsList />}
                        {currentTab === 2 && <Analytics />}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 