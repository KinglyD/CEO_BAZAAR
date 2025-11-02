const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database (exclude password)
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact support.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error.'
    });
  }
};

/**
 * Organization Access Middleware
 * Verifies user has access to specific organization
 */
const checkOrganizationAccess = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const { organizationId } = req.params;
      
      if (!organizationId) {
        return res.status(400).json({
          success: false,
          message: 'Organization ID is required.'
        });
      }

      // Find user's membership in the organization
      const membership = req.user.organizations.find(
        org => org.organization.toString() === organizationId
      );

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You are not a member of this organization.'
        });
      }

      // Check if membership is active
      if (membership.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: `Access denied. Your membership is ${membership.status}.`
        });
      }

      // Check role requirements if specified
      if (requiredRole) {
        const hasPermission = checkRolePermission(membership.role, requiredRole);
        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            message: `Access denied. ${requiredRole} role required.`
          });
        }
      }

      // Attach organization membership to request
      req.organizationMembership = membership;
      next();
    } catch (error) {
      console.error('Organization access error:', error);
      res.status(500).json({
        success: false,
        message: 'Organization access verification error.'
      });
    }
  };
};

/**
 * Permission-based Access Control
 * Checks specific permissions instead of roles
 */
const checkPermission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.organizationMembership) {
        return res.status(403).json({
          success: false,
          message: 'Organization membership required.'
        });
      }

      const userPermissions = req.organizationMembership.permissions;
      
      if (!userPermissions[permission]) {
        return res.status(403).json({
          success: false,
          message: `Access denied. ${permission} permission required.`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Permission verification error.'
      });
    }
  };
};

/**
 * Admin Only Access
 * Restricts access to admin role only
 */
const adminOnly = (req, res, next) => {
  try {
    if (!req.organizationMembership || req.organizationMembership.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin verification error.'
    });
  }
};

/**
 * Generate JWT Token
 */
const generateToken = (userId, expiresIn = '24h') => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

/**
 * Generate Refresh Token (longer expiry)
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Verify Refresh Token
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

/**
 * Role hierarchy check helper
 */
const checkRolePermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    'admin': ['admin', 'manager', 'employee'],
    'manager': ['manager', 'employee'],
    'employee': ['employee']
  };
  
  return roleHierarchy[userRole]?.includes(requiredRole) || false;
};

module.exports = {
  authenticateToken,
  checkOrganizationAccess,
  checkPermission,
  adminOnly,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken
};