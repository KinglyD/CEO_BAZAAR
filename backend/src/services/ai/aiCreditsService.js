const User = require('../../models/User');
const Organization = require('../../models/Organization');

class AICreditsService {
  constructor() {
    // Credit costs for different AI operations
    this.creditCosts = {
      // Content Generation
      'event_description': 3,
      'event_title_suggestion': 1,
      'marketing_campaign': 5,
      'social_media_post': 2,
      'sms_campaign': 1,
      
      // Business Intelligence
      'business_insights': 8,
      'pricing_analysis': 6,
      'trend_analysis': 10,
      'revenue_forecast': 12,
      
      // Content Enhancement
      'content_improvement': 2,
      'seo_optimization': 3,
      'translation': 2,
      
      // Analytics & Reports
      'performance_report': 15,
      'competitor_analysis': 10,
      'market_research': 20,
      
      // Image & Media
      'image_description': 1,
      'alt_text_generation': 1
    };

    // Plan limits
    this.planLimits = {
      'free': {
        monthlyCredits: 10,
        features: ['event_description', 'social_media_post', 'sms_campaign']
      },
      'pro': {
        monthlyCredits: 100,
        features: [
          'event_description', 'event_title_suggestion', 'marketing_campaign',
          'social_media_post', 'sms_campaign', 'business_insights', 'pricing_analysis',
          'content_improvement', 'seo_optimization', 'translation'
        ]
      },
      'premium': {
        monthlyCredits: 500,
        features: 'all' // All AI features available
      }
    };
  }

  /**
   * Check if user has enough credits for an operation
   * @param {string} userId - User ID
   * @param {string} operation - AI operation type
   * @returns {Promise<Object>} - Credit check result
   */
  async checkCredits(userId, operation) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const costRequired = this.creditCosts[operation] || 1;
      const userCredits = user.subscription.aiCredits;
      const planLimits = this.planLimits[user.subscription.plan] || this.planLimits.free;

      // Check if feature is available for user's plan
      if (planLimits.features !== 'all' && !planLimits.features.includes(operation)) {
        return {
          success: false,
          error: 'Feature not available in your plan',
          requiredPlan: this.getMinimumPlanForFeature(operation),
          currentPlan: user.subscription.plan
        };
      }

      // Check if user has enough credits
      if (userCredits.remaining < costRequired) {
        return {
          success: false,
          error: 'Insufficient AI credits',
          required: costRequired,
          available: userCredits.remaining,
          nextReset: userCredits.lastResetDate
        };
      }

