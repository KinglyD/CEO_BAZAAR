# 🧪 Testing Guide - AI Marketing & Subscription Features

## Quick Start

Your dev server should be running on http://localhost:3000/

If not, start it with:
```bash
cd frontend
npm run dev
```

---

## 🎯 Testing the New Features

### 1. Subscription Plans Page

**Path**: `/organizer/subscription`

**How to Test**:
1. Navigate to Organizer Portal
2. Click "Subscription" in the sidebar (rocket icon)
3. You should see:
   - ✅ Three pricing cards (FREE, PRO, PREMIUM)
   - ✅ AI features banner at the top
   - ✅ Feature comparison table
   - ✅ FAQ section at the bottom
   - ✅ "Current Plan" badge on FREE card
   - ✅ "BEST VALUE" badge on PREMIUM card

**Expected Behavior**:
- Free plan shows "Free Forever" button (disabled)
- Pro/Premium show "Upgrade Now" button
- Clicking upgrade shows alert (payment flow not implemented)
- Feature list includes AI tools with sparkle icons

---

### 2. AI Marketing Suite

**Path**: `/organizer/marketing`

**How to Test**:

#### A. With FREE Plan (Default)
1. Click "AI Marketing" in sidebar (has "PRO" badge)
2. You should see:
   - ✅ All 4 tabs: AI Copywriting, SMS Campaigns, Email Marketing, Social Media
   - ✅ Lock icons on locked features
   - ✅ Upgrade prompt showing pricing comparison
   - ✅ "View Plans & Upgrade" button linking to subscription page

**Expected Behavior**:
- Every tab shows the upgrade prompt
- No access to actual tools
- Pricing clearly displayed (Pro: 50K, Premium: 150K)

#### B. Testing with PRO Plan
To test with Pro access, temporarily change line 9 in `Marketing.jsx`:
```javascript
// Change from:
plan: 'free',
// To:
plan: 'pro',
```

Then refresh the page. You should now see:
- ✅ **AI Copywriting tab**: Full interface with input field and "Generate Copy" button
- ✅ **SMS Campaigns tab**: Campaign builder with recipient selector, message input, templates
- ✅ **Email Marketing tab**: "Coming soon" placeholder
- ✅ **Social Media tab**: Still locked (Premium only)
- ✅ Credit counters showing remaining credits (50 AI, 200 SMS, 1000 Email)

**AI Copywriting Test**:
1. Type event name: "Jazz Night at Garden City"
2. Click "Generate Copy"
3. Wait 2 seconds (simulated AI delay)
4. Generated text appears below with "Copy to Clipboard" button

**SMS Campaign Test**:
1. Select recipient group (e.g., "VIP Ticket Holders")
2. Type SMS message (160 character limit)
3. Click template buttons to load pre-written messages
4. See campaign preview showing estimated reach and cost

#### C. Testing with PREMIUM Plan
Change to:
```javascript
plan: 'premium',
```

Now you should see:
- ✅ All tabs unlocked
- ✅ Social Media tab accessible
- ✅ "Unlimited" shown for all credit counters
- ✅ No upgrade prompts

---

### 3. Navigation & UI Elements

**Test Navigation**:
1. Open organizer sidebar
2. Verify "AI Marketing" has purple "PRO" badge
3. Click between Dashboard → AI Marketing → Subscription → Payouts
4. Active page should have gold background

**Test Responsiveness**:
1. Resize browser window
2. Check pricing cards stack on mobile
3. Verify tables scroll horizontally on small screens

---

## 🔧 Modifying Test Data

### Change User's Subscription Plan
File: `/frontend/src/pages/organizer/{components}/Marketing.jsx` (Line 9)
```javascript
const userSubscription = {
  plan: 'free',     // Change to 'pro' or 'premium'
  aiCredits: 0,     // Remaining AI credits (if pro: 50, premium: unlimited)
  smsCredits: 0,    // Remaining SMS credits
  emailCredits: 0   // Remaining email credits
}
```

### Change Current Plan Badge
File: `/frontend/src/pages/organizer/{components}/SubscriptionPlans.jsx` (Line 21)
```javascript
const [currentPlan, setCurrentPlan] = useState('free') // Change to 'pro' or 'premium'
```

