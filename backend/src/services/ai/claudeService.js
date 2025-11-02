const Anthropic = require('@anthropic-ai/sdk');

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';
    this.maxTokens = parseInt(process.env.CLAUDE_MAX_TOKENS) || 4000;
    this.temperature = parseFloat(process.env.CLAUDE_TEMPERATURE) || 0.7;
  }

  /**
   * Generate content using Claude
   * @param {string} prompt - The prompt to send to Claude
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Claude response
   */
  async generateContent(prompt, options = {}) {
    try {
      const {
        maxTokens = this.maxTokens,
        temperature = this.temperature,
        system = null
      } = options;

      const messages = [
        {
          role: 'user',
          content: prompt
        }
      ];

      const requestConfig = {
        model: this.model,
        max_tokens: maxTokens,
        temperature: temperature,
        messages: messages
      };

      // Add system message if provided
      if (system) {
        requestConfig.system = system;
      }

      const response = await this.client.messages.create(requestConfig);

      return {
        success: true,
        content: response.content[0].text,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens
        },
        model: this.model,
        finishReason: response.stop_reason
      };

    } catch (error) {
      console.error('Claude API Error:', error);
      
      return {
        success: false,
        error: error.message,
        code: error.status || 'CLAUDE_ERROR'
      };
    }
  }

  /**
   * Generate event description using Claude
   * @param {Object} eventData - Event information
   * @returns {Promise<Object>} - Generated description
   */
  async generateEventDescription(eventData) {
    const { title, category, venue, date, organizer, briefDescription } = eventData;

    const systemPrompt = `You are an expert event marketing copywriter specializing in East African events. 
    Create compelling, culturally appropriate event descriptions that drive ticket sales.
    
    Guidelines:
    - Write in engaging, professional tone
    - Include key event details naturally
    - Add excitement and urgency
    - Use local cultural context when appropriate
    - Keep descriptions between 150-300 words
    - Include clear call-to-action`;

    const prompt = `Create an engaging event description for:

Event Title: ${title}
Category: ${category}
Venue: ${venue?.name || 'TBD'} ${venue?.city ? `in ${venue.city}` : ''}
Date: ${date ? new Date(date).toLocaleDateString() : 'Date TBD'}
Organizer: ${organizer}
Brief: ${briefDescription || 'No additional details provided'}

Generate a compelling description that will attract attendees and drive ticket sales.`;

    return await this.generateContent(prompt, { 
      system: systemPrompt,
      maxTokens: 800,
      temperature: 0.8 
    });
  }

  /**
   * Generate marketing campaign content
   * @param {Object} campaignData - Campaign information
   * @returns {Promise<Object>} - Generated campaign content
   */
  async generateMarketingCampaign(campaignData) {
    const { 
      eventTitle, 
      targetAudience, 
      platform, 
      tone = 'professional',
      campaignGoal = 'ticket_sales'
    } = campaignData;

    const systemPrompt = `You are a marketing expert specializing in event promotion in East Africa.
    Create compelling marketing content that resonates with local audiences and drives action.
    
    Guidelines:
    - Understand cultural nuances and local preferences
    - Use appropriate tone for the target audience
    - Include relevant hashtags and call-to-actions
    - Consider platform-specific best practices
    - Drive urgency and FOMO (Fear of Missing Out)`;

    const prompt = `Create marketing content for:

Event: ${eventTitle}
Target Audience: ${targetAudience}
Platform: ${platform} (Facebook, Instagram, SMS, Email, etc.)
Tone: ${tone}
Goal: ${campaignGoal}

Generate compelling copy that will drive ${campaignGoal} for this event.`;

    return await this.generateContent(prompt, { 
      system: systemPrompt,
      maxTokens: 1000,
      temperature: 0.9 
    });
  }

  /**
   * Generate business insights and analytics
   * @param {Object} analyticsData - Data for analysis
   * @returns {Promise<Object>} - Generated insights
   */
  async generateBusinessInsights(analyticsData) {
    const systemPrompt = `You are a business intelligence analyst specializing in event management and entertainment industry analytics.
    Provide actionable insights based on data patterns and industry knowledge.
    
    Guidelines:
    - Focus on actionable recommendations
    - Identify trends and opportunities
    - Provide specific, measurable suggestions
    - Consider market context and seasonality
    - Be concise but comprehensive`;

    const prompt = `Analyze the following event business data and provide insights:

${JSON.stringify(analyticsData, null, 2)}

Provide key insights, trends, and actionable recommendations for improving event performance and revenue.`;

    return await this.generateContent(prompt, { 
      system: systemPrompt,
      maxTokens: 1500,
      temperature: 0.3 
    });
  }

  /**
   * Generate social media posts
   * @param {Object} postData - Post information
   * @returns {Promise<Object>} - Generated social media content
   */
  async generateSocialMediaPost(postData) {
    const { 
      eventTitle, 
      platform, 
      postType = 'announcement',
      eventDate,
      venue
    } = postData;

    const systemPrompt = `You are a social media expert creating engaging posts for event promotion.
    Create platform-appropriate content that maximizes engagement and drives ticket sales.
    
    Platform Guidelines:
    - Facebook: Longer form, storytelling, community building
    - Instagram: Visual focus, hashtags, stories-friendly
    - Twitter/X: Concise, trending topics, real-time updates
    - LinkedIn: Professional, networking angle
    - TikTok: Trendy, Gen-Z friendly, behind-scenes`;

    const prompt = `Create a ${postType} social media post for ${platform}:

Event: ${eventTitle}
Date: ${eventDate ? new Date(eventDate).toLocaleDateString() : 'TBD'}
Venue: ${venue || 'TBD'}
Post Type: ${postType}

Include appropriate hashtags, emojis, and call-to-action for ${platform}.`;

    return await this.generateContent(prompt, { 
      system: systemPrompt,
      maxTokens: 500,
      temperature: 0.8 
    });
  }

  /**
   * Generate SMS campaign messages
   * @param {Object} smsData - SMS campaign data
   * @returns {Promise<Object>} - Generated SMS content
   */
  async generateSMSCampaign(smsData) {
    const { 
      eventTitle, 
      customerName,
      messageType = 'promotion',
      urgency = 'medium'
    } = smsData;

    const systemPrompt = `You are an SMS marketing expert creating concise, action-driven messages.
    SMS messages must be under 160 characters and drive immediate action.
    
    Guidelines:
    - Keep under 160 characters
    - Include clear call-to-action
    - Create urgency when appropriate
    - Personalize when possible
    - Include opt-out option when required`;

    const prompt = `Create an SMS ${messageType} message:

Event: ${eventTitle}
Customer: ${customerName || 'Valued Customer'}
Message Type: ${messageType}
Urgency Level: ${urgency}

Create a compelling SMS under 160 characters that drives ticket purchases.`;

    return await this.generateContent(prompt, { 
      system: systemPrompt,
      maxTokens: 200,
      temperature: 0.7 
    });
  }

  /**
   * Check API health and connectivity
   * @returns {Promise<Object>} - Health check result
   */
  async healthCheck() {
    try {
      const response = await this.generateContent('Hello, can you respond with a simple "OK" message?', {
        maxTokens: 10,
        temperature: 0
      });

      return {
        success: response.success,
        provider: 'Claude',
        model: this.model,
        status: response.success ? 'healthy' : 'error',
        responseTime: Date.now(),
        error: response.error || null
      };
    } catch (error) {
      return {
        success: false,
        provider: 'Claude',
        status: 'error',
        error: error.message
      };
    }
  }
}

module.exports = ClaudeService;