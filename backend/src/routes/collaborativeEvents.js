const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {
  inviteCoOrganizers,
  respondToInvitation,
  updateCoOrganizerShare,
  removeCoOrganizer,
  getCollaborativeEvents,
  getRevenueDistribution
} = require('../controllers/collaborativeEventsController');

const {
  validateInviteCoOrganizers,
  validateRespondToInvitation,
  validateUpdateCoOrganizerShare,
  validateRemoveCoOrganizer,
  validateGetCollaborativeEvents,
  validateGetRevenueDistribution,
  validateEventCollaborationEligibility
} = require('../middleware/collaborativeEventsValidation');

const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication to all collaborative event routes
router.use(authenticateToken);

/**
 * @route GET /api/collaborative-events
 * @desc Get all collaborative events for user's organizations
 * @access Private (Authenticated users)
 * @query status - Filter by event status (optional)
 * @query role - Filter by user's role in event (optional)
 * @query page - Pagination page number (optional)
 * @query limit - Results per page (optional)
 */
router.get('/', 
  validateGetCollaborativeEvents,
  getCollaborativeEvents
);

/**
 * @route POST /api/collaborative-events/:id/invite-co-organizers
 * @desc Invite co-organizers to an event
 * @access Private (Main organizer admins only)
 * @body invitations - Array of invitation objects
 */
router.post('/:id/invite-co-organizers',
  validateEventCollaborationEligibility,
  validateInviteCoOrganizers,
  inviteCoOrganizers
);

/**
 * @route POST /api/collaborative-events/:id/respond-invitation
 * @desc Respond to a co-organizer invitation
 * @access Private (Invited organization admins only)
 * @body response - 'accept' or 'decline'
 * @body organizationId - ID of the organization responding
 */
router.post('/:id/respond-invitation',
  validateRespondToInvitation,
  respondToInvitation
);

/**
 * @route PUT /api/collaborative-events/:id/co-organizers/:coOrgId
 * @desc Update co-organizer revenue share
 * @access Private (Main organizer admins only)
 * @body revenueShare - New revenue share percentage
 */
router.put('/:id/co-organizers/:coOrgId',
  validateEventCollaborationEligibility,
  validateUpdateCoOrganizerShare,
  updateCoOrganizerShare
);

/**
 * @route DELETE /api/collaborative-events/:id/co-organizers/:coOrgId
 * @desc Remove co-organizer from event
 * @access Private (Main organizer or co-organizer admins)
 */
router.delete('/:id/co-organizers/:coOrgId',
  validateEventCollaborationEligibility,
  validateRemoveCoOrganizer,
  removeCoOrganizer
);

/**
 * @route GET /api/collaborative-events/:id/revenue-distribution
 * @desc Get revenue distribution for a collaborative event
 * @access Private (Event organizers only)
 */
router.get('/:id/revenue-distribution',
  validateGetRevenueDistribution,
  getRevenueDistribution
);

/**
 * @route GET /api/collaborative-events/:id/collaboration-summary
 * @desc Get collaboration summary for an event
 * @access Private (Event organizers only)
 */
