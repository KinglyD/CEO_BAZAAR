// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'UGX',
    billingPeriod: 'forever',
    features: [
      'Create unlimited events',
      'Basic ticket types',
      'QR code validation',
      'Employee management',
      'Basic analytics',
      'Standard platform fees (8% one-time, 6% recurring)',
      'USSD & Mobile Money payments',
      'Customer data access'
    ],
    limits: {
      events: null, // unlimited
      employees: 5,
      aiCredits: 0,
      smsCredits: 0,
      emailCredits: 0,
      customBranding: false,
      advancedAnalytics: false,
      aiMarketing: false,
      prioritySupport: false
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 50000,
    currency: 'UGX',
    billingPeriod: 'month',
    badge: 'Popular',
    features: [
      'Everything in Free',
      'AI Event Copywriting (50 credits/month)',
      'Automated SMS Marketing (200 SMS/month)',
      'Email Campaign Builder',
      'Advanced Analytics & Reports',
      'Reduced platform fees (7% one-time, 5% recurring)',
      'Unlimited employees',
      'Custom event branding',
      'Priority email support'
    ],
    limits: {
      events: null,
      employees: null, // unlimited
      aiCredits: 50,
      smsCredits: 200,
      emailCredits: 1000,
      customBranding: true,
      advancedAnalytics: true,
      aiMarketing: true,
      prioritySupport: true,
      reducedFees: true,
      feeRates: { oneTime: 0.07, recurring: 0.05 }
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 150000,
    currency: 'UGX',
    billingPeriod: 'month',
    badge: 'Best Value',
    features: [
      'Everything in Pro',
      'Unlimited AI Copywriting',
      'Unlimited SMS Marketing',
      'Unlimited Email Campaigns',
      'AI Audience Targeting',
      'Social Media Post Generator',
      'Automated Campaign Scheduling',
      'Lowest platform fees (6% one-time, 4% recurring)',
      'White-label branding',
      'Dedicated account manager',
      '24/7 Priority support',
      'API access',
      'Custom integrations'
    ],
    limits: {
      events: null,
      employees: null,
      aiCredits: null, // unlimited
      smsCredits: null, // unlimited
      emailCredits: null, // unlimited
      customBranding: true,
      advancedAnalytics: true,
      aiMarketing: true,
      prioritySupport: true,
      dedicatedManager: true,
      apiAccess: true,
      whiteLabel: true,
      reducedFees: true,
      feeRates: { oneTime: 0.06, recurring: 0.04 }
    }
  }
}

// Helper functions
export const getSubscriptionPlan = (planId) => {
  return SUBSCRIPTION_PLANS[planId.toUpperCase()] || SUBSCRIPTION_PLANS.FREE
}

export const hasFeatureAccess = (userPlan, feature) => {
  const plan = getSubscriptionPlan(userPlan)
  return plan.limits[feature] !== false && plan.limits[feature] !== 0
}

export const getRemainingCredits = (userPlan, creditType, used = 0) => {
  const plan = getSubscriptionPlan(userPlan)
  const limit = plan.limits[creditType]
  
  if (limit === null) return 'Unlimited'
  if (limit === 0) return 0
  
  return Math.max(0, limit - used)
}

export const getPlatformFees = (userPlan) => {
  const plan = getSubscriptionPlan(userPlan)
  
  if (plan.limits.reducedFees && plan.limits.feeRates) {
    return plan.limits.feeRates
  }
  
  // Default fees for free plan
  return { oneTime: 0.08, recurring: 0.06 }
}
