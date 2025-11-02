const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * Validation for inviting co-organizers
 */
const validateInviteCoOrganizers = [
  body('invitations')
    .isArray({ min: 1, max: 5 })
    .withMessage('Must provide 1-5 invitations'),
  
  body('invitations.*.organizationId')
    .notEmpty()
    .withMessage('Organization ID is required')
    .custom(value => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Invalid organization ID');
      }
      return true;
    }),
  
  body('invitations.*.revenueShare')
    .isFloat({ min: 1, max: 50 })
    .withMessage('Revenue share must be between 1% and 50%'),
  
  body('invitations.*.message')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters')
    .trim(),

  // Custom validation to check total revenue share
  body('invitations').custom((invitations) => {
    const totalShare = invitations.reduce((sum, inv) => sum + inv.revenueShare, 0);
    if (totalShare > 80) {
      throw new Error('Total revenue share for co-organizers cannot exceed 80%');
    }
    return true;
  }),

  // Check for duplicate organizations in the same request
  body('invitations').custom((invitations) => {
    const orgIds = invitations.map(inv => inv.organizationId);
    const uniqueOrgIds = [...new Set(orgIds)];
    if (orgIds.length !== uniqueOrgIds.length) {
      throw new Error('Cannot invite the same organization multiple times');
    }
    return true;
  }),

  handleValidationErrors
];

/**
 * Validation for responding to invitation
 */
const validateRespondToInvitation = [
  body('response')
    .isIn(['accept', 'decline'])
    .withMessage('Response must be either "accept" or "decline"'),
  
  body('organizationId')
    .notEmpty()
    .withMessage('Organization ID is required')
    .custom(value => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Invalid organization ID');
      }
      return true;
    }),

  handleValidationErrors
];

/**
 * Validation for updating co-organizer share
 */
const validateUpdateCoOrganizerShare = [
  param('id')
    .notEmpty()
    .withMessage('Event ID is required')
    .custom(value => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Invalid event ID');
      }
      return true;
    }),
  
  param('coOrgId')
    .notEmpty()
    .withMessage('Co-organizer ID is required')
    .custom(value => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Invalid co-organizer ID');
      }
      return true;
    }),
  
  body('revenueShare')
    .isFloat({ min: 0, max: 50 })
    .withMessage('Revenue share must be between 0% and 50%'),

  handleValidationErrors
];

/**
 * Validation for removing co-organizer
 */
const validateRemoveCoOrganizer = [
  param('id')
    .notEmpty()
    .withMessage('Event ID is required')
    .custom(value => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Invalid event ID');
      }
      return true;
    }),
  
  param('coOrgId')
    .notEmpty()
    .withMessage('Co-organizer ID is required')
    .custom(value => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Invalid co-organizer ID');
      }
      return true;
    }),

  handleValidationErrors
];

/**
 * Validation for getting collaborative events
 */
const validateGetCollaborativeEvents = [
  query('status')
    .optional()
    .isIn(['all', 'draft', 'active', 'completed', 'cancelled', 'pending_response'])
    .withMessage('Invalid status filter'),
  
  query('role')
    .optional()
    .isIn(['all', 'main_organizer', 'co_organizer'])
    .withMessage('Invalid role filter'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  handleValidationErrors
];

/**
 * Validation for getting revenue distribution
 */
const validateGetRevenueDistribution = [
  param('id')
    .notEmpty()
    .withMessage('Event ID is required')
    .custom(value => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Invalid event ID');
      }
      return true;
    }),

  handleValidationErrors
];

/**
 * Validation for collaborative event creation (extends regular event validation)
 */
const validateCollaborativeEventCreation = [
  body('collaborationSettings')
    .optional()
    .isObject()
    .withMessage('Collaboration settings must be an object'),
  
  body('collaborationSettings.allowCoOrganizers')
    .optional()
    .isBoolean()
    .withMessage('Allow co-organizers must be boolean'),
  
  body('collaborationSettings.maxCoOrganizers')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Max co-organizers must be between 1 and 10'),
  
  body('collaborationSettings.requireApprovalForCoOrganizers')
    .optional()
    .isBoolean()
    .withMessage('Require approval must be boolean'),
  
  body('collaborationSettings.defaultCoOrganizerShare')
    .optional()
    .isFloat({ min: 1, max: 25 })
    .withMessage('Default co-organizer share must be between 1% and 25%'),

  body('initialCoOrganizers')
    .optional()
    .isArray({ max: 3 })
    .withMessage('Can invite maximum 3 co-organizers during event creation'),
  
  body('initialCoOrganizers.*.organizationId')
    .if(body('initialCoOrganizers').exists())
    .notEmpty()
    .withMessage('Co-organizer organization ID is required')
    .custom(value => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Invalid co-organizer organization ID');
      }
      return true;
    }),
  
  body('initialCoOrganizers.*.revenueShare')
    .if(body('initialCoOrganizers').exists())
    .isFloat({ min: 1, max: 30 })
    .withMessage('Co-organizer revenue share must be between 1% and 30%'),

  // Validate total initial co-organizer shares
  body('initialCoOrganizers').custom((coOrganizers) => {
    if (coOrganizers && coOrganizers.length > 0) {
      const totalShare = coOrganizers.reduce((sum, co) => sum + co.revenueShare, 0);
      if (totalShare > 60) {
        throw new Error('Total initial co-organizer revenue share cannot exceed 60%');
      }
    }
    return true;
  }),

  handleValidationErrors
];

/**
 * Validation for bulk operations on collaborative events
 */
const validateBulkCollaborativeOperations = [
  body('eventIds')
    .isArray({ min: 1, max: 20 })
    .withMessage('Must provide 1-20 event IDs'),
  
  body('eventIds.*')
    .custom(value => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Invalid event ID');
      }
      return true;
    }),
  
  body('operation')
    .isIn(['approve_all_invitations', 'decline_all_invitations', 'update_revenue_shares', 'send_reminder'])
    .withMessage('Invalid bulk operation'),
  
  body('operationData')
    .optional()
    .isObject()
    .withMessage('Operation data must be an object'),

  handleValidationErrors
];

/**
 * Handle validation errors middleware
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
}

/**
 * Custom validation for checking event collaboration eligibility
 */
const validateEventCollaborationEligibility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Event = require('../../models/Event');
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is in a state that allows collaboration changes
    if (event.status === 'completed' || event.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify collaboration for completed or cancelled events'
      });
    }

    // Check if event has already started
    if (new Date() >= event.startDate) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify collaboration after event has started'
      });
    }

    // Check if event has any ticket sales (collaboration changes might affect revenue)
    if (event.ticketsSold > 0 && req.method === 'PUT') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify revenue shares after ticket sales have begun'
      });
    }

    req.event = event;
    next();
  } catch (error) {
    console.error('Error in collaboration eligibility check:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate event collaboration eligibility'
    });
  }
};

module.exports = {
  validateInviteCoOrganizers,
  validateRespondToInvitation,
  validateUpdateCoOrganizerShare,
  validateRemoveCoOrganizer,
  validateGetCollaborativeEvents,
  validateGetRevenueDistribution,
  validateCollaborativeEventCreation,
  validateBulkCollaborativeOperations,
  validateEventCollaborationEligibility
};