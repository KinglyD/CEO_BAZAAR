const express = require('express');
const router = express.Router();

// Controllers
const aiController = require('../controllers/aiController');

// Middleware
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  validateEventDescription,
  validateMarketingCampaign,
  validateSocialMediaPost,
  validateSMSCampaign,
  validateBusinessInsights,
  validateEventTitles,
  validateContentImprovement
} = require('../middleware/aiValidation');

// All AI routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/ai/event-description
 * @desc    Generate AI-powered event description
 * @access  Private
 * @body    {title, category, venue?, date?, organizer?, briefDescription?}
 */
router.post('/event-description', validateEventDescription, aiController.generateEventDescription);

/**
 * @route   POST /api/ai/marketing-campaign
 * @desc    Generate AI-powered marketing campaign content
 * @access  Private
 * @body    {eventTitle, targetAudience, platform, tone?, campaignGoal?}
 */
router.post('/marketing-campaign', validateMarketingCampaign, aiController.generateMarketingCampaign);

/**
 * @route   POST /api/ai/social-media-post
 * @desc    Generate AI-powered social media post
 * @access  Private
 * @body    {eventTitle, platform, postType?, eventDate?, venue?}
 */
router.post('/social-media-post', validateSocialMediaPost, aiController.generateSocialMediaPost);

/**
 * @route   POST /api/ai/sms-campaign
 * @desc    Generate AI-powered SMS campaign messages
 * @access  Private
 * @body    {eventTitle, customerName?, messageType?, urgency?}
 */
router.post('/sms-campaign', validateSMSCampaign, aiController.generateSMSCampaign);

/**
 * @route   POST /api/ai/business-insights
 * @desc    Generate AI-powered business insights and analytics
 * @access  Private
 * @body    {data, timeframe?, metrics?}
 */
router.post('/business-insights', validateBusinessInsights, aiController.generateBusinessInsights);

/**
 * @route   POST /api/ai/event-titles
 * @desc    Generate AI-powered event title suggestions
 * @access  Private
 * @body    {category, type?, targetAudience?, location?, theme?, briefDescription?}
 */
router.post('/event-titles', validateEventTitles, aiController.generateEventTitles);

/**
 * @route   POST /api/ai/improve-content
 * @desc    Improve existing content using AI
 * @access  Private
 * @body    {content, type, goals?, audience?, tone?}
 */
router.post('/improve-content', validateContentImprovement, aiController.improveContent);

/**
 * @route   GET /api/ai/credits
 * @desc    Get user's AI credit status and usage
 * @access  Private
 */
router.get('/credits', aiController.getCreditStatus);

/**
 * @route   GET /api/ai/operations
 * @desc    Get available AI operations and their costs
 * @access  Private
 */
router.get('/operations', aiController.getAvailableOperations);

/**
 * @route   GET /api/ai/health
 * @desc    AI service health check
 * @access  Private
 */
router.get('/health', aiController.healthCheck);

module.exports = router;