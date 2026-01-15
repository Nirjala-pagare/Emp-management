const express = require('express');
const router = express.Router();
const {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats
} = require('../controllers/employeeController');
const { validateEmployee } = require('../middleware/validationMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Routes accessible to all authenticated users
router.route('/')
    .get(getEmployees)
    .post(authorize('admin', 'manager'), validateEmployee, createEmployee);

router.route('/:id')
    .get(getEmployeeById)
    .put(authorize('admin', 'manager'), validateEmployee, updateEmployee)
    .delete(authorize('admin'), deleteEmployee);

// Statistics route
router.get('/stats/dashboard', getEmployeeStats);

module.exports = router;