      return {
        success: true,
        cost: costRequired,
        remaining: userCredits.remaining,
        afterDeduction: userCredits.remaining - costRequired
      };

    } catch (error) {
      console.error('Credit check error:', error);
      return { success: false, error: 'Credit check failed' };
    }
  }

  /**
   * Deduct credits for AI operation
   * @param {string} userId - User ID
   * @param {string} operation - AI operation type
   * @param {Object} metadata - Additional operation metadata
   * @returns {Promise<Object>} - Deduction result
   */
  async deductCredits(userId, operation, metadata = {}) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const costRequired = this.creditCosts[operation] || 1;
      
      // Check credits first
      const creditCheck = await this.checkCredits(userId, operation);
      if (!creditCheck.success) {
        return creditCheck;
      }

      // Deduct credits
      user.subscription.aiCredits.used += costRequired;
      user.subscription.aiCredits.remaining -= costRequired;

      // Add to usage history
      user.subscription.aiCredits.history.push({
        date: new Date(),
        action: 'used',
        amount: costRequired,
        feature: operation,
        remaining: user.subscription.aiCredits.remaining,
        metadata: {
          ...metadata,
          operation,
          timestamp: new Date().toISOString()
        }
      });

      // Update AI usage statistics
      if (!user.subscription.aiUsage[operation]) {
        user.subscription.aiUsage[operation] = {
          totalGenerated: 0,
          lastUsed: new Date()
        };
      }
      
      user.subscription.aiUsage[operation].totalGenerated += 1;
      user.subscription.aiUsage[operation].lastUsed = new Date();

      // Keep only last 50 history entries
      if (user.subscription.aiCredits.history.length > 50) {
        user.subscription.aiCredits.history = user.subscription.aiCredits.history.slice(-50);
      }

      await user.save();

      return {
        success: true,
        creditsDeducted: costRequired,
        remainingCredits: user.subscription.aiCredits.remaining,
        operation,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Credit deduction error:', error);
      return { success: false, error: 'Credit deduction failed' };
    }
  }

  /**
   * Add credits to user account (for admin or purchase)
   * @param {string} userId - User ID
   * @param {number} amount - Credits to add
   * @param {string} reason - Reason for adding credits
   * @returns {Promise<Object>} - Addition result
   */
  async addCredits(userId, amount, reason = 'manual_addition') {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      user.subscription.aiCredits.remaining += amount;
      user.subscription.aiCredits.total += amount;

      // Add to history
      user.subscription.aiCredits.history.push({
        date: new Date(),
        action: 'added',
        amount: amount,
        feature: 'credit_purchase',
        remaining: user.subscription.aiCredits.remaining,
        metadata: { reason, timestamp: new Date().toISOString() }
      });

      await user.save();

      return {
        success: true,
        creditsAdded: amount,
        newBalance: user.subscription.aiCredits.remaining,
        reason
      };

    } catch (error) {
      console.error('Credit addition error:', error);
      return { success: false, error: 'Credit addition failed' };
    }
  }

  /**
   * Reset monthly credits for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Reset result
   */
  async resetMonthlyCredits(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const plan = user.subscription.plan || 'free';
      const monthlyAllowance = this.planLimits[plan].monthlyCredits;

      // Reset credits
      user.subscription.aiCredits.used = 0;
      user.subscription.aiCredits.remaining = monthlyAllowance;
      user.subscription.aiCredits.total = monthlyAllowance;
      user.subscription.aiCredits.lastResetDate = new Date();

      // Add reset to history
      user.subscription.aiCredits.history.push({
        date: new Date(),
        action: 'reset',
        amount: monthlyAllowance,
        feature: 'monthly_reset',
        remaining: monthlyAllowance,
        metadata: { 
          plan, 
          resetDate: new Date().toISOString(),
          previousUsed: user.subscription.aiCredits.used
        }
      });

      await user.save();

      return {
        success: true,
        newBalance: monthlyAllowance,
        plan,
        resetDate: new Date()
      };

    } catch (error) {
      console.error('Credit reset error:', error);
      return { success: false, error: 'Credit reset failed' };
    }
  }

  /**
   * Get user's credit status and usage statistics
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Credit status
   */
  async getCreditStatus(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const plan = user.subscription.plan || 'free';
      const planLimits = this.planLimits[plan];
      
      return {
        success: true,
        credits: {
          remaining: user.subscription.aiCredits.remaining,
          used: user.subscription.aiCredits.used,
          total: user.subscription.aiCredits.total,
          lastResetDate: user.subscription.aiCredits.lastResetDate
        },
        plan: {
          name: plan,
          monthlyAllowance: planLimits.monthlyCredits,
          availableFeatures: planLimits.features
        },
        usage: user.subscription.aiUsage,
        history: user.subscription.aiCredits.history.slice(-10) // Last 10 entries
      };

    } catch (error) {
      console.error('Get credit status error:', error);
      return { success: false, error: 'Failed to get credit status' };
    }
  }

  /**
   * Get minimum plan required for a feature
   * @param {string} operation - AI operation
   * @returns {string} - Minimum plan name
   */
  getMinimumPlanForFeature(operation) {
    for (const [planName, planConfig] of Object.entries(this.planLimits)) {
      if (planConfig.features === 'all' || planConfig.features.includes(operation)) {
        return planName;
      }
    }
    return 'premium'; // Default to premium if not found
  }

  /**
   * Get credit cost for an operation
   * @param {string} operation - AI operation
   * @returns {number} - Credit cost
   */
  getCreditCost(operation) {
    return this.creditCosts[operation] || 1;
  }

  /**
   * Get all available AI operations and their costs
   * @returns {Object} - Operations and costs
   */
  getAllOperations() {
    return {
      operations: this.creditCosts,
      plans: this.planLimits
    };
  }
}

module.exports = AICreditsService;