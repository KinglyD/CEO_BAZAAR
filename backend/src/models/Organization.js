const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Organization email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'Uganda'
    },
    postalCode: String
  },
  
  // Branding
  logo: {
    type: String, // URL to logo image
    default: null
  },
  banner: {
    type: String, // URL to banner image
    default: null
  },
  primaryColor: {
    type: String,
    default: '#FFD700' // Gold color from frontend
  },
  
  // Business Information
  businessType: {
    type: String,
    enum: ['event_management', 'entertainment', 'corporate', 'non_profit', 'education', 'sports', 'other'],
    default: 'event_management'
  },
  taxId: String,
  businessLicense: String,
  
  // Subscription & Billing
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
    isActive: {
      type: Boolean,
      default: true
    },
    paymentMethod: {
      type: String,
      enum: ['mobile_money', 'bank_transfer', 'credit_card']
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    }
  },
  
  // Platform Fees
  platformFees: {
    oneTime: {
      type: Number,
      default: 0.08 // 8% for free plan
    },
    recurring: {
      type: Number,
      default: 0.06 // 6% for free plan
    }
  },
  
  // Settings
  settings: {
    allowPublicEvents: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    autoPublishEvents: {
      type: Boolean,
      default: true
    },
    enableCollaboration: {
      type: Boolean,
      default: true
    },
    maxEventsPerMonth: {
      type: Number,
      default: 5 // Free plan limit
    },
    dataRetentionDays: {
      type: Number,
      default: 365
    }
  },
  
  // Statistics
  stats: {
    totalEvents: {
      type: Number,
      default: 0
    },
    totalTicketsSold: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    totalCustomers: {
      type: Number,
      default: 0
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'suspended', 'pending_approval', 'inactive'],
    default: 'pending_approval'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String, // Document type
    url: String,  // Document URL
    uploadedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  
  // Owner (Admin who created the organization)
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
organizationSchema.index({ slug: 1 });
organizationSchema.index({ owner: 1 });
organizationSchema.index({ status: 1 });
organizationSchema.index({ 'subscription.plan': 1 });

// Virtual for member count
organizationSchema.virtual('memberCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'organizations.organization',
  count: true
});

// Virtual for active events count
organizationSchema.virtual('activeEventsCount', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'organizer',
  count: true,
  match: { status: 'active' }
});

// Pre-save middleware to generate slug
organizationSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single
  }
  next();
});

// Method to get subscription limits
organizationSchema.methods.getSubscriptionLimits = function() {
  const limits = {
    free: {
      maxEvents: 5,
      maxMembers: 3,
      aiCredits: 0,
      smsCredits: 0,
      emailCredits: 0,
      platformFees: { oneTime: 0.08, recurring: 0.06 }
    },
    pro: {
      maxEvents: 50,
      maxMembers: 15,
      aiCredits: 50,
      smsCredits: 200,
      emailCredits: 1000,
      platformFees: { oneTime: 0.07, recurring: 0.05 }
    },
    premium: {
      maxEvents: 'unlimited',
      maxMembers: 'unlimited',
      aiCredits: 1000,
      smsCredits: 'unlimited',
      emailCredits: 'unlimited',
      platformFees: { oneTime: 0.06, recurring: 0.04 }
    }
  };
  return limits[this.subscription.plan];
};

// Method to check if organization can create more events
organizationSchema.methods.canCreateEvent = function() {
  const limits = this.getSubscriptionLimits();
  if (limits.maxEvents === 'unlimited') return true;
  return this.stats.totalEvents < limits.maxEvents;
};

module.exports = mongoose.model('Organization', organizationSchema);