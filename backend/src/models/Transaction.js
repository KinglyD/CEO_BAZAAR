const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Transaction Basics
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    enum: ['ticket_purchase', 'merchandise_purchase', 'refund', 'payout'],
    required: true
  },
  
  // Related Documents
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event'
  },
  merchandise: {
    type: mongoose.Schema.ObjectId,
    ref: 'Merchandise'
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
    required: true
  },
  
  // Customer Information (Masked based on subscription)
  customer: {
    email: {
      original: String,     // Full email (only for paid subscriptions)
      masked: String,       // Masked email (for free subscriptions)
      type: String          // 'original' or 'masked'
    },
    phone: {
      original: String,     // Full phone (only for paid subscriptions)
      masked: String,       // Masked phone (for free subscriptions)
      type: String          // 'original' or 'masked'
    },
    name: String,
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  
  // Items Purchased
  items: [{
    type: {
      type: String,
      enum: ['ticket', 'merchandise']
    },
    itemId: mongoose.Schema.ObjectId,
    name: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1
    },
    subtotal: Number
  }],
  
  // Financial Information
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'UGX'
  },
  platformFee: {
    type: Number,
    default: 0
  },
  organizerAmount: {
    type: Number,
    default: 0
  },
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['mobile_money', 'bank_transfer', 'credit_card', 'cash', 'pos'],
      required: true
    },
    provider: String,        // MTN, Airtel, Visa, etc.
    reference: String,       // Payment reference from provider
    phoneNumber: String,     // For mobile money
    accountNumber: String,   // For bank transfers
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    failureReason: String
  },
  
  // Transaction Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // Tickets Generated (for ticket purchases)
  tickets: [{
    ticketId: String,
    qrCode: String,
    ticketType: String,
    status: {
      type: String,
      enum: ['valid', 'used', 'cancelled', 'transferred'],
      default: 'valid'
    },
    scannedAt: Date,
    scannedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  
  // Location & Device Info
  location: {
    ip: String,
    country: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  device: {
    userAgent: String,
    browser: String,
    os: String,
    mobile: Boolean
  },
  
  // Processing Information
  processedBy: {
    type: String,
    enum: ['system', 'manual', 'scanner'],
    default: 'system'
  },
  processedByUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  
  // Notes & Communication
  notes: String,
  customerNotes: String,
  internalNotes: String,
  
  // Refund Information
  refund: {
    amount: Number,
    reason: String,
    requestedAt: Date,
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    method: String,
    reference: String
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  
  // Metadata
  metadata: {
    source: String,      // 'web', 'mobile', 'pos', 'scanner'
    campaign: String,    // Marketing campaign reference
    discount: {
      code: String,
      amount: Number,
      type: String       // 'percentage' or 'fixed'
    },
    affiliateId: String
  }
}, {
  timestamps: true
});

// Indexes for performance
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ organization: 1, createdAt: -1 });
transactionSchema.index({ event: 1, createdAt: -1 });
transactionSchema.index({ 'customer.email.original': 1 });
transactionSchema.index({ 'customer.phone.original': 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ 'payment.method': 1 });
transactionSchema.index({ createdAt: -1 });

// Pre-save middleware to generate transaction ID
transactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.transactionId = `TXN-${timestamp}-${random}`;
  }
  next();
});

// Method to mask customer information based on subscription
transactionSchema.methods.maskCustomerInfo = function(subscriptionPlan) {
  if (subscriptionPlan === 'free') {
    // For free plans, return masked data
    return {
      email: this.customer.email.masked,
      phone: this.customer.phone.masked,
      name: this.customer.name
    };
  } else {
    // For paid plans, return original data
    return {
      email: this.customer.email.original,
      phone: this.customer.phone.original,
      name: this.customer.name
    };
  }
};

// Method to generate tickets
transactionSchema.methods.generateTickets = function() {
  if (this.type !== 'ticket_purchase') return [];
  
  const tickets = [];
  this.items.forEach(item => {
    if (item.type === 'ticket') {
      for (let i = 0; i < item.quantity; i++) {
        const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        tickets.push({
          ticketId,
          qrCode: `https://api.ceobazaar.com/tickets/validate/${ticketId}`,
          ticketType: item.name,
          status: 'valid'
        });
      }
    }
  });
  
  this.tickets = tickets;
  return tickets;
};

// Static method to get revenue analytics
transactionSchema.statics.getRevenueAnalytics = function(organizationId, dateRange) {
  return this.aggregate([
    {
      $match: {
        organization: mongoose.Types.ObjectId(organizationId),
        status: 'completed',
        createdAt: { $gte: dateRange.start, $lte: dateRange.end }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        averageTransaction: { $avg: '$amount' },
        platformFees: { $sum: '$platformFee' },
        organizerRevenue: { $sum: '$organizerAmount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);