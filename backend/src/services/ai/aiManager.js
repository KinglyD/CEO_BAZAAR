const ClaudeService = require('./claudeService');
const AICreditsService = require('./aiCreditsService');

class AIManager {
  constructor() {
    this.claudeService = new ClaudeService();
    this.creditsService = new AICreditsService();
  }

  /**
   * Generate AI content with credit management
   * @param {string} userId - User ID
   * @param {string} operation - AI operation type
   * @param {Object} data - Input data for AI generation
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - AI generation result with credit tracking
   */
  async generateWithCredits(userId, operation, data, options = {}) {
    try {
      // Check if user has enough credits
      const creditCheck = await this.creditsService.checkCredits(userId, operation);
      if (!creditCheck.success) {
        return {
          success: false,
          error: creditCheck.error,
          code: 'INSUFFICIENT_CREDITS',
          details: creditCheck
        };
      }

      // Generate content based on operation type
      let result;
      
      switch (operation) {
        case 'event_description':
          result = await this.claudeService.generateEventDescription(data);
          break;
          
        case 'marketing_campaign':
          result = await this.claudeService.generateMarketingCampaign(data);
          break;
          
        case 'social_media_post':
          result = await this.claudeService.generateSocialMediaPost(data);
          break;
          
        case 'sms_campaign':
          result = await this.claudeService.generateSMSCampaign(data);
          break;
          
        case 'business_insights':
          result = await this.claudeService.generateBusinessInsights(data);
          break;
          
        default:
          // Generic content generation
          result = await this.claudeService.generateContent(data.prompt, options);
      }

      // If AI generation failed, don't deduct credits
      if (!result.success) {
        return {
          success: false,
          error: 'AI generation failed',
          details: result,
          creditsDeducted: false
        };
      }

      // Deduct credits after successful generation
      const creditDeduction = await this.creditsService.deductCredits(userId, operation, {
        tokensUsed: result.usage?.totalTokens || 0,
        model: result.model || 'claude-3-5-sonnet',
        contentLength: result.content?.length || 0
      });

      if (!creditDeduction.success) {
        console.error('Credit deduction failed after AI generation:', creditDeduction.error);
        // Still return the AI result even if credit tracking fails
      }

      return {
        success: true,
        content: result.content,
        metadata: {
          operation,
          model: result.model,
          usage: result.usage,
          finishReason: result.finishReason,
          credits: creditDeduction.success ? {
            deducted: creditDeduction.creditsDeducted,
            remaining: creditDeduction.remainingCredits
          } : null,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('AI Manager error:', error);
      return {
        success: false,
        error: 'AI generation failed',
        details: error.message
      };
    }
  }

  /**
   * Generate event description with AI
   * @param {string} userId - User ID
   * @param {Object} eventData - Event information
   * @returns {Promise<Object>} - Generated description
   */
  async generateEventDescription(userId, eventData) {
    return await this.generateWithCredits(userId, 'event_description', eventData);
  }

  /**
   * Generate marketing campaign content
   * @param {string} userId - User ID
   * @param {Object} campaignData - Campaign information
   * @returns {Promise<Object>} - Generated campaign content
   */
  async generateMarketingCampaign(userId, campaignData) {
    return await this.generateWithCredits(userId, 'marketing_campaign', campaignData);
  }

  /**
   * Generate social media post
   * @param {string} userId - User ID
   * @param {Object} postData - Post information
   * @returns {Promise<Object>} - Generated social media content
   */
  async generateSocialMediaPost(userId, postData) {
    return await this.generateWithCredits(userId, 'social_media_post', postData);
  }

  /**
   * Generate SMS campaign messages
   * @param {string} userId - User ID
   * @param {Object} smsData - SMS campaign data
   * @returns {Promise<Object>} - Generated SMS content
   */
  async generateSMSCampaign(userId, smsData) {
    return await this.generateWithCredits(userId, 'sms_campaign', smsData);
  }

  /**
   * Generate business insights from data
   * @param {string} userId - User ID
   * @param {Object} analyticsData - Data for analysis
   * @returns {Promise<Object>} - Generated insights
   */
  async generateBusinessInsights(userId, analyticsData) {
    return await this.generateWithCredits(userId, 'business_insights', analyticsData);
  }

  /**
   * Generate event title suggestions
   * @param {string} userId - User ID
   * @param {Object} eventInfo - Basic event information
   * @returns {Promise<Object>} - Generated title suggestions
   */
  async generateEventTitles(userId, eventInfo) {
    const promptData = {
      prompt: `Generate 5 creative and engaging event titles for:
      
Category: ${eventInfo.category}
Type: ${eventInfo.type || 'General Event'}
Target Audience: ${eventInfo.targetAudience || 'General Public'}
Location: ${eventInfo.location || 'Uganda'}
Key Theme: ${eventInfo.theme || ''}
Brief Description: ${eventInfo.briefDescription || ''}

Requirements:
- Titles should be catchy and memorable
- Appropriate for ${eventInfo.category} events
- Appeal to ${eventInfo.targetAudience || 'general audience'}
- Between 3-8 words each
- Include cultural relevance for East Africa when appropriate

Return as a numbered list of 5 titles.`
    };

    return await this.generateWithCredits(userId, 'event_title_suggestion', promptData);
  }

  /**
   * Improve existing content
   * @param {string} userId - User ID
   * @param {Object} contentData - Content to improve
   * @returns {Promise<Object>} - Improved content
   */
  async improveContent(userId, contentData) {
    const promptData = {
      prompt: `Improve the following ${contentData.type} content:

Original Content:
${contentData.content}

Improvement Goals:
${contentData.goals?.join(', ') || 'Enhance clarity, engagement, and effectiveness'}

Target Audience: ${contentData.audience || 'General'}
Tone: ${contentData.tone || 'Professional'}

Please provide an improved version that is more engaging, clear, and effective while maintaining the original intent.`
    };

    return await this.generateWithCredits(userId, 'content_improvement', promptData);
  }

  /**
   * Get user's AI credit status
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Credit status
   */
  async getCreditStatus(userId) {
    return await this.creditsService.getCreditStatus(userId);
  }

  /**
   * Add credits to user account
   * @param {string} userId - User ID
   * @param {number} amount - Credits to add
   * @param {string} reason - Reason for adding credits
   * @returns {Promise<Object>} - Addition result
   */
  async addCredits(userId, amount, reason) {
    return await this.creditsService.addCredits(userId, amount, reason);
  }

  /**
   * Get available AI operations and costs
   * @returns {Object} - Operations and costs
   */
  getAvailableOperations() {
    return this.creditsService.getAllOperations();
  }

  /**
   * Health check for AI services
   * @returns {Promise<Object>} - Health status
   */
  async healthCheck() {
    const claudeHealth = await this.claudeService.healthCheck();
    
    return {
      success: claudeHealth.success,
      services: {
        claude: claudeHealth,
        credits: { success: true, status: 'healthy' }
      },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = AIManager;