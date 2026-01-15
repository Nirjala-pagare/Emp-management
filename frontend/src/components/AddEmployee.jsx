import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { employeeAPI } from '../services/api';

const schema = yup.object().shape({
    firstName: yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastName: yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
    email: yup.string()
        .required('Email is required')
        .email('Please enter a valid email'),
    phone: yup.string()
        .required('Phone number is required')
        .matches(/^[+]?[0-9\s\-()]{10,}$/, 'Please enter a valid phone number'),
    department: yup.string().required('Department is required'),
    position: yup.string().required('Position is required'),
    salary: yup.number()
        .required('Salary is required')
        .positive('Salary must be positive')
        .typeError('Salary must be a number'),
    hireDate: yup.date().required('Hire date is required'),
    status: yup.string().required('Status is required'),
    address: yup.object().shape({
        street: yup.string(),
        city: yup.string(),
        state: yup.string(),
        zipCode: yup.string(),
        country: yup.string()
    })
});

const AddEmployee = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            department: '',
            position: '',
            salary: '',
            hireDate: new Date().toISOString().split('T')[0],
            status: 'active',
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            }
        }
    });

    const departments = [
        'Engineering',
        'Marketing',
        'Sales',
        'Human Resources',
        'Finance',
        'Operations',
        'IT',
        'Customer Support'
    ];

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'on-leave', label: 'On Leave' },
        { value: 'terminated', label: 'Terminated' },
        { value: 'resigned', label: 'Resigned' }
    ];

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // Format salary as number
            data.salary = parseFloat(data.salary);

            await employeeAPI.createEmployee(data);
            
            setSuccess('Employee added successfully!');
            reset();
            
            setTimeout(() => {
                navigate('/employees');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Add New Employee</Typography>
                    <Button variant="outlined" onClick={() => navigate('/employees')}>
                        Back to List
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="col-span-full">
                            <Typography variant="h6" gutterBottom>
                                Basic Information
                            </Typography>
                        </div>

                        <div>
                            <Controller
                                name="firstName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="First Name"
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                        required
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="lastName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Last Name"
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                        required
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        required
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Phone Number"
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                        required
                                    />
                                )}
                            />
                        </div>

                        {/* Employment Details */}
                        <div className="col-span-full">
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Employment Details
                            </Typography>
                        </div>

                        <div>
                            <Controller
                                name="department"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.department}>
                                        <InputLabel>Department *</InputLabel>
                                        <Select {...field} label="Department *">
                                            {departments.map((dept) => (
                                                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.department && (
                                            <Typography color="error" variant="caption">
                                                {errors.department.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="position"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Position"
                                        error={!!errors.position}
                                        helperText={errors.position?.message}
                                        required
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="salary"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Salary"
                                        type="number"
                                        error={!!errors.salary}
                                        helperText={errors.salary?.message}
                                        required
                                        InputProps={{
                                            startAdornment: <Typography>$</Typography>
                                        }}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="hireDate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Hire Date"
                                        type="date"
                                        error={!!errors.hireDate}
                                        helperText={errors.hireDate?.message}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.status}>
                                        <InputLabel>Status *</InputLabel>
                                        <Select {...field} label="Status *">
                                            {statusOptions.map((status) => (
                                                <MenuItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.status && (
                                            <Typography color="error" variant="caption">
                                                {errors.status.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </div>

                        {/* Address Information */}
                        <div className="col-span-full">
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Address Information
                            </Typography>
                        </div>

                        <div className="col-span-full">
                            <Controller
                                name="address.street"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Street Address"
                                        error={!!errors.address?.street}
                                        helperText={errors.address?.street?.message}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="address.city"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="City"
                                        error={!!errors.address?.city}
                                        helperText={errors.address?.city?.message}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="address.state"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="State"
                                        error={!!errors.address?.state}
                                        helperText={errors.address?.state?.message}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="address.zipCode"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Zip Code"
                                        error={!!errors.address?.zipCode}
                                        helperText={errors.address?.zipCode?.message}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="address.country"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Country"
                                        error={!!errors.address?.country}
                                        helperText={errors.address?.country?.message}
                                    />
                                )}
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="col-span-full">
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/employees')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading && <CircularProgress size={20} />}
                                >
                                    {loading ? 'Adding...' : 'Add Employee'}
                                </Button>
                            </Box>
                        </div>
                    </div>
                </form>
            </Paper>
        </Container>
    );
};

export default AddEmployee;