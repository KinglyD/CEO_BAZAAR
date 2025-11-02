const express = require('express');
const router = express.Router();

// Controllers
const organizationController = require('../controllers/organizationController');

// Middleware
const { authenticateToken } = require('../middleware/authMiddleware');

// All organization routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/organizations
 * @desc    Get user's organizations
 * @access  Private
 */
router.get('/', organizationController.getUserOrganizations);

/**
 * @route   GET /api/organizations/:id
 * @desc    Get single organization details
 * @access  Private (organization members only)
 * @params  {id} - Organization ID
 */
router.get('/:id', organizationController.getOrganization);

/**
 * @route   PUT /api/organizations/:id
 * @desc    Update organization details
 * @access  Private (organization admin only)
 * @params  {id} - Organization ID
 */
router.put('/:id', organizationController.updateOrganization);

/**
 * @route   GET /api/organizations/:id/stats
 * @desc    Get organization statistics
 * @access  Private (organization members only)
 * @params  {id} - Organization ID
 */
router.get('/:id/stats', organizationController.getOrganizationStats);

module.exports = router;