const Event = require('../models/Event');
const Organization = require('../models/Organization');
const AIManager = require('../services/ai/aiManager');
const { validationResult } = require('express-validator');

class EventController {
  constructor() {
    this.aiManager = new AIManager();
  }

  /**
   * Create new event
   * POST /api/events
   */
  createEvent = async (req, res) => {
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
      const { organizationId } = req.body;

      // Verify user has access to organization
      const userOrg = req.user.organizations.find(
        org => org.organization.toString() === organizationId
      );

      if (!userOrg || !userOrg.permissions.canCreateEvents) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to create events for this organization'
        });
      }

      // Generate unique slug
      const baseSlug = req.body.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const timestamp = Date.now();
      const slug = `${baseSlug}-${timestamp}`;

      // Create event
      const eventData = {
        ...req.body,
        slug,
        organizer: organizationId,
        createdBy: userId,
        status: 'draft'
      };

      const event = new Event(eventData);
      await event.save();

      // Populate organizer details for response
      await event.populate('organizer', 'name slug email');

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: { event }
      });

    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create event'
      });
    }
  };

  /**
   * Create event with AI-generated description
   * POST /api/events/ai-create
   */
  createEventWithAI = async (req, res) => {
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
      const { organizationId, generateDescription = true, generateTitles = false } = req.body;

      // Verify organization access
      const userOrg = req.user.organizations.find(
        org => org.organization.toString() === organizationId
      );

      if (!userOrg || !userOrg.permissions.canCreateEvents) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to create events for this organization'
        });
      }

      let aiResults = {};

      // Generate AI description if requested
      if (generateDescription) {
        const descriptionResult = await this.aiManager.generateEventDescription(userId, {
          title: req.body.title,
          category: req.body.category,
          venue: req.body.venue,
          date: req.body.startDate,
          organizer: req.user.organizations.find(org => org.organization.toString() === organizationId)?.organization?.name,
          briefDescription: req.body.briefDescription
        });

        if (descriptionResult.success) {
          aiResults.generatedDescription = descriptionResult.content;
          req.body.description = descriptionResult.content;
        } else {
          // If AI fails, continue without it but log the error
          console.warn('AI description generation failed:', descriptionResult.error);
        }
      }

      // Generate title suggestions if requested
      if (generateTitles) {
        const titlesResult = await this.aiManager.generateEventTitles(userId, {
          category: req.body.category,
          type: req.body.type,
          targetAudience: req.body.targetAudience,
          location: req.body.venue?.city,
          theme: req.body.theme,
          briefDescription: req.body.briefDescription
        });

        if (titlesResult.success) {
          aiResults.suggestedTitles = titlesResult.content;
        }
      }

      // Generate unique slug
      const baseSlug = req.body.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const timestamp = Date.now();
      const slug = `${baseSlug}-${timestamp}`;

      // Create event with AI enhancements
      const eventData = {
        ...req.body,
        slug,
        organizer: organizationId,
        createdBy: userId,
        status: 'draft',
        aiEnhanced: generateDescription || generateTitles
      };

      const event = new Event(eventData);
      await event.save();

      // Populate organizer details
      await event.populate('organizer', 'name slug email');

      res.status(201).json({
        success: true,
        message: 'Event created successfully with AI enhancements',
        data: {
          event,
          ai: aiResults
        }
      });

    } catch (error) {
      console.error('Create AI event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create event with AI'
      });
    }
  };

  /**
   * Get all events with filtering and pagination
   * GET /api/events
   */
  getEvents = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        status,
        organizer,
        startDate,
        endDate,
        search,
        featured,
        sort = '-createdAt'
      } = req.query;

      // Build filter query
      const filter = {};

      if (category) filter.category = category;
      if (status) filter.status = status;
      if (organizer) filter.organizer = organizer;
      if (featured !== undefined) filter.isFeatured = featured === 'true';

      // Date range filter
      if (startDate || endDate) {
        filter.startDate = {};
        if (startDate) filter.startDate.$gte = new Date(startDate);
        if (endDate) filter.startDate.$lte = new Date(endDate);
      }

      // Text search
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'venue.name': { $regex: search, $options: 'i' } }
        ];
      }

      // Only show active events to public (unless admin)
      if (!req.user || !req.user.isAdmin) {
        filter.status = { $in: ['active', 'published'] };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [events, totalEvents] = await Promise.all([
        Event.find(filter)
          .populate('organizer', 'name slug email')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        Event.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalEvents / parseInt(limit));

      res.json({
        success: true,
        data: {
          events,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalEvents,
            hasNext: parseInt(page) < totalPages,
            hasPrev: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Get events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch events'
      });
    }
  };

  /**
   * Get single event by ID or slug
   * GET /api/events/:identifier
   */
  getEvent = async (req, res) => {
    try {
      const { identifier } = req.params;

      // Try to find by ID first, then by slug
      let event = await Event.findById(identifier).populate('organizer coOrganizers.organization');
      
      if (!event) {
        event = await Event.findOne({ slug: identifier }).populate('organizer coOrganizers.organization');
      }

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      res.json({
        success: true,
        data: { event }
      });

    } catch (error) {
      console.error('Get event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch event'
      });
    }
  };

  /**
   * Update event
   * PUT /api/events/:id
   */
  updateEvent = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const userId = req.user._id;

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Check if user has permission to update this event
      const userOrg = req.user.organizations.find(
        org => org.organization.toString() === event.organizer.toString()
      );

      if (!userOrg || !userOrg.permissions.canCreateEvents) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this event'
        });
      }

      // Update event
      Object.assign(event, req.body);
      event.updatedBy = userId;
      await event.save();

      await event.populate('organizer', 'name slug email');

      res.json({
        success: true,
        message: 'Event updated successfully',
        data: { event }
      });

    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update event'
      });
    }
  };

  /**
   * Delete event
   * DELETE /api/events/:id
   */
  deleteEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Check permission
      const userOrg = req.user.organizations.find(
        org => org.organization.toString() === event.organizer.toString()
      );

      if (!userOrg || !userOrg.permissions.canCreateEvents) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this event'
        });
      }

      // Soft delete - change status to 'deleted'
      event.status = 'deleted';
      event.deletedAt = new Date();
      event.deletedBy = userId;
      await event.save();

      res.json({
        success: true,
        message: 'Event deleted successfully'
      });

    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete event'
      });
    }
  };

  /**
   * Generate AI suggestions for existing event
   * POST /api/events/:id/ai-enhance
   */
  enhanceEventWithAI = async (req, res) => {
    try {
      const { id } = req.params;
      const { enhanceDescription, generateTitles, improveContent } = req.body;
      const userId = req.user._id;

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Check permission
      const userOrg = req.user.organizations.find(
        org => org.organization.toString() === event.organizer.toString()
      );

      if (!userOrg || !userOrg.permissions.canCreateEvents) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to enhance this event'
        });
      }

      let aiResults = {};

      // Enhance description
      if (enhanceDescription) {
        const result = await this.aiManager.generateEventDescription(userId, {
          title: event.title,
          category: event.category,
          venue: event.venue,
          date: event.startDate,
          organizer: event.organizer.name,
          briefDescription: event.description
        });

        if (result.success) {
          aiResults.enhancedDescription = result.content;
        }
      }

      // Generate title suggestions
      if (generateTitles) {
        const result = await this.aiManager.generateEventTitles(userId, {
          category: event.category,
          targetAudience: event.targetAudience,
          location: event.venue?.city,
          briefDescription: event.description
        });

        if (result.success) {
          aiResults.suggestedTitles = result.content;
        }
      }

      // Improve existing content
      if (improveContent && event.description) {
        const result = await this.aiManager.improveContent(userId, {
          content: event.description,
          type: 'event_description',
          goals: ['engagement', 'clarity', 'conversion'],
          audience: event.targetAudience
        });

        if (result.success) {
          aiResults.improvedContent = result.content;
        }
      }

      res.json({
        success: true,
        message: 'AI enhancements generated successfully',
        data: {
          event: {
            id: event._id,
            title: event.title,
            currentDescription: event.description
          },
          ai: aiResults
        }
      });

    } catch (error) {
      console.error('Enhance event AI error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to enhance event with AI'
      });
    }
  };

  /**
   * Get events by organization
   * GET /api/events/organization/:orgId
   */
  getEventsByOrganization = async (req, res) => {
    try {
      const { orgId } = req.params;
      const { page = 1, limit = 20, status } = req.query;

      // Check if user has access to this organization
      if (req.user) {
        const userOrg = req.user.organizations.find(
          org => org.organization.toString() === orgId
        );
        
        if (!userOrg) {
          return res.status(403).json({
            success: false,
            message: 'Access denied to this organization'
          });
        }
      }

      const filter = { organizer: orgId };
      if (status) filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [events, totalEvents] = await Promise.all([
        Event.find(filter)
          .populate('organizer', 'name slug')
          .sort('-createdAt')
          .skip(skip)
          .limit(parseInt(limit)),
        Event.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalEvents / parseInt(limit));

      res.json({
        success: true,
        data: {
          events,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalEvents,
            hasNext: parseInt(page) < totalPages,
            hasPrev: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Get organization events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch organization events'
      });
    }
  };
}

module.exports = new EventController();