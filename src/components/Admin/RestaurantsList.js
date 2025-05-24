import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Chip,
    Button
} from '@mui/material';
import { Edit, Delete, Visibility, Block, CheckCircle } from '@mui/icons-material';

const RestaurantsList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || '';
            const response = await fetch(`${apiUrl}/api/admin/restaurants`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }

            const data = await response.json();
            setRestaurants(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (restaurantId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || '';
            const response = await fetch(`${apiUrl}/api/admin/restaurants/${restaurantId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update restaurant status');
            }

            // Update local state
            setRestaurants(restaurants.map(restaurant =>
                restaurant._id === restaurantId ? { ...restaurant, status: newStatus } : restaurant
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                    Restaurants Management
                </Typography>
                <Button variant="contained" color="primary">
                    Add Restaurant
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Subscription</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {restaurants.map((restaurant) => (
                            <TableRow key={restaurant._id}>
                                <TableCell>{restaurant.name}</TableCell>
                                <TableCell>{restaurant.owner.email}</TableCell>
                                <TableCell>
                                    {`${restaurant.address.city}, ${restaurant.address.state}`}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={restaurant.subscriptionStatus}
                                        color={
                                            restaurant.subscriptionStatus === 'active'
                                                ? 'success'
                                                : restaurant.subscriptionStatus === 'trial'
                                                ? 'warning'
                                                : 'error'
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={restaurant.status}
                                        color={restaurant.status === 'active' ? 'success' : 'error'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(restaurant.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small">
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleStatusChange(restaurant._id, 'active')}
                                        disabled={restaurant.status === 'active'}
                                    >
                                        <CheckCircle color="success" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleStatusChange(restaurant._id, 'blocked')}
                                        disabled={restaurant.status === 'blocked'}
                                    >
                                        <Block color="error" />
                                    </IconButton>
                                    <IconButton size="small">
                                        <Edit />
                                    </IconButton>
                                    <IconButton size="small">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default RestaurantsList; 