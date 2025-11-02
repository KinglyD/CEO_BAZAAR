const Organization = require('../models/Organization');
const User = require('../models/User');
const { validationResult } = require('express-validator');

class OrganizationController {
  /**
   * Get user's organizations
   * GET /api/organizations
   */
  getUserOrganizations = async (req, res) => {
    try {
      const userId = req.user._id;
      
      // Get user with populated organizations
      const user = await User.findById(userId)
        .populate('organizations.organization')
        .select('organizations');

      res.json({
        success: true,
        data: {
          organizations: user.organizations.map(org => ({
            ...org.organization.toObject(),
            role: org.role,
            permissions: org.permissions,
            joinedAt: org.joinedAt,
            status: org.status
          }))
        }
      });

    } catch (error) {
      console.error('Get user organizations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch organizations'
      });
    }
  };

  /**
   * Get single organization
   * GET /api/organizations/:id
   */
  getOrganization = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if user has access to this organization
      const userOrg = req.user.organizations.find(
        org => org.organization.toString() === id
      );

      if (!userOrg) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this organization'
        });
      }

      const organization = await Organization.findById(id);
      if (!organization) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found'
        });
      }

      res.json({
        success: true,
        data: {
          organization: {
            ...organization.toObject(),
            userRole: userOrg.role,
            userPermissions: userOrg.permissions
          }
        }
      });

    } catch (error) {
      console.error('Get organization error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch organization'
      });
    }
  };

  /**
   * Update organization
   * PUT /api/organizations/:id
   */
  updateOrganization = async (req, res) => {
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
      
      // Check if user is admin of this organization
      const userOrg = req.user.organizations.find(
        org => org.organization.toString() === id && org.role === 'admin'
      );

      if (!userOrg) {
        return res.status(403).json({
          success: false,
          message: 'Only organization admins can update organization details'
        });
      }

      const organization = await Organization.findById(id);
      if (!organization) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found'
        });
      }

      // Update organization
      Object.assign(organization, req.body);
      await organization.save();

      res.json({
        success: true,
        message: 'Organization updated successfully',
        data: { organization }
      });

    } catch (error) {
      console.error('Update organization error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update organization'
      });
    }
  };

  /**
   * Get organization statistics
   * GET /api/organizations/:id/stats
   */
  getOrganizationStats = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check access
      const userOrg = req.user.organizations.find(
        org => org.organization.toString() === id
      );

      if (!userOrg) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this organization'
        });
      }

      const organization = await Organization.findById(id);
      if (!organization) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found'
        });
      }

      // Get basic stats from organization document
      const stats = {
        events: organization.stats.totalEvents,
        revenue: organization.stats.totalRevenue,
        customers: organization.stats.totalCustomers,
        subscription: {
          plan: organization.subscription.plan,
          status: organization.subscription.status,
          startDate: organization.subscription.startDate,
          endDate: organization.subscription.endDate
        }
      };

      res.json({
        success: true,
        data: { stats }
      });

    } catch (error) {
      console.error('Get organization stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch organization statistics'
      });
    }
  };
}

module.exports = new OrganizationController();