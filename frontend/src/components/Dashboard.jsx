import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import {
    People,
    AttachMoney,
    Business,
    CalendarToday,
    Add as AddIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { employeeAPI } from '../services/api';
import authService from '../services/auth';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = authService.getUser();

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await employeeAPI.getStats();
            setStats(response.data);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                        backgroundColor: `${color}20`,
                        borderRadius: '50%',
                        p: 1,
                        mr: 2
                    }}>
                        {icon}
                    </Box>
                    <Typography variant="h6" color="textSecondary">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4" component="div">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Dashboard
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchStats}
                        sx={{ mr: 2 }}
                    >
                        Refresh
                    </Button>
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/employees/add')}
                        >
                            Add Employee
                        </Button>
                    )}
                </Box>
            </Box>

            {stats && (
                <>
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Employees"
                            value={stats.totalEmployees}
                            icon={<People sx={{ color: '#1976d2' }} />}
                            color="#1976d2"
                        />
                        <StatCard
                            title="Active"
                            value={stats.statusStats?.find(s => s._id === 'active')?.count || 0}
                            icon={<Business sx={{ color: '#2e7d32' }} />}
                            color="#2e7d32"
                        />
                        <StatCard
                            title="Departments"
                            value={stats.departmentStats?.length || 0}
                            icon={<Business sx={{ color: '#ed6c02' }} />}
                            color="#ed6c02"
                        />
                        <StatCard
                            title="On Leave"
                            value={stats.statusStats?.find(s => s._id === 'on-leave')?.count || 0}
                            icon={<CalendarToday sx={{ color: '#9c27b0' }} />}
                            color="#9c27b0"
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Department Distribution */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Department Distribution
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={stats.departmentStats}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="_id" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" name="Employees" />
                                </BarChart>
                            </Box>
                        </Paper>

                        {/* Status Distribution */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Employee Status
                            </Typography>
                            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                                <PieChart width={400} height={300}>
                                    <Pie
                                        data={stats.statusStats}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ _id, count }) => `${_id}: ${count}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {stats.statusStats?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </Box>
                        </Paper>

                        {/* Recent Hires */}
                        <Paper sx={{ p: 3 }} className="col-span-1 lg:col-span-2">
                            <Typography variant="h6" gutterBottom>
                                Recent Hires
                            </Typography>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {stats.recentHires?.map((employee, index) => (
                                    <Card variant="outlined" key={index}>
                                        <CardContent>
                                            <Typography variant="h6">
                                                {employee.firstName} {employee.lastName}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                {employee.position}
                                            </Typography>
                                            <Typography variant="body2">
                                                {employee.department}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Hired: {new Date(employee.hireDate).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </Paper>
                    </div>
                </>
            )}
        </Container>
    );
};

export default Dashboard;