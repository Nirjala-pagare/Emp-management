import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Button,
    IconButton,
    Chip,
    Box,
    Typography,
    CircularProgress,
    Alert,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import authService from '../services/auth';

const EmployeeList = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const user = authService.getUser();

    const departments = [...new Set(employees.map(emp => emp.department))];
    const statusOptions = ['active', 'on-leave', 'terminated', 'resigned'];

    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                ...(searchTerm && { search: searchTerm }),
                ...(departmentFilter && { department: departmentFilter }),
                ...(statusFilter && { status: statusFilter })
            };

            const response = await employeeAPI.getEmployees(params);
            setEmployees(response.data.employees);
            setTotalEmployees(response.data.totalEmployees);
        } catch (err) {
            setError('Failed to fetch employees');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, searchTerm, departmentFilter, statusFilter]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setDepartmentFilter('');
        setStatusFilter('');
        setPage(0);
    };

    const handleEdit = (id) => {
        navigate(`/employees/edit/${id}`);
    };

    const handleView = (id) => {
        navigate(`/employees/view/${id}`);
    };

    const handleDeleteClick = (employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await employeeAPI.deleteEmployee(employeeToDelete._id);
            fetchEmployees();
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
        } catch {
            setError('Failed to delete employee');
        }
    };

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

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Employees</Typography>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                    <Button
                        variant="contained"
                        onClick={() => navigate('/employees/add')}
                    >
                        Add New Employee
                    </Button>
                )}
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4">
                        <TextField
                            fullWidth
                            label="Search by name or email"
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormControl fullWidth>
                            <InputLabel>Department</InputLabel>
                            <Select
                                value={departmentFilter}
                                label="Department"
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                            >
                                <MenuItem value="">All Departments</MenuItem>
                                {departments.map((dept) => (
                                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="md:col-span-3">
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="">All Status</MenuItem>
                                {statusOptions.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="md:col-span-2">
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<ClearIcon />}
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Position</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Hire Date</TableCell>
                                    <TableCell>Salary</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            No employees found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employees.map((employee) => (
                                        <TableRow key={employee._id} hover>
                                            <TableCell>
                                                {employee.firstName} {employee.lastName}
                                            </TableCell>
                                            <TableCell>{employee.email}</TableCell>
                                            <TableCell>{employee.department}</TableCell>
                                            <TableCell>{employee.position}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={employee.status}
                                                    color={getStatusColor(employee.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(employee.hireDate)}</TableCell>
                                            <TableCell>
                                                ${employee.salary?.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleView(employee._id)}
                                                    title="View"
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                                {(user?.role === 'admin' || user?.role === 'manager') && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEdit(employee._id)}
                                                        title="Edit"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                )}
                                                {user?.role === 'admin' && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteClick(employee)}
                                                        title="Delete"
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={totalEmployees}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete employee: 
                        <strong> {employeeToDelete?.firstName} {employeeToDelete?.lastName}</strong>?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EmployeeList;