const AIManager = require('../services/ai/aiManager');
const { validationResult } = require('express-validator');

class AIController {
  constructor() {
    this.aiManager = new AIManager();
  }

  /**
   * Generate event description
   * POST /api/ai/event-description
   */
  generateEventDescription = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user._id;
      const eventData = req.body;

      const result = await this.aiManager.generateEventDescription(userId, eventData);

      if (!result.success) {
        const statusCode = result.code === 'INSUFFICIENT_CREDITS' ? 402 : 500;
        return res.status(statusCode).json({
          success: false,
          message: result.error,
          details: result.details
        });
      }

      res.json({
        success: true,
        data: {
          description: result.content,
          metadata: result.metadata
        }
      });

    } catch (error) {
      console.error('Generate event description error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate event description'
      });
    }
  };

  /**
   * Generate marketing campaign content
   * POST /api/ai/marketing-campaign
   */
  generateMarketingCampaign = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user._id;
      const campaignData = req.body;

      const result = await this.aiManager.generateMarketingCampaign(userId, campaignData);

      if (!result.success) {
        const statusCode = result.code === 'INSUFFICIENT_CREDITS' ? 402 : 500;
        return res.status(statusCode).json({
          success: false,
          message: result.error,
          details: result.details
        });
      }

      res.json({
        success: true,
        data: {
          content: result.content,
          metadata: result.metadata
        }
      });

    } catch (error) {
      console.error('Generate marketing campaign error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate marketing campaign'
      });
    }
  };

  /**
   * Generate social media post
   * POST /api/ai/social-media-post
   */
  generateSocialMediaPost = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user._id;
      const postData = req.body;

      const result = await this.aiManager.generateSocialMediaPost(userId, postData);

      if (!result.success) {
        const statusCode = result.code === 'INSUFFICIENT_CREDITS' ? 402 : 500;
        return res.status(statusCode).json({
          success: false,
          message: result.error,
          details: result.details
        });
      }

      res.json({
        success: true,
        data: {
          post: result.content,
          metadata: result.metadata
        }
      });

    } catch (error) {
      console.error('Generate social media post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate social media post'
      });
    }
  };

  /**
   * Generate SMS campaign
   * POST /api/ai/sms-campaign
   */
  generateSMSCampaign = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user._id;
      const smsData = req.body;

      const result = await this.aiManager.generateSMSCampaign(userId, smsData);

      if (!result.success) {
        const statusCode = result.code === 'INSUFFICIENT_CREDITS' ? 402 : 500;
        return res.status(statusCode).json({
          success: false,
          message: result.error,
          details: result.details
        });
      }

      res.json({
        success: true,
        data: {
          sms: result.content,
          metadata: result.metadata
        }
      });

    } catch (error) {
      console.error('Generate SMS campaign error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate SMS campaign'
      });
    }
  };

  /**
   * Generate business insights
   * POST /api/ai/business-insights
   */
  generateBusinessInsights = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user._id;
      const analyticsData = req.body;

      const result = await this.aiManager.generateBusinessInsights(userId, analyticsData);

      if (!result.success) {
        const statusCode = result.code === 'INSUFFICIENT_CREDITS' ? 402 : 500;
        return res.status(statusCode).json({
          success: false,
          message: result.error,
          details: result.details
        });
      }

      res.json({
        success: true,
        data: {
          insights: result.content,
          metadata: result.metadata
        }
      });

    } catch (error) {
      console.error('Generate business insights error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate business insights'
      });
    }
  };

  /**
   * Generate event title suggestions
   * POST /api/ai/event-titles
   */
  generateEventTitles = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user._id;
      const eventInfo = req.body;

      const result = await this.aiManager.generateEventTitles(userId, eventInfo);

      if (!result.success) {
        const statusCode = result.code === 'INSUFFICIENT_CREDITS' ? 402 : 500;
        return res.status(statusCode).json({
          success: false,
          message: result.error,
          details: result.details
        });
      }

      res.json({
        success: true,
        data: {
          titles: result.content,
          metadata: result.metadata
        }
      });

    } catch (error) {
      console.error('Generate event titles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate event titles'
      });
    }
  };

  /**
   * Improve existing content
   * POST /api/ai/improve-content
   */
  improveContent = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user._id;
      const contentData = req.body;

      const result = await this.aiManager.improveContent(userId, contentData);

      if (!result.success) {
        const statusCode = result.code === 'INSUFFICIENT_CREDITS' ? 402 : 500;
        return res.status(statusCode).json({
          success: false,
          message: result.error,
          details: result.details
        });
      }

      res.json({
        success: true,
        data: {
          improvedContent: result.content,
          metadata: result.metadata
        }
      });

    } catch (error) {
      console.error('Improve content error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to improve content'
      });
    }
  };

  /**
   * Get user's AI credit status
   * GET /api/ai/credits
   */
  getCreditStatus = async (req, res) => {
    try {
      const userId = req.user._id;
      const result = await this.aiManager.getCreditStatus(userId);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Get credit status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get credit status'
      });
    }
  };

  /**
   * Get available AI operations and costs
   * GET /api/ai/operations
   */
  getAvailableOperations = async (req, res) => {
    try {
      const operations = this.aiManager.getAvailableOperations();

      res.json({
        success: true,
        data: operations
      });

    } catch (error) {
      console.error('Get operations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get available operations'
      });
    }
  };

  /**
   * AI service health check
   * GET /api/ai/health
   */
  healthCheck = async (req, res) => {
    try {
      const health = await this.aiManager.healthCheck();

      const statusCode = health.success ? 200 : 503;

      res.status(statusCode).json({
        success: health.success,
        data: health
      });

    } catch (error) {
      console.error('AI health check error:', error);
      res.status(503).json({
        success: false,
        message: 'AI service health check failed'
      });
    }
  };
}

module.exports = new AIController();