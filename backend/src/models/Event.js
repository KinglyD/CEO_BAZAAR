const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Basic Event Information
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Event title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Event Details
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['music', 'conference', 'sports', 'food_drink', 'business', 'education', 'entertainment', 'other']
  },
  type: {
    type: String,
    enum: ['physical', 'virtual', 'hybrid'],
    default: 'physical'
  },
  
  // Date & Time
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  startTime: String,
  endTime: String,
  timezone: {
    type: String,
    default: 'Africa/Kampala'
  },
  
  // Location
  venue: {
    name: {
      type: String,
      required: function() { return this.type !== 'virtual'; }
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  },
  virtualLink: {
    type: String,
    required: function() { return this.type !== 'physical'; }
  },
  
  // Capacity & Tickets
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  ticketTypes: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    sold: {
      type: Number,
      default: 0
    },
    salesStart: Date,
    salesEnd: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Organizer Information
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
    required: true
  },
  coOrganizers: [{
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: 'Organization'
    },
    revenueShare: {
      type: Number,
      min: 0,
      max: 100
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    invitedAt: Date,
    respondedAt: Date
  }],
  
  // Revenue & Fees
  platformFee: {
    type: Number,
    default: 0.08 // 8% default
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  platformRevenue: {
    type: Number,
    default: 0
  },
  organizerRevenue: {
    type: Number,
    default: 0
  },
  
  // Media
  images: [{
    url: String,
    caption: String,
    isPrimary: Boolean
  }],
  videos: [{
    url: String,
    title: String,
    thumbnail: String
  }],
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled', 'suspended', 'flagged'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Sales Information
  ticketsSold: {
    type: Number,
    default: 0
  },
  attendeesCheckedIn: {
    type: Number,
    default: 0
  },
  
  // Settings
  settings: {
    allowWaitlist: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    transferable: {
      type: Boolean,
      default: true
    },
    refundPolicy: {
      type: String,
      enum: ['no_refund', 'partial_refund', 'full_refund'],
      default: 'partial_refund'
    },
    maxTicketsPerUser: {
      type: Number,
      default: 10
    }
  },
  
  // SEO & Marketing
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  // Admin Fields
  moderationNotes: String,
  flaggedReason: String,
  reviewedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  
  // Creator
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
eventSchema.index({ organizer: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ slug: 1 });
eventSchema.index({ isFeatured: 1 });
eventSchema.index({ 'venue.address.city': 1 });

// Virtual for tickets available
eventSchema.virtual('ticketsAvailable').get(function() {
  return this.capacity - this.ticketsSold;
});

// Virtual for event progress
eventSchema.virtual('salesProgress').get(function() {
  return (this.ticketsSold / this.capacity) * 100;
});

// Pre-save middleware to generate slug
eventSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    this.slug = `${baseSlug}-${Date.now()}`;
  }
  next();
});

// Method to calculate revenue split
eventSchema.methods.calculateRevenueSplit = function() {
  const platformFee = this.totalRevenue * this.platformFee;
  const remainingRevenue = this.totalRevenue - platformFee;
  
  const splits = {
    platform: platformFee,
    organizer: remainingRevenue
  };
  
  // If there are co-organizers, split the remaining revenue
  if (this.coOrganizers && this.coOrganizers.length > 0) {
    const acceptedCoOrgs = this.coOrganizers.filter(co => co.status === 'accepted');
    const totalShares = acceptedCoOrgs.reduce((sum, co) => sum + co.revenueShare, 0);
    
    if (totalShares > 0) {
      const organizerShare = 100 - totalShares;
      splits.organizer = (remainingRevenue * organizerShare) / 100;
      
      splits.coOrganizers = acceptedCoOrgs.map(co => ({
        organization: co.organization,
        amount: (remainingRevenue * co.revenueShare) / 100
      }));
    }
  }
  
  return splits;
};

// Method to check if event can be edited
eventSchema.methods.canBeEdited = function() {
  return ['draft', 'active'].includes(this.status) && new Date() < this.startDate;
};

// Method to get available ticket types
eventSchema.methods.getAvailableTickets = function() {
  return this.ticketTypes.filter(ticket => 
    ticket.isActive && 
    ticket.sold < ticket.quantity &&
    (!ticket.salesEnd || new Date() < ticket.salesEnd)
  );
};

module.exports = mongoose.model('Event', eventSchema);