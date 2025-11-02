const Event = require('../models/Event');
const Organization = require('../models/Organization');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Invite co-organizers to an event
 * POST /api/events/:id/invite-co-organizers
 */
const inviteCoOrganizers = async (req, res) => {
  try {
    const { id } = req.params;
    const { invitations } = req.body; // Array of { organizationId, revenueShare, message }
    const userId = req.user.id;

    // Validate event exists and user has permission
    const event = await Event.findById(id).populate('organizer');
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is admin of the organizing organization
    const isOrganizerAdmin = event.organizer.members.some(
      member => member.userId.toString() === userId && member.role === 'admin'
    );

    if (!isOrganizerAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only organizer admins can invite co-organizers'
      });
    }

    // Validate revenue shares don't exceed 100%
    const totalExistingShares = event.coOrganizers
      .filter(co => co.status === 'accepted')
      .reduce((sum, co) => sum + co.revenueShare, 0);
    
    const totalNewShares = invitations.reduce((sum, inv) => sum + inv.revenueShare, 0);
    
    if (totalExistingShares + totalNewShares > 80) { // Max 80% for co-organizers, 20% minimum for main organizer
      return res.status(400).json({
        success: false,
        message: 'Total revenue share cannot exceed 80%. Main organizer must retain at least 20%.'
      });
    }

    // Validate organizations exist
    const organizationIds = invitations.map(inv => inv.organizationId);
    const organizations = await Organization.find({ _id: { $in: organizationIds } });
    
    if (organizations.length !== organizationIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more organizations not found'
      });
    }

    // Check for duplicate invitations
    const existingCoOrgIds = event.coOrganizers.map(co => co.organization.toString());
    const duplicateInvitations = invitations.filter(inv => 
      existingCoOrgIds.includes(inv.organizationId) || inv.organizationId === event.organizer._id.toString()
    );

    if (duplicateInvitations.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot invite organizations that are already co-organizers or the main organizer'
      });
    }

    // Add invitations to event
    const newInvitations = invitations.map(inv => ({
      organization: inv.organizationId,
      revenueShare: inv.revenueShare,
      status: 'pending',
      invitedAt: new Date(),
      message: inv.message
    }));

    event.coOrganizers.push(...newInvitations);
    await event.save();

    // TODO: Send notification emails/messages to invited organizations
    // This would typically integrate with a notification service

    await event.populate('coOrganizers.organization');

    res.status(200).json({
      success: true,
      message: 'Co-organizer invitations sent successfully',
      data: {
        event: {
          id: event._id,
          title: event.title,
          coOrganizers: event.coOrganizers
        }
      }
    });

  } catch (error) {
    console.error('Error inviting co-organizers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send co-organizer invitations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Respond to co-organizer invitation
 * POST /api/events/:id/respond-invitation
 */
const respondToInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { response, organizationId } = req.body; // response: 'accept' | 'decline'
    const userId = req.user.id;

    // Validate event exists
    const event = await Event.findById(id).populate('coOrganizers.organization');
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Find the invitation
    const invitationIndex = event.coOrganizers.findIndex(
      co => co.organization._id.toString() === organizationId && co.status === 'pending'
    );

    if (invitationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found or already responded'
      });
    }

    // Check if user is admin of the invited organization
    const organization = await Organization.findById(organizationId);
    const isOrgAdmin = organization.members.some(
      member => member.userId.toString() === userId && member.role === 'admin'
    );

    if (!isOrgAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only organization admins can respond to invitations'
      });
    }

    // Update invitation status
    event.coOrganizers[invitationIndex].status = response === 'accept' ? 'accepted' : 'declined';
    event.coOrganizers[invitationIndex].respondedAt = new Date();

    // If declined, remove revenue share (optional: keep for historical record)
    if (response === 'decline') {
      event.coOrganizers[invitationIndex].revenueShare = 0;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: `Invitation ${response === 'accept' ? 'accepted' : 'declined'} successfully`,
      data: {
        event: {
          id: event._id,
          title: event.title,
          coOrganizers: event.coOrganizers
        }
      }
    });

  } catch (error) {
    console.error('Error responding to invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to respond to invitation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update co-organizer revenue share
 * PUT /api/events/:id/co-organizers/:coOrgId
 */
const updateCoOrganizerShare = async (req, res) => {
  try {
    const { id, coOrgId } = req.params;
    const { revenueShare } = req.body;
    const userId = req.user.id;

    // Validate input
    if (revenueShare < 0 || revenueShare > 50) {
      return res.status(400).json({
        success: false,
        message: 'Revenue share must be between 0% and 50%'
      });
    }

    // Validate event exists
    const event = await Event.findById(id).populate('organizer');
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is admin of the main organizer
    const isMainOrgAdmin = event.organizer.members.some(
      member => member.userId.toString() === userId && member.role === 'admin'
    );

    if (!isMainOrgAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only main organizer admins can update revenue shares'
      });
    }

    // Find co-organizer
    const coOrganizerIndex = event.coOrganizers.findIndex(
      co => co.organization.toString() === coOrgId
    );

    if (coOrganizerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Co-organizer not found'
      });
    }

    // Check if event has started (can't change shares after event starts)
    if (new Date() >= event.startDate) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update revenue shares after event has started'
      });
    }

    // Validate total revenue shares
    const currentCoOrg = event.coOrganizers[coOrganizerIndex];
    const otherCoOrgsShares = event.coOrganizers
      .filter((co, index) => index !== coOrganizerIndex && co.status === 'accepted')
      .reduce((sum, co) => sum + co.revenueShare, 0);

    if (otherCoOrgsShares + revenueShare > 80) {
      return res.status(400).json({
        success: false,
        message: 'Total revenue share would exceed 80%. Main organizer must retain at least 20%.'
      });
    }

    // Update revenue share
    event.coOrganizers[coOrganizerIndex].revenueShare = revenueShare;
    await event.save();

    await event.populate('coOrganizers.organization');

    res.status(200).json({
      success: true,
      message: 'Revenue share updated successfully',
      data: {
        coOrganizer: event.coOrganizers[coOrganizerIndex]
      }
    });

  } catch (error) {
    console.error('Error updating co-organizer share:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update revenue share',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Remove co-organizer from event
 * DELETE /api/events/:id/co-organizers/:coOrgId
 */
const removeCoOrganizer = async (req, res) => {
  try {
    const { id, coOrgId } = req.params;
    const userId = req.user.id;

    // Validate event exists
    const event = await Event.findById(id).populate('organizer');
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions (main organizer admin or the co-organizer admin themselves)
    const isMainOrgAdmin = event.organizer.members.some(
      member => member.userId.toString() === userId && member.role === 'admin'
    );

    const coOrgToRemove = await Organization.findById(coOrgId);
    const isCoOrgAdmin = coOrgToRemove && coOrgToRemove.members.some(
      member => member.userId.toString() === userId && member.role === 'admin'
    );

    if (!isMainOrgAdmin && !isCoOrgAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to remove co-organizer'
      });
    }

    // Check if event has started (can't remove co-organizers after event starts)
    if (new Date() >= event.startDate) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove co-organizers after event has started'
      });
    }

    // Remove co-organizer
    const originalLength = event.coOrganizers.length;
    event.coOrganizers = event.coOrganizers.filter(
      co => co.organization.toString() !== coOrgId
    );

    if (event.coOrganizers.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: 'Co-organizer not found'
      });
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Co-organizer removed successfully'
    });

  } catch (error) {
    console.error('Error removing co-organizer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove co-organizer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get collaborative events for organization
 * GET /api/events/collaborative
 */
const getCollaborativeEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status = 'all', role = 'all' } = req.query;

    // Get user's organizations
    const user = await User.findById(userId).populate('organizations.organizationId');
    const userOrgIds = user.organizations.map(org => org.organizationId._id);

    // Build query
    const query = {
      $or: [
        // Events where user's org is the main organizer and has co-organizers
        {
          organizer: { $in: userOrgIds },
          'coOrganizers.0': { $exists: true }
        },
        // Events where user's org is a co-organizer
        {
          'coOrganizers.organization': { $in: userOrgIds }
        }
      ]
    };

    // Filter by status
    if (status !== 'all') {
      if (status === 'pending_response') {
        query['coOrganizers.status'] = 'pending';
      } else {
        query.status = status;
      }
    }

    // Execute query
    const events = await Event.find(query)
      .populate('organizer', 'name type')
      .populate('coOrganizers.organization', 'name type')
      .populate('createdBy', 'firstName lastName')
      .sort({ startDate: 1 });

    // Filter by role if specified
    let filteredEvents = events;
    if (role !== 'all') {
      filteredEvents = events.filter(event => {
        const isMainOrganizer = userOrgIds.some(orgId => 
          orgId.toString() === event.organizer._id.toString()
        );
        const isCoOrganizer = event.coOrganizers.some(co => 
          userOrgIds.some(orgId => orgId.toString() === co.organization._id.toString())
        );

        if (role === 'main_organizer') return isMainOrganizer;
        if (role === 'co_organizer') return isCoOrganizer;
        return true;
      });
    }

    // Add collaboration details to each event
    const eventsWithCollabDetails = filteredEvents.map(event => {
      const userOrgRole = getUserOrgRole(event, userOrgIds);
      const revenueShares = event.calculateRevenueSplit();
      
      return {
        ...event.toJSON(),
        collaborationDetails: {
          userRole: userOrgRole,
          totalCoOrganizers: event.coOrganizers.length,
          acceptedCoOrganizers: event.coOrganizers.filter(co => co.status === 'accepted').length,
          pendingInvitations: event.coOrganizers.filter(co => co.status === 'pending').length,
          revenueShares
        }
      };
    });

    res.status(200).json({
      success: true,
      message: 'Collaborative events retrieved successfully',
      data: {
        events: eventsWithCollabDetails,
        pagination: {
          total: eventsWithCollabDetails.length,
          page: 1,
          limit: eventsWithCollabDetails.length
        }
      }
    });

  } catch (error) {
    console.error('Error getting collaborative events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve collaborative events',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Calculate revenue distribution for an event
 * GET /api/events/:id/revenue-distribution
 */
const getRevenueDistribution = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate event exists
    const event = await Event.findById(id)
      .populate('organizer', 'name')
      .populate('coOrganizers.organization', 'name');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has permission to view revenue distribution
    const user = await User.findById(userId);
    const userOrgIds = user.organizations.map(org => org.organizationId.toString());
    
    const hasAccess = userOrgIds.includes(event.organizer._id.toString()) ||
      event.coOrganizers.some(co => 
        userOrgIds.includes(co.organization._id.toString()) && co.status === 'accepted'
      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You must be part of the organizing team.'
      });
    }

    // Calculate revenue distribution
    const revenueShares = event.calculateRevenueSplit();
    
    // Get detailed breakdown
    const breakdown = {
      totalRevenue: event.totalRevenue,
      platformFee: {
        percentage: event.platformFee * 100,
        amount: revenueShares.platform
      },
      organizers: {
        main: {
          organization: event.organizer,
          amount: revenueShares.organizer,
          percentage: event.totalRevenue > 0 ? (revenueShares.organizer / event.totalRevenue) * 100 : 0
        },
        coOrganizers: revenueShares.coOrganizers || []
      },
      summary: {
        totalDistributed: revenueShares.platform + revenueShares.organizer + 
          (revenueShares.coOrganizers || []).reduce((sum, co) => sum + co.amount, 0),
        ticketsSold: event.ticketsSold,
        averageTicketPrice: event.ticketsSold > 0 ? event.totalRevenue / event.ticketsSold : 0
      }
    };

    res.status(200).json({
      success: true,
      message: 'Revenue distribution retrieved successfully',
      data: breakdown
    });

  } catch (error) {
    console.error('Error getting revenue distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve revenue distribution',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to determine user's role in event
function getUserOrgRole(event, userOrgIds) {
  const isMainOrganizer = userOrgIds.some(orgId => 
    orgId.toString() === event.organizer._id.toString()
  );
  
  if (isMainOrganizer) return 'main_organizer';
  
  const coOrganizerStatus = event.coOrganizers.find(co => 
    userOrgIds.some(orgId => orgId.toString() === co.organization._id.toString())
  );
  
  if (coOrganizerStatus) {
    return `co_organizer_${coOrganizerStatus.status}`;
  }
  
  return 'none';
}

module.exports = {
  inviteCoOrganizers,
  respondToInvitation,
  updateCoOrganizerShare,
  removeCoOrganizer,
  getCollaborativeEvents,
  getRevenueDistribution
};