### Test Different Platform Fees
Your existing events already have different fee rates based on `isRecurring`:
- Music Festival: `isRecurring: true` → 6% fee
- Tech Summit: `isRecurring: false` → 8% fee

Check the Payout page to see fee calculations.

---

## 🎨 Visual Checklist

### Subscription Page Should Show:
- [ ] Gradient purple/pink banner at top
- [ ] 3 pricing cards side-by-side (desktop)
- [ ] Premium card has gold border and shadow
- [ ] Current plan has green badge
- [ ] Feature comparison table with icons
- [ ] Lock icons for unavailable features
- [ ] FAQ section at bottom

### Marketing Page Should Show:
- [ ] 4 tab buttons with icons
- [ ] Purple "PRO" badge on locked tabs
- [ ] Lock icons visible for free users
- [ ] Credit counters in top-right of each tab
- [ ] Upgrade prompt with gradient background (free users)
- [ ] Full tool interfaces (pro/premium users)
- [ ] Loading spinner during AI generation
- [ ] SMS character counter (X/160)
- [ ] Template buttons for quick SMS

---

## 🐛 Common Issues & Fixes

### Issue: "Module not found" error
**Fix**: Make sure you're in the `frontend` folder and run `npm install`

### Issue: Subscription page not loading
**Fix**: Check that the import in `OrganizerLayout.jsx` matches the exact filename (including capitalization)

### Issue: Marketing page shows upgrade prompt even with pro plan
**Fix**: Verify you changed the `plan` value to `'pro'` (lowercase, in quotes)

### Issue: Credits show "NaN" or undefined
**Fix**: Make sure you're passing the correct credit type to `getRemainingCredits()`:
- `'aiCredits'`
- `'smsCredits'`
- `'emailCredits'`

---

## 📸 Screenshot Guide

Take screenshots of these views for documentation:

1. **Subscription Page - Full View**
   - Shows all 3 tiers
   - Feature comparison table
   - AI features banner

2. **Marketing Page - Free User**
   - Upgrade prompt displayed
   - Locked state visible

3. **Marketing Page - Pro User**
   - AI Copywriting tool active
   - Credit counter showing
   - Generated content example

4. **Marketing Page - SMS Builder**
   - Campaign form filled out
   - Template selection
   - Preview panel showing

5. **Sidebar Navigation**
   - "AI Marketing" with PRO badge
   - Active state on gold background

---

## 🚀 Next: Backend Integration

Once backend is ready, you'll need to:

1. **Replace mock subscription data** with API call:
```javascript
// Instead of:
const userSubscription = { plan: 'free', ... }

// Use:
const { data: userSubscription } = useQuery('/api/user/subscription')
```

2. **Connect upgrade flow** to payment gateway:
```javascript
const handleUpgrade = async (planId) => {
  const { checkoutUrl } = await api.post('/api/subscriptions/checkout', { planId })
  window.location.href = checkoutUrl // Redirect to Stripe/Flutterwave
}
```

3. **Implement AI API calls**:
```javascript
const handleGenerate = async () => {
  const { generatedText } = await api.post('/api/ai/copywriting', { prompt })
  setGenerated(generatedText)
}
```

4. **Add credit deduction logic**:
- After each AI/SMS/Email action, decrement user's credits
- Show toast notification when credits run low
- Disable actions when credits depleted

---

## ✅ Testing Completion Checklist

- [ ] Visited subscription page as free user
- [ ] Clicked "Upgrade Now" button (should show alert)
- [ ] Viewed feature comparison table
- [ ] Visited marketing page as free user (saw upgrade prompts)
- [ ] Changed plan to 'pro' in code
- [ ] Generated AI copy successfully
- [ ] Filled out SMS campaign form
- [ ] Saw credit counters updating
- [ ] Changed plan to 'premium'
- [ ] Verified social media tab unlocked
- [ ] Tested navigation between all organizer pages
- [ ] Confirmed PRO badge appears on AI Marketing link
- [ ] Verified responsive design on mobile size

---

**Happy Testing! 🎉**

If you find any bugs or have feature requests, update this document with your findings.
