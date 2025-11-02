const express = require('express');
const router = express.Router();

// Controllers
const {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile
} = require('../controllers/authController');

// Middleware
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateRefreshToken
} = require('../middleware/authValidation');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 * @body    {firstName, lastName, email, phone, password, organizationName?, organizationType?}
 */
router.post('/register', validateRegister, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @body    {email, password}
 */
router.post('/login', validateLogin, login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 * @body    {refreshToken}
 */
router.post('/refresh', validateRefreshToken, refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 * @body    {refreshToken?}
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 * @body    {firstName?, lastName?, phone?, preferences?}
 */
router.put('/profile', authenticateToken, validateProfileUpdate, updateProfile);

// TODO: Implement these additional routes
/**
 * Future authentication routes to implement:
 * 
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 * @body    {email}
 * 
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 * @body    {token, newPassword, confirmPassword}
 * 
 * @route   POST /api/auth/change-password
 * @desc    Change password (logged in user)
 * @access  Private
 * @body    {currentPassword, newPassword, confirmPassword}
 * 
 * @route   POST /api/auth/verify-email
 * @desc    Verify email with token
 * @access  Public
 * @body    {token}
 * 
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Private
 * 
 * @route   POST /api/auth/verify-phone
 * @desc    Verify phone number with SMS code
 * @access  Private
 * @body    {code}
 * 
 * @route   POST /api/auth/send-phone-verification
 * @desc    Send SMS verification code
 * @access  Private
 */

module.exports = router;