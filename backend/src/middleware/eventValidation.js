const { body, param } = require('express-validator');

/**
 * Event creation validation
 */
const validateCreateEvent = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Event title must be between 3 and 200 characters')
    .matches(/^[a-zA-Z0-9\s\-&.,!'()]+$/)
    .withMessage('Event title contains invalid characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Event description must not exceed 5000 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Event category is required')
    .isIn([
      'music', 'sports', 'business', 'education', 'technology', 
      'arts', 'food', 'health', 'entertainment', 'networking', 'other'
    ])
    .withMessage('Invalid event category'),

  body('startDate')
    .notEmpty()
    .withMessage('Event start date is required')
    .isISO8601()
    .withMessage('Invalid start date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Event start date must be in the future');
      }
      return true;
    }),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format')
    .custom((value, { req }) => {
      if (value && req.body.startDate) {
        if (new Date(value) <= new Date(req.body.startDate)) {
          throw new Error('Event end date must be after start date');
        }
      }
      return true;
    }),

  body('venue.name')
    .trim()
    .notEmpty()
    .withMessage('Venue name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Venue name must be between 2 and 200 characters'),

  body('venue.address.street')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Street address must not exceed 200 characters'),

  body('venue.address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),

  body('venue.address.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),

  body('capacity')
    .optional()
    .isInt({ min: 1, max: 1000000 })
    .withMessage('Capacity must be between 1 and 1,000,000'),

  body('ticketTypes')
    .optional()
    .isArray()
    .withMessage('Ticket types must be an array'),

  body('ticketTypes.*.name')
    .if(body('ticketTypes').exists())
    .trim()
    .notEmpty()
    .withMessage('Ticket type name is required')
    .isLength({ max: 100 })
    .withMessage('Ticket type name must not exceed 100 characters'),

  body('ticketTypes.*.price')
    .if(body('ticketTypes').exists())
    .isFloat({ min: 0 })
    .withMessage('Ticket price must be a positive number'),

  body('ticketTypes.*.quantity')
    .if(body('ticketTypes').exists())
    .isInt({ min: 1 })
    .withMessage('Ticket quantity must be at least 1'),

  body('organizationId')
    .trim()
    .notEmpty()
    .withMessage('Organization ID is required')
    .isMongoId()
    .withMessage('Invalid organization ID format'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return tags.every(tag => typeof tag === 'string' && tag.length <= 50);
    })
    .withMessage('Each tag must be a string with maximum 50 characters'),

  body('targetAudience')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Target audience must not exceed 200 characters'),

  body('ageRestriction.minAge')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Minimum age must be between 0 and 100'),

  body('ageRestriction.maxAge')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Maximum age must be between 0 and 100')
    .custom((value, { req }) => {
      if (value && req.body.ageRestriction?.minAge && value <= req.body.ageRestriction.minAge) {
        throw new Error('Maximum age must be greater than minimum age');
      }
      return true;
    }),

  body('socialLinks.website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),

  body('socialLinks.facebook')
    .optional()
    .isURL()
    .withMessage('Facebook link must be a valid URL'),

  body('socialLinks.instagram')
    .optional()
    .isURL()
    .withMessage('Instagram link must be a valid URL'),

  body('socialLinks.twitter')
    .optional()
    .isURL()
    .withMessage('Twitter link must be a valid URL')
];

/**
 * Event update validation
 */
const validateUpdateEvent = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Event title must be between 3 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Event description must not exceed 5000 characters'),

  body('category')
    .optional()
    .isIn([
      'music', 'sports', 'business', 'education', 'technology', 
      'arts', 'food', 'health', 'entertainment', 'networking', 'other'
    ])
    .withMessage('Invalid event category'),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),

  body('capacity')
    .optional()
    .isInt({ min: 1, max: 1000000 })
    .withMessage('Capacity must be between 1 and 1,000,000'),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'active', 'cancelled', 'completed', 'suspended'])
    .withMessage('Invalid event status')
];

/**
 * AI event creation validation
 */
const validateAICreateEvent = [
  ...validateCreateEvent,
  
  body('generateDescription')
    .optional()
    .isBoolean()
    .withMessage('generateDescription must be a boolean'),

  body('generateTitles')
    .optional()
    .isBoolean()
    .withMessage('generateTitles must be a boolean'),

  body('briefDescription')
    .if(body('generateDescription').equals(true))
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Brief description must not exceed 500 characters'),

  body('theme')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Event theme must not exceed 200 characters'),

  body('type')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Event type must not exceed 100 characters')
];

/**
 * AI enhancement validation
 */
const validateAIEnhancement = [
  body('enhanceDescription')
    .optional()
    .isBoolean()
    .withMessage('enhanceDescription must be a boolean'),

  body('generateTitles')
    .optional()
    .isBoolean()
    .withMessage('generateTitles must be a boolean'),

  body('improveContent')
    .optional()
    .isBoolean()
    .withMessage('improveContent must be a boolean'),

  // At least one enhancement option must be selected
  body()
    .custom((body) => {
      const { enhanceDescription, generateTitles, improveContent } = body;
      if (!enhanceDescription && !generateTitles && !improveContent) {
        throw new Error('At least one AI enhancement option must be selected');
      }
      return true;
    })
];

/**
 * Event ID parameter validation
 */
const validateEventId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid event ID format')
];

/**
 * Event identifier validation (ID or slug)
 */
const validateEventIdentifier = [
  param('identifier')
    .trim()
    .notEmpty()
    .withMessage('Event identifier is required')
    .custom((value) => {
      // Check if it's a valid MongoDB ObjectId or a valid slug
      const mongoIdRegex = /^[a-fA-F0-9]{24}$/;
      const slugRegex = /^[a-z0-9-]+$/;
      
      if (!mongoIdRegex.test(value) && !slugRegex.test(value)) {
        throw new Error('Invalid event identifier format');
      }
      return true;
    })
];

/**
 * Organization ID parameter validation
 */
const validateOrganizationId = [
  param('orgId')
    .isMongoId()
    .withMessage('Invalid organization ID format')
];

/**
 * Event query parameters validation
 */
const validateEventQuery = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  body('category')
    .optional()
    .isIn([
      'music', 'sports', 'business', 'education', 'technology', 
      'arts', 'food', 'health', 'entertainment', 'networking', 'other'
    ])
    .withMessage('Invalid category filter'),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'active', 'cancelled', 'completed', 'suspended'])
    .withMessage('Invalid status filter'),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),

  body('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be between 2 and 100 characters')
];

module.exports = {
  validateCreateEvent,
  validateUpdateEvent,
  validateAICreateEvent,
  validateAIEnhancement,
  validateEventId,
  validateEventIdentifier,
  validateOrganizationId,
  validateEventQuery
};