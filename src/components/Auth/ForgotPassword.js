import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setError('');

        try {
            const apiUrl = process.env.REACT_APP_API_URL || '';
            const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset email');
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
                    Forgot Password
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                    Enter your email address and we'll send you a link to reset your password.
                </Typography>

                {status === 'success' ? (
                    <>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Password reset instructions have been sent to your email.
                        </Alert>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/login')}
                            >
                                Back to Login
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            sx={{ mt: 1 }}
                            onClick={() => navigate('/login')}
                        >
                            Back to Login
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ForgotPassword; 