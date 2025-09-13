const express = require('express');
const { body } = require('express-validator');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register route
router.post('/register', [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'admin']).withMessage('Role must be either student or admin')
], register);

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], login);

// Get current user route
router.get('/me', auth, getCurrentUser);

module.exports = router;