import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Grid,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { employeeAPI } from '../services/api';

const ViewEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);
                const response = await employeeAPI.getEmployee(id);
                setEmployee(response.data);
            } catch (err) {
                setError('Failed to fetch employee details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const getStatusColor = (status) => {
        const colors = {
            active: 'success',
            'on-leave': 'warning',
            terminated: 'error',
            resigned: 'default'
        };
        return colors[status] || 'default';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">{error}</Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/employees')}
                    sx={{ mt: 2 }}
                >
                    Back to Employees
                </Button>
            </Container>
        );
    }

    if (!employee) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="warning">Employee not found</Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/employees')}
                    sx={{ mt: 2 }}
                >
                    Back to Employees
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/employees')}
                    sx={{ mb: 2 }}
                >
                    Back to Employees
                </Button>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Employee Details
                </Typography>
            </Box>

            <Paper sx={{ p: 4 }}>
                <Grid container spacing={3}>
                    {/* Personal Information */}
                    <Grid size={12}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Personal Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={employee.firstName || ''}
                            disabled
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={employee.lastName || ''}
                            disabled
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={employee.email || ''}
                            disabled
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Phone"
                            value={employee.phone || ''}
                            disabled
                            variant="outlined"
                        />
                    </Grid>

                    {/* Work Information */}
                    <Grid size={12}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', mt: 2 }}>
                            Work Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Employee ID"
                            value={employee.employeeId || ''}
                            disabled
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Position"
                            value={employee.position || ''}
                            disabled
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Department"
                            value={employee.department || ''}
                            disabled
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Salary"
                            value={employee.salary ? `$${employee.salary.toLocaleString()}` : ''}
                            disabled
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Joining Date"
                            value={employee.joiningDate ? formatDate(employee.joiningDate) : ''}
                            disabled
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">Status:</Typography>
                            <Chip
                                label={employee.status ? employee.status.charAt(0).toUpperCase() + employee.status.slice(1) : 'Unknown'}
                                color={getStatusColor(employee.status)}
                                variant="outlined"
                            />
                        </Box>
                    </Grid>

                    {/* Address Information */}
                    {employee.address && typeof employee.address === 'object' && (
                        <>
                            <Grid size={12}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', mt: 2 }}>
                                    Address Information
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Street Address"
                                    value={employee.address.street || ''}
                                    disabled
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={employee.address.city || ''}
                                    disabled
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    value={employee.address.state || ''}
                                    disabled
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Zip Code"
                                    value={employee.address.zipCode || ''}
                                    disabled
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    value={employee.address.country || ''}
                                    disabled
                                    variant="outlined"
                                />
                            </Grid>
                        </>
                    )}

                    {/* Action Buttons */}
                    <Grid size={12} sx={{ mt: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate(`/employees/edit/${employee._id}`)}
                            >
                                Edit Employee
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/employees')}
                            >
                                Back to List
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ViewEmployee;
