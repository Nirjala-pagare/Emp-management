const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            department, 
            status, 
            search 
        } = req.query;

        const query = {};

        // Filter by department
        if (department) {
            query.department = department;
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Search in name or email
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const employees = await Employee.find(query)
            .populate('createdBy', 'username email')
            .populate('updatedBy', 'username email')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Employee.countDocuments(query);

        res.json({
            employees,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalEmployees: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('createdBy', 'username email')
            .populate('updatedBy', 'username email');

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = async (req, res) => {
    try {
        const employeeData = {
            ...req.body,
            createdBy: req.user._id
        };

        // Check if email already exists
        const existingEmployee = await Employee.findOne({ email: employeeData.email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee with this email already exists' });
        }

        const employee = await Employee.create(employeeData);
        
        const populatedEmployee = await Employee.findById(employee._id)
            .populate('createdBy', 'username email');

        res.status(201).json(populatedEmployee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
    try {
        let employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if email is being changed and if it already exists
        if (req.body.email && req.body.email !== employee.email) {
            const existingEmployee = await Employee.findOne({ email: req.body.email });
            if (existingEmployee) {
                return res.status(400).json({ message: 'Employee with this email already exists' });
            }
        }

        const updateData = {
            ...req.body,
            updatedBy: req.user._id,
            updatedAt: Date.now()
        };

        employee = await Employee.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'username email')
         .populate('updatedBy', 'username email');

        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.deleteOne();
        res.json({ message: 'Employee removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get employee statistics
// @route   GET /api/employees/stats/dashboard
// @access  Private
const getEmployeeStats = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        
        const departmentStats = await Employee.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const statusStats = await Employee.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const recentHires = await Employee.find()
            .sort('-hireDate')
            .limit(5)
            .select('firstName lastName position department hireDate');

        res.json({
            totalEmployees,
            departmentStats,
            statusStats,
            recentHires
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats
};