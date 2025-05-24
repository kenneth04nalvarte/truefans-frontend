import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || '';
                const response = await fetch(`${apiUrl}/api/auth/verify-email/${token}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Verification failed');
                }

                setStatus('success');
            } catch (err) {
                setStatus('error');
                setError(err.message);
            }
        };

        verifyEmail();
    }, [token]);

    const renderContent = () => {
        switch (status) {
            case 'verifying':
                return (
                    <>
                        <CircularProgress size={60} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Verifying your email...
                        </Typography>
                    </>
                );
            case 'success':
                return (
                    <>
                        <CheckCircle color="success" sx={{ fontSize: 60 }} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Email verified successfully!
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/login')}
                        >
                            Proceed to Login
                        </Button>
                    </>
                );
            case 'error':
                return (
                    <>
                        <Error color="error" sx={{ fontSize: 60 }} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Verification failed
                        </Typography>
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/login')}
                        >
                            Back to Login
                        </Button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                {renderContent()}
            </Paper>
        </Container>
    );
};

export default VerifyEmail; 