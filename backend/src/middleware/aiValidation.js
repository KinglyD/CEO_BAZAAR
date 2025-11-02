const { body } = require('express-validator');

/**
 * Event description generation validation
 */
const validateEventDescription = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Event title must be between 3 and 200 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Event category is required')
    .isIn(['music', 'sports', 'business', 'education', 'technology', 'arts', 'food', 'health', 'other'])
    .withMessage('Invalid event category'),

  body('venue.name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Venue name must not exceed 100 characters'),

  body('venue.city')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('City name must not exceed 50 characters'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in valid ISO format'),

  body('organizer')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Organizer name must not exceed 100 characters'),

  body('briefDescription')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Brief description must not exceed 500 characters')
];

/**
 * Marketing campaign generation validation
 */
const validateMarketingCampaign = [
  body('eventTitle')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ max: 200 })
    .withMessage('Event title must not exceed 200 characters'),

  body('targetAudience')
    .trim()
    .notEmpty()
    .withMessage('Target audience is required')
    .isLength({ max: 100 })
    .withMessage('Target audience must not exceed 100 characters'),

  body('platform')
    .trim()
    .notEmpty()
    .withMessage('Platform is required')
    .isIn(['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'email', 'sms', 'print', 'radio', 'tv'])
    .withMessage('Invalid platform'),

  body('tone')
    .optional()
    .trim()
    .isIn(['professional', 'casual', 'exciting', 'formal', 'friendly', 'urgent', 'playful'])
    .withMessage('Invalid tone'),

  body('campaignGoal')
    .optional()
    .trim()
    .isIn(['ticket_sales', 'awareness', 'engagement', 'registration', 'brand_building'])
    .withMessage('Invalid campaign goal')
];

/**
 * Social media post generation validation
 */
const validateSocialMediaPost = [
  body('eventTitle')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ max: 200 })
    .withMessage('Event title must not exceed 200 characters'),

  body('platform')
    .trim()
    .notEmpty()
    .withMessage('Platform is required')
    .isIn(['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'])
    .withMessage('Invalid social media platform'),

  body('postType')
    .optional()
    .trim()
    .isIn(['announcement', 'reminder', 'countdown', 'behind_scenes', 'testimonial', 'promotion'])
    .withMessage('Invalid post type'),

  body('eventDate')
    .optional()
    .isISO8601()
    .withMessage('Event date must be in valid ISO format'),

  body('venue')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Venue must not exceed 100 characters')
];

/**
 * SMS campaign generation validation
 */
const validateSMSCampaign = [
  body('eventTitle')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ max: 100 })
    .withMessage('Event title must not exceed 100 characters'),

  body('customerName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Customer name must not exceed 50 characters'),

  body('messageType')
    .optional()
    .trim()
    .isIn(['promotion', 'reminder', 'confirmation', 'update', 'invitation'])
    .withMessage('Invalid message type'),

  body('urgency')
    .optional()
    .trim()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid urgency level')
];

/**
 * Business insights generation validation
 */
const validateBusinessInsights = [
  body('data')
    .notEmpty()
    .withMessage('Analytics data is required')
    .isObject()
    .withMessage('Analytics data must be an object'),

  body('timeframe')
    .optional()
    .trim()
    .isIn(['weekly', 'monthly', 'quarterly', 'yearly'])
    .withMessage('Invalid timeframe'),

  body('metrics')
    .optional()
    .isArray()
    .withMessage('Metrics must be an array')
    .custom((metrics) => {
      const validMetrics = ['revenue', 'attendance', 'conversion', 'engagement', 'retention'];
      return metrics.every(metric => validMetrics.includes(metric));
    })
    .withMessage('Invalid metrics provided')
];

/**
 * Event titles generation validation
 */
const validateEventTitles = [
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Event category is required')
    .isIn(['music', 'sports', 'business', 'education', 'technology', 'arts', 'food', 'health', 'other'])
    .withMessage('Invalid event category'),

  body('type')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Event type must not exceed 50 characters'),

  body('targetAudience')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Target audience must not exceed 100 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),

  body('theme')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Theme must not exceed 200 characters'),

  body('briefDescription')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Brief description must not exceed 500 characters')
];

/**
 * Content improvement validation
 */
const validateContentImprovement = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters'),

  body('type')
    .trim()
    .notEmpty()
    .withMessage('Content type is required')
    .isIn(['event_description', 'marketing_copy', 'social_post', 'email', 'blog_post', 'other'])
    .withMessage('Invalid content type'),

  body('goals')
    .optional()
    .isArray()
    .withMessage('Goals must be an array')
    .custom((goals) => {
      const validGoals = ['clarity', 'engagement', 'seo', 'conversion', 'readability', 'tone'];
      return goals.every(goal => validGoals.includes(goal));
    })
    .withMessage('Invalid improvement goals'),

  body('audience')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Audience must not exceed 100 characters'),

  body('tone')
    .optional()
    .trim()
    .isIn(['professional', 'casual', 'exciting', 'formal', 'friendly', 'urgent', 'playful'])
    .withMessage('Invalid tone')
];

/**
 * Generic AI request validation
 */
const validateAIRequest = [
  body('prompt')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Prompt must be between 10 and 2000 characters'),

  body('maxTokens')
    .optional()
    .isInt({ min: 10, max: 4000 })
    .withMessage('Max tokens must be between 10 and 4000'),

  body('temperature')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Temperature must be between 0 and 1')
];

module.exports = {
  validateEventDescription,
  validateMarketingCampaign,
  validateSocialMediaPost,
  validateSMSCampaign,
  validateBusinessInsights,
  validateEventTitles,
  validateContentImprovement,
  validateAIRequest
};