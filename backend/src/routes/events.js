const express = require('express');
const router = express.Router();

// Controllers
const eventController = require('../controllers/eventController');

// Middleware
const { authenticateToken, checkOrganizationAccess } = require('../middleware/authMiddleware');
const {
  validateCreateEvent,
  validateUpdateEvent,
  validateAICreateEvent,
  validateAIEnhancement,
  validateEventId,
  validateEventIdentifier,
  validateOrganizationId
} = require('../middleware/eventValidation');

/**
 * @route   GET /api/events
 * @desc    Get all events with filtering and pagination
 * @access  Public
 * @query   {page?, limit?, category?, status?, organizer?, startDate?, endDate?, search?, featured?, sort?}
 */
router.get('/', eventController.getEvents);

/**
 * @route   POST /api/events
 * @desc    Create new event
 * @access  Private (requires organization access)
 * @body    {title, description?, category, startDate, endDate?, venue, capacity?, ticketTypes?, organizationId, tags?, targetAudience?}
 */
router.post('/', 
  authenticateToken, 
  validateCreateEvent, 
  eventController.createEvent
);

/**
 * @route   POST /api/events/ai-create
 * @desc    Create event with AI-generated content
 * @access  Private (requires organization access)
 * @body    {title, category, startDate, venue, organizationId, generateDescription?, generateTitles?, briefDescription?, theme?}
 */
router.post('/ai-create', 
  authenticateToken, 
  validateAICreateEvent, 
  eventController.createEventWithAI
);

/**
 * @route   GET /api/events/organization/:orgId
 * @desc    Get events by organization
 * @access  Private (organization members only)
 * @params  {orgId} - Organization ID
 * @query   {page?, limit?, status?}
 */
router.get('/organization/:orgId', 
  authenticateToken,
  validateOrganizationId,
  eventController.getEventsByOrganization
);

/**
 * @route   GET /api/events/:identifier
 * @desc    Get single event by ID or slug
 * @access  Public
 * @params  {identifier} - Event ID or slug
 */
router.get('/:identifier', 
  validateEventIdentifier, 
  eventController.getEvent
);

/**
 * @route   PUT /api/events/:id
 * @desc    Update event
 * @access  Private (event organizer only)
 * @params  {id} - Event ID
 * @body    {title?, description?, category?, startDate?, endDate?, venue?, capacity?, status?, tags?}
 */
router.put('/:id', 
  authenticateToken, 
  validateEventId, 
  validateUpdateEvent, 
  eventController.updateEvent
);

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event (soft delete)
 * @access  Private (event organizer only)
 * @params  {id} - Event ID
 */
router.delete('/:id', 
  authenticateToken, 
  validateEventId, 
  eventController.deleteEvent
);

/**
 * @route   POST /api/events/:id/ai-enhance
 * @desc    Generate AI enhancements for existing event
 * @access  Private (event organizer only)
 * @params  {id} - Event ID
 * @body    {enhanceDescription?, generateTitles?, improveContent?}
 */
router.post('/:id/ai-enhance', 
  authenticateToken, 
  validateEventId, 
  validateAIEnhancement, 
  eventController.enhanceEventWithAI
);

// TODO: Additional event routes to implement
/**
 * Future event routes:
 * 
 * @route   POST /api/events/:id/publish
 * @desc    Publish event (change from draft to published)
 * 
 * @route   POST /api/events/:id/cancel
 * @desc    Cancel event
 * 
 * @route   POST /api/events/:id/duplicate
 * @desc    Create duplicate of event
 * 
 * @route   GET /api/events/:id/analytics
 * @desc    Get event analytics and statistics
 * 
 * @route   POST /api/events/:id/co-organizers
 * @desc    Add co-organizers to event
 * 
 * @route   GET /api/events/:id/transactions
 * @desc    Get event transaction history
 * 
 * @route   POST /api/events/:id/feature
 * @desc    Feature/unfeature event (admin only)
 * 
 * @route   GET /api/events/featured
 * @desc    Get featured events
 * 
 * @route   GET /api/events/trending
 * @desc    Get trending events
 * 
 * @route   POST /api/events/:id/reviews
 * @desc    Add event review/rating
 */

module.exports = router;