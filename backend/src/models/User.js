const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+256|0)[0-9]{9}$/, 'Please enter a valid Ugandan phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Profile Information
  avatar: {
    type: String, // URL to profile image
    default: null
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(date) {
        return date < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  // Organizations & Roles
  organizations: [{
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: 'Organization',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'employee'],
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    permissions: {
      canCreateEvents: { type: Boolean, default: false },
      canManageUsers: { type: Boolean, default: false },
      canAccessFinancials: { type: Boolean, default: false },
      canManageMerchandise: { type: Boolean, default: false }
    }
  }],
  
  // Subscription Information
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    
    // AI Credit tracking
    aiCredits: {
      used: { type: Number, default: 0 },
      remaining: { type: Number, default: 10 }, // Free plan starts with 10
      total: { type: Number, default: 10 },
      lastResetDate: { type: Date, default: Date.now },
      history: [{
        date: { type: Date, default: Date.now },
        action: { type: String, enum: ['used', 'added', 'reset'] },
        amount: Number,
        feature: { type: String, enum: ['copywriting', 'descriptions', 'marketing', 'analytics'] },
        remaining: Number
      }]
    },
    
    // SMS Credit tracking
    smsCredits: {
      used: { type: Number, default: 0 },
      remaining: { type: Number, default: 0 }, // Free plan has no SMS
      total: { type: Number, default: 0 },
      lastResetDate: { type: Date, default: Date.now },
      history: [{
        date: { type: Date, default: Date.now },
        action: { type: String, enum: ['used', 'added', 'reset'] },
        amount: Number,
        campaignId: mongoose.Schema.Types.ObjectId,
        remaining: Number
      }]
    },
    
    // AI Feature usage tracking
    aiUsage: {
      copywriting: {
        totalGenerated: { type: Number, default: 0 },
        lastUsed: Date,
        favoritePrompts: [String]
      },
      imageOptimization: {
        totalProcessed: { type: Number, default: 0 },
        lastUsed: Date
      },
      analytics: {
        totalReports: { type: Number, default: 0 },
        lastUsed: Date
      }
    },
    
    // Plan limits based on subscription
    limits: {
      aiCreditsPerMonth: {
        type: Number,
        default: function() {
          switch(this.plan) {
            case 'free': return 10;
            case 'pro': return 100;
            case 'premium': return 500;
            default: return 10;
          }
        }
      },
      smsCreditsPerMonth: {
        type: Number,
        default: function() {
          switch(this.plan) {
            case 'free': return 0;
            case 'pro': return 200;
            case 'premium': return 1000;
            default: return 0;
          }
        }
      },
      aiFeatures: {
        type: [String],
        default: function() {
          switch(this.plan) {
            case 'free': return ['basic_copywriting'];
            case 'pro': return ['copywriting', 'descriptions', 'basic_analytics'];
            case 'premium': return ['copywriting', 'descriptions', 'analytics', 'marketing', 'image_optimization'];
            default: return ['basic_copywriting'];
          }
        }
      }
    }
  },  // Security & Login
  passwordResetToken: String,
  passwordResetExpire: Date,
  emailVerificationToken: String,
  phoneVerificationToken: String,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Preferences
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'Africa/Kampala'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      showProfile: { type: Boolean, default: true },
      showContactInfo: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ 'organizations.organization': 1 });
userSchema.index({ 'subscription.plan': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only run if password is modified
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user's role in specific organization
userSchema.methods.getRoleInOrganization = function(organizationId) {
  const membership = this.organizations.find(
    org => org.organization.toString() === organizationId.toString()
  );
  return membership ? membership.role : null;
};

// Check if user has permission in organization
userSchema.methods.hasPermission = function(organizationId, permission) {
  const membership = this.organizations.find(
    org => org.organization.toString() === organizationId.toString()
  );
  return membership ? membership.permissions[permission] : false;
};

// Get subscription limits
userSchema.methods.getSubscriptionLimits = function() {
  const limits = {
    free: { aiCredits: 0, smsCredits: 0, emailCredits: 0 },
    pro: { aiCredits: 50, smsCredits: 200, emailCredits: 1000 },
    premium: { aiCredits: 1000, smsCredits: 'unlimited', emailCredits: 'unlimited' }
  };
  return limits[this.subscription.plan];
};

module.exports = mongoose.model('User', userSchema);