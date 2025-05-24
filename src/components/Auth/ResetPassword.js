import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Alert, Box } from '@mui/material';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setStatus('error');
            return;
        }

        try {
            const apiUrl = process.env.REACT_APP_API_URL || '';
            const response = await fetch(`${apiUrl}/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            setStatus('success');
        } catch (err) {
            setStatus('error');
            setError(err.message);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Reset Password
                </Typography>

                {status === 'success' ? (
                    <>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Password has been reset successfully.
                        </Alert>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/login')}
                            >
                                Proceed to Login
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={status === 'loading'}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={status === 'loading'}
                        />
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3 }}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ResetPassword; 