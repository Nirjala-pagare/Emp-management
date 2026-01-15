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
    MenuItem,
    Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { employeeAPI } from '../services/api';

const EditEmployeeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        salary: '',
        joiningDate: '',
        status: 'active',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        }
    });

    const departments = [
        'HR',
        'IT',
        'Sales',
        'Marketing',
        'Finance',
        'Operations',
        'Customer Service',
        'Engineering',
        'Product',
        'Design',
        'Legal',
        'Admin'
    ];

    const statusOptions = ['active', 'on-leave', 'terminated', 'resigned'];

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);
                const response = await employeeAPI.getEmployee(id);
                const emp = response.data;
                setEmployee(emp);

                // Normalize address to object
                const normalizedAddress = typeof emp.address === 'object' && emp.address !== null
                    ? emp.address
                    : { street: '', city: '', state: '', zipCode: '', country: '' };

                setFormData({
                    firstName: emp.firstName || '',
                    lastName: emp.lastName || '',
                    email: emp.email || '',
                    phone: emp.phone || '',
                    position: emp.position || '',
                    department: emp.department || '',
                    salary: emp.salary || '',
                    joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '',
                    status: emp.status || 'active',
                    address: {
                        street: normalizedAddress.street || '',
                        city: normalizedAddress.city || '',
                        state: normalizedAddress.state || '',
                        zipCode: normalizedAddress.zipCode || '',
                        country: normalizedAddress.country || ''
                    }
                });
            } catch (err) {
                setError('Failed to fetch employee details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Handle nested address fields
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError('First name and last name are required');
            return;
        }

        if (!formData.email.trim()) {
            setError('Email is required');
            return;
        }

        if (!formData.position.trim()) {
            setError('Position is required');
            return;
        }

        if (!formData.department) {
            setError('Department is required');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            setSuccess('');

            const updateData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                position: formData.position.trim(),
                department: formData.department,
                salary: formData.salary ? parseFloat(formData.salary) : 0,
                joiningDate: formData.joiningDate,
                status: formData.status,
                address: {
                    street: formData.address.street.trim(),
                    city: formData.address.city.trim(),
                    state: formData.address.state.trim(),
                    zipCode: formData.address.zipCode.trim(),
                    country: formData.address.country.trim()
                }
            };

            await employeeAPI.updateEmployee(id, updateData);
            setSuccess('Employee updated successfully!');
            setTimeout(() => {
                navigate(`/employees/view/${id}`);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update employee');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!employee) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">Employee not found</Alert>
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
                    onClick={() => navigate(`/employees/view/${id}`)}
                    sx={{ mb: 2 }}
                >
                    Back
                </Button>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Edit Employee
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Paper sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
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
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
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
                                label="Position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                select
                                value={formData.department}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            >
                                {departments.map(dept => (
                                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleChange}
                                variant="outlined"
                                inputProps={{ step: '0.01' }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Joining Date"
                                name="joiningDate"
                                type="date"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Status"
                                name="status"
                                select
                                value={formData.status}
                                onChange={handleChange}
                                variant="outlined"
                            >
                                {statusOptions.map(status => (
                                    <MenuItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Address Information */}
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
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="City"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="State"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Zip Code"
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Country"
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        {/* Action Buttons */}
                        <Grid size={12} sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Updating...' : 'Update Employee'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(`/employees/view/${id}`)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default EditEmployeeForm;