router.get('/:id/collaboration-summary', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const Event = require('../models/Event');
    const User = require('../models/User');

    // Get event with populated data
    const event = await Event.findById(id)
      .populate('organizer', 'name type')
      .populate('coOrganizers.organization', 'name type')
      .populate('createdBy', 'firstName lastName');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has access
    const user = await User.findById(userId);
    const userOrgIds = user.organizations.map(org => org.organizationId.toString());
    
    const hasAccess = userOrgIds.includes(event.organizer._id.toString()) ||
      event.coOrganizers.some(co => 
        userOrgIds.includes(co.organization._id.toString())
      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Calculate collaboration metrics
    const totalCoOrganizers = event.coOrganizers.length;
    const acceptedCoOrganizers = event.coOrganizers.filter(co => co.status === 'accepted').length;
    const pendingInvitations = event.coOrganizers.filter(co => co.status === 'pending').length;
    const declinedInvitations = event.coOrganizers.filter(co => co.status === 'declined').length;

    const totalRevenueShares = event.coOrganizers
      .filter(co => co.status === 'accepted')
      .reduce((sum, co) => sum + co.revenueShare, 0);

    const mainOrganizerShare = 100 - totalRevenueShares - (event.platformFee * 100);

    const summary = {
      eventInfo: {
        id: event._id,
        title: event.title,
        status: event.status,
        startDate: event.startDate,
        ticketsSold: event.ticketsSold,
        totalRevenue: event.totalRevenue
      },
      collaboration: {
        isCollaborative: totalCoOrganizers > 0,
        totalCoOrganizers,
        acceptedCoOrganizers,
        pendingInvitations,
        declinedInvitations,
        collaborationStatus: pendingInvitations > 0 ? 'pending' : 'confirmed'
      },
      revenueDistribution: {
        platformFee: event.platformFee * 100,
        mainOrganizerShare,
        totalCoOrganizerShares: totalRevenueShares,
        breakdown: event.calculateRevenueSplit()
      },
      organizations: {
        main: event.organizer,
        coOrganizers: event.coOrganizers.map(co => ({
          organization: co.organization,
          revenueShare: co.revenueShare,
          status: co.status,
          invitedAt: co.invitedAt,
          respondedAt: co.respondedAt
        }))
      },
      permissions: {
        canInviteCoOrganizers: userOrgIds.includes(event.organizer._id.toString()),
        canModifyShares: userOrgIds.includes(event.organizer._id.toString()) && new Date() < event.startDate,
        canViewRevenue: true
      }
    };

    res.status(200).json({
      success: true,
      message: 'Collaboration summary retrieved successfully',
      data: summary
    });

  } catch (error) {
    console.error('Error getting collaboration summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve collaboration summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/collaborative-events/invitations/pending
 * @desc Get pending invitations for user's organizations
 * @access Private (Authenticated users)
 */
router.get('/invitations/pending', async (req, res) => {
  try {
    const userId = req.user.id;
    const Event = require('../models/Event');
    const User = require('../models/User');

    // Get user's organizations where they are admin
    const user = await User.findById(userId).populate('organizations.organizationId');
    const adminOrgIds = user.organizations
      .filter(org => org.role === 'admin')
      .map(org => org.organizationId._id);

    // Find events with pending invitations to user's organizations
    const eventsWithPendingInvitations = await Event.find({
      'coOrganizers': {
        $elemMatch: {
          organization: { $in: adminOrgIds },
          status: 'pending'
        }
      }
    })
    .populate('organizer', 'name type')
    .populate('coOrganizers.organization', 'name type')
    .sort({ 'coOrganizers.invitedAt': -1 });

    // Extract relevant invitation details
    const pendingInvitations = [];
    eventsWithPendingInvitations.forEach(event => {
      event.coOrganizers
        .filter(co => 
          adminOrgIds.some(orgId => orgId.toString() === co.organization._id.toString()) &&
          co.status === 'pending'
        )
        .forEach(co => {
          pendingInvitations.push({
            invitationId: co._id,
            event: {
              id: event._id,
              title: event.title,
              startDate: event.startDate,
              endDate: event.endDate,
              venue: event.venue,
              status: event.status
            },
            organizer: event.organizer,
            invitedOrganization: co.organization,
            revenueShare: co.revenueShare,
            invitedAt: co.invitedAt,
            message: co.message,
            daysAgo: Math.floor((new Date() - new Date(co.invitedAt)) / (1000 * 60 * 60 * 24))
          });
        });
    });

    res.status(200).json({
      success: true,
      message: 'Pending invitations retrieved successfully',
      data: {
        invitations: pendingInvitations,
        total: pendingInvitations.length
      }
    });

  } catch (error) {
    console.error('Error getting pending invitations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pending invitations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/collaborative-events/statistics
 * @desc Get collaboration statistics for user's organizations
 * @access Private (Authenticated users)
 */
router.get('/statistics', async (req, res) => {
  try {
    const userId = req.user.id;
    const Event = require('../models/Event');
    const User = require('../models/User');

    // Get user's organizations
    const user = await User.findById(userId);
    const userOrgIds = user.organizations.map(org => org.organizationId.toString());

    // Get collaboration statistics
    const stats = await Event.aggregate([
      {
        $match: {
          $or: [
            { organizer: { $in: userOrgIds.map(id => new mongoose.Types.ObjectId(id)) } },
            { 'coOrganizers.organization': { $in: userOrgIds.map(id => new mongoose.Types.ObjectId(id)) } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          collaborativeEvents: {
            $sum: {
              $cond: [{ $gt: [{ $size: '$coOrganizers' }, 0] }, 1, 0]
            }
          },
          totalRevenue: { $sum: '$totalRevenue' },
          eventsAsMainOrganizer: {
            $sum: {
              $cond: [{ $in: ['$organizer', userOrgIds.map(id => new mongoose.Types.ObjectId(id))] }, 1, 0]
            }
          },
          eventsAsCoOrganizer: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $not: { $in: ['$organizer', userOrgIds.map(id => new mongoose.Types.ObjectId(id))] } },
                    { $gt: [{ $size: '$coOrganizers' }, 0] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const statistics = stats[0] || {
      totalEvents: 0,
      collaborativeEvents: 0,
      totalRevenue: 0,
      eventsAsMainOrganizer: 0,
      eventsAsCoOrganizer: 0
    };

    // Calculate collaboration rate
    statistics.collaborationRate = statistics.totalEvents > 0 
      ? (statistics.collaborativeEvents / statistics.totalEvents) * 100 
      : 0;

    res.status(200).json({
      success: true,
      message: 'Collaboration statistics retrieved successfully',
      data: statistics
    });

  } catch (error) {
    console.error('Error getting collaboration statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve collaboration statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;