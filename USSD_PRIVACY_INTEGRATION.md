# USSD Integration & Privacy Features

## Overview
CEO Bazaar supports ticket purchases via MTN Mobile Money USSD codes, providing accessibility for customers without smartphones or internet access. Customer information is masked by default to protect privacy.

---

## USSD Purchase Flow

### Customer Journey

```
Customer dials USSD code
  ↓
*165*3*EVENT_CODE#
  ↓
MTN Menu appears:
┌──────────────────────────────┐
│ CEO Bazaar - Music Festival  │
│                              │
│ 1. Regular - UGX 50,000      │
│ 2. VIP - UGX 100,000         │
│ 3. VVIP - UGX 200,000        │
│                              │
│ Select ticket type:          │
└──────────────────────────────┘
  ↓
Customer selects option (e.g., "1")
  ↓
┌──────────────────────────────┐
│ Regular Ticket               │
│ Amount: UGX 50,000           │
│                              │
│ Enter quantity:              │
└──────────────────────────────┘
  ↓
Customer enters quantity (e.g., "2")
  ↓
┌──────────────────────────────┐
│ Total: UGX 100,000           │
│                              │
│ 1. Confirm                   │
│ 2. Cancel                    │
└──────────────────────────────┘
  ↓
Customer confirms
  ↓
MTN prompts for PIN
  ↓
Payment processed
  ↓
Customer receives SMS with:
  - Ticket code (6-digit or alphanumeric)
  - Event details
  - QR code link (optional)
```

---

## USSD Code Structure

### Dynamic Event Codes
```
Format: *165*3*[EVENT_CODE]#

Examples:
*165*3*TECH25#     - Tech Summit 2025
*165*3*MUSIC24#    - Music Festival
*165*3*123456#     - Numeric event ID
```

### Event Code Generation
```javascript
// Backend generates short codes for events
function generateEventCode(eventId, eventTitle) {
  // Option 1: Use first letters + year
  const titleCode = eventTitle
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 4);
  const year = new Date().getFullYear().toString().slice(-2);
  return `${titleCode}${year}`; // e.g., TECH25
  
  // Option 2: Use numeric ID
  return eventId.toString().padStart(6, '0'); // e.g., 001234
}
```

---

## MTN API Integration

### 1. Register USSD Application
```
Contact MTN to register your USSD short code
Endpoint: *165*3*
Webhook URL: https://api.ceobazaar.com/ussd/callback
```

### 2. USSD Session Handler

**Endpoint:** `POST /api/ussd/callback`

```javascript
// Request from MTN
{
  "sessionId": "ATUid_12345",
  "phoneNumber": "256700123456",
  "text": "TECH25",  // User input
  "networkCode": "MTN_UG"
}

// Response to MTN
{
  "response": "CON",  // CON = Continue, END = End session
  "message": "CEO Bazaar - Tech Summit\n1. Regular - 50,000\n2. VIP - 100,000\n3. VVIP - 200,000"
}
```

### 3. Complete USSD Handler
```javascript
// server/routes/ussd.js
const express = require('express');
const router = express.Router();

router.post('/callback', async (req, res) => {
  const { sessionId, phoneNumber, text } = req.body;
  
  let response = '';
  const input = text.split('*');
  const level = input.length;
  
  try {
    if (level === 1) {
      // First level - Event code entered
      const eventCode = input[0];
      const event = await Event.findOne({ code: eventCode });
      
      if (!event) {
        response = `END Invalid event code. Please check and try again.`;
      } else {
        // Store session data
        await USSDSession.create({
          sessionId,
          phoneNumber,
          eventId: event.id,
          step: 'select_ticket'
        });
        
        // Show ticket options
        let menu = `CON ${event.title}\n`;
        event.ticketTypes.forEach((ticket, index) => {
          menu += `${index + 1}. ${ticket.name} - UGX ${ticket.price.toLocaleString()}\n`;
        });
        response = menu;
      }
    }
    
    else if (level === 2) {
      // Second level - Ticket type selected
      const session = await USSDSession.findOne({ sessionId });
      const ticketIndex = parseInt(input[1]) - 1;
      const event = await Event.findById(session.eventId);
      const selectedTicket = event.ticketTypes[ticketIndex];
      
      if (!selectedTicket) {
        response = `END Invalid selection.`;
      } else {
        await USSDSession.updateOne(
          { sessionId },
          { 
            ticketType: selectedTicket.name,
            ticketPrice: selectedTicket.price,
            step: 'enter_quantity'
          }
        );
        
        response = `CON ${selectedTicket.name} - UGX ${selectedTicket.price.toLocaleString()}\nEnter quantity (max 10):`;
      }
    }
    
    else if (level === 3) {
      // Third level - Quantity entered
      const quantity = parseInt(input[2]);
      const session = await USSDSession.findOne({ sessionId });
      
      if (quantity < 1 || quantity > 10) {
        response = `END Invalid quantity. Please try again.`;
      } else {
        const total = session.ticketPrice * quantity;
        
        await USSDSession.updateOne(
          { sessionId },
          { quantity, total, step: 'confirm' }
        );
        
        response = `CON Total: UGX ${total.toLocaleString()}\n1. Confirm\n2. Cancel`;
      }
    }
    
    else if (level === 4) {
      // Fourth level - Confirmation
      const choice = input[3];
      const session = await USSDSession.findOne({ sessionId });
      
      if (choice === '1') {
        // Initiate payment
        const paymentResult = await initiateMoMoPayment({
          phoneNumber: session.phoneNumber,
          amount: session.total,
          reference: `TKT-${Date.now()}`
        });
        
        if (paymentResult.success) {
          // Create order
          const order = await Order.create({
            eventId: session.eventId,
            phoneNumber: session.phoneNumber,
            ticketType: session.ticketType,
            quantity: session.quantity,
            total: session.total,
            paymentMethod: 'USSD',
            paymentReference: paymentResult.transactionId,
            status: 'pending'
          });
          
          response = `END Payment request sent to ${phoneNumber}. Enter PIN to complete.`;
          
          // Send SMS with ticket details after payment confirmation
        } else {
          response = `END Payment failed. Please try again.`;
        }
      } else {
        response = `END Transaction cancelled.`;
      }
    }
    
  } catch (error) {
    console.error('USSD Error:', error);
    response = `END An error occurred. Please try again.`;
  }
  
  res.json({ response });
});

module.exports = router;
```

---

## Privacy & Masking System

### Masking Rules

#### Phone Numbers (USSD Purchases)
```javascript
function maskPhoneNumber(phone) {
  // Original: +256700123456 or 0700123456
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length >= 9) {
    // Show first 3 digits and last 3 digits
    return `${cleaned.slice(0, 3)}*****${cleaned.slice(-3)}`;
    // Result: 070*****456
  }
  
  return phone; // Too short to mask safely
}
```

#### Email Addresses (Online Purchases)
```javascript
function maskEmail(email) {
  const [username, domain] = email.split('@');
  
  if (username.length <= 3) {
    // Very short username
    return `${username[0]}***@${domain}`;
    // Example: a***@example.com
  }
  
  // Show first 3 characters
  return `${username.slice(0, 3)}***@${domain}`;
  // Example: joh***@example.com
}
```

#### Complete Masking Function
```javascript
// frontend/src/utils/privacy.js
export function maskCustomerInfo(info) {
  if (!info) return 'N/A';
  
  // Email detection
  if (info.includes('@')) {
    const [username, domain] = info.split('@');
    if (username.length <= 3) {
      return `${username[0]}***@${domain}`;
    }
    return `${username.slice(0, 3)}***@${domain}`;
  }
  
  // Phone number detection
  if (info.match(/^\+?[\d\s-]+$/)) {
    const cleaned = info.replace(/\D/g, '');
    if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 2)}***${cleaned.slice(-2)}`;
    }
    return `${cleaned.slice(0, 3)}*****${cleaned.slice(-3)}`;
  }
  
  // Default masking for other formats
  if (info.length <= 6) {
    return `${info.slice(0, 2)}***`;
  }
  return `${info.slice(0, 3)}*****${info.slice(-2)}`;
}
```

---

## Subscription System for Full Data Access

### Access Levels

#### Free Tier (Default)
- ✅ See masked customer info (07*****345)
- ✅ View ticket counts and stats
- ✅ Process transactions
- ❌ Cannot see full customer details
- ❌ Cannot export customer data
- ❌ Cannot send marketing messages

#### Premium Tier (Subscription Required)
- ✅ See full customer phone numbers
- ✅ See full customer emails
- ✅ Export customer data
- ✅ Send SMS/Email campaigns
- ✅ Advanced analytics
- ✅ Customer insights

### Subscription Plans
```javascript
const plans = {
  free: {
    name: 'Free',
    price: 0,
    features: {
      maskedData: true,
      fullData: false,
      export: false,
      marketing: false
    }
  },
  basic: {
    name: 'Basic',
    price: 50000, // UGX per month
    features: {
      maskedData: false,
      fullData: true,
      export: true,
      marketing: false,
      eventsLimit: 10
    }
  },
  premium: {
    name: 'Premium',
    price: 150000, // UGX per month
    features: {
      maskedData: false,
      fullData: true,
      export: true,
      marketing: true,
      eventsLimit: -1, // Unlimited
      analytics: true
    }
  }
};
```

### Backend Middleware
```javascript
// middleware/subscription.js
function requireFullDataAccess(req, res, next) {
  const user = req.user;
  
  // Check if user has active subscription
  if (user.subscriptionStatus !== 'active') {
    return res.status(403).json({
      error: 'Premium subscription required',
      message: 'Upgrade to view full customer data',
      upgradeUrl: '/organizer/subscription'
    });
  }
  
  // Check subscription tier
  if (user.subscriptionTier === 'free') {
    return res.status(403).json({
      error: 'Premium subscription required',
      message: 'This feature requires a paid subscription'
    });
  }
  
  next();
}

// Usage in routes
router.get('/api/organizer/customers/full', 
  authenticateToken, 
  requireFullDataAccess, 
  getFullCustomerData
);
```

---

## Payment Confirmation Webhook

### MTN Callback Handler
```javascript
// POST /api/momo/callback
router.post('/callback', async (req, res) => {
  const { 
    transactionId, 
    status, 
    phoneNumber, 
    amount,
    reference 
  } = req.body;
  
  try {
    if (status === 'SUCCESSFUL') {
      // Update order
      const order = await Order.findOneAndUpdate(
        { paymentReference: reference },
        { 
          status: 'completed',
          paidAt: new Date()
        }
      );
      
      // Generate tickets
      const tickets = [];
      for (let i = 0; i < order.quantity; i++) {
        const ticket = await Ticket.create({
          orderId: order.id,
          eventId: order.eventId,
          ticketType: order.ticketType,
          code: generateTicketCode(),
          qrCode: generateQRCode(),
          status: 'valid',
          customerPhone: phoneNumber
        });
        tickets.push(ticket);
      }
      
      // Send SMS with tickets
      await sendTicketSMS(phoneNumber, tickets, order);
      
      res.json({ success: true });
    } else {
      // Payment failed
      await Order.updateOne(
        { paymentReference: reference },
        { status: 'failed' }
      );
      
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});
```

---

## SMS Ticket Delivery

```javascript
async function sendTicketSMS(phoneNumber, tickets, order) {
  const event = await Event.findById(order.eventId);
  
  // Send one SMS per ticket (or combine if possible)
  for (const ticket of tickets) {
    const message = `
CEO Bazaar Ticket
Event: ${event.title}
Date: ${formatDate(event.date)}
Location: ${event.location}
Ticket: ${ticket.ticketType}
Code: ${ticket.code}

Show this code at entry or scan QR:
${process.env.APP_URL}/ticket/${ticket.id}

Valid for 1 entry only.
    `.trim();
    
    await sendSMS(phoneNumber, message);
  }
}
```

---

## Ticket Validation API

### Validate Ticket Endpoint
```javascript
// POST /api/employee/events/:eventId/validate-ticket
router.post('/:eventId/validate-ticket', 
  authenticateToken,
  requireEmployeeAccess,
  async (req, res) => {
    const { code } = req.body;
    const { eventId } = req.params;
    const employeeId = req.user.id;
    
    try {
      // Find ticket
      const ticket = await Ticket.findOne({ 
        code,
        eventId 
      }).populate('orderId');
      
      if (!ticket) {
        return res.json({
          valid: false,
          message: 'Invalid ticket code'
        });
      }
      
      // Check if already used
      if (ticket.status === 'used') {
        return res.json({
          valid: true,
          alreadyUsed: true,
          message: 'Ticket already used for entry',
          usedAt: ticket.usedAt,
          usedBy: ticket.usedBy
        });
      }
      
      // Check if cancelled
      if (ticket.status === 'cancelled') {
        return res.json({
          valid: false,
          message: 'Ticket has been cancelled'
        });
      }
      
      // Mark as used
      ticket.status = 'used';
      ticket.usedAt = new Date();
      ticket.usedBy = employeeId;
      await ticket.save();
      
      // Log entry
      await EntryLog.create({
        ticketId: ticket.id,
        eventId,
        employeeId,
        timestamp: new Date()
      });
      
      // Get masked customer info
      const customerInfo = ticket.orderId.customerPhone 
        ? maskPhoneNumber(ticket.orderId.customerPhone)
        : maskEmail(ticket.orderId.customerEmail);
      
      res.json({
        valid: true,
        alreadyUsed: false,
        message: 'Valid ticket. Entry granted.',
        ticketCode: ticket.code,
        customerInfo,
        ticketType: ticket.ticketType,
        purchaseMethod: ticket.orderId.paymentMethod,
        purchaseDate: ticket.orderId.createdAt
      });
      
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({ 
        valid: false,
        message: 'Error validating ticket' 
      });
    }
  }
);
```

---

## Database Schema Updates

### Tickets Table
```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  event_id UUID REFERENCES events(id),
  ticket_type VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  qr_code TEXT,
  status ENUM('valid', 'used', 'cancelled') DEFAULT 'valid',
  used_at TIMESTAMP NULL,
  used_by UUID REFERENCES users(id) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_event_status (event_id, status)
);
```

### USSD Sessions Table
```sql
CREATE TABLE ussd_sessions (
  id UUID PRIMARY KEY,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  event_id UUID REFERENCES events(id),
  ticket_type VARCHAR(100),
  ticket_price DECIMAL(10, 2),
  quantity INTEGER,
  total DECIMAL(10, 2),
  step VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  INDEX idx_session (session_id),
  INDEX idx_phone (phone_number)
);
```

### Entry Logs Table
```sql
CREATE TABLE entry_logs (
  id UUID PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id),
  event_id UUID REFERENCES events(id),
  employee_id UUID REFERENCES users(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_event_employee (event_id, employee_id),
  INDEX idx_timestamp (timestamp)
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan VARCHAR(50) NOT NULL,
  status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  INDEX idx_user_status (user_id, status)
);
```

---

## Testing the Flow

### 1. Test USSD Locally (Mock)
```javascript
// Test script
const testUSSD = async () => {
  // Step 1: Enter event code
  let response = await fetch('http://localhost:5000/api/ussd/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'TEST123',
      phoneNumber: '256700123456',
      text: 'TECH25'
    })
  });
  
  console.log('Step 1:', await response.json());
  
  // Step 2: Select ticket
  response = await fetch('http://localhost:5000/api/ussd/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'TEST123',
      phoneNumber: '256700123456',
      text: 'TECH25*1'
    })
  });
  
  console.log('Step 2:', await response.json());
  
  // Continue...
};
```

### 2. Test Privacy Masking
```javascript
import { maskCustomerInfo } from './utils/privacy';

console.log(maskCustomerInfo('+256700123456')); // 070*****456
console.log(maskCustomerInfo('0700123456'));    // 070*****456
console.log(maskCustomerInfo('john.doe@example.com')); // joh***@example.com
console.log(maskCustomerInfo('jo@example.com')); // j***@example.com
```

---

## Summary

✅ **USSD Integration** - Customers can buy tickets via *165*3*CODE#
✅ **Privacy Protection** - Customer info masked by default (07*****345, jo***@gmail.com)
✅ **Ticket Validation** - QR scan or manual code entry
✅ **Subscription System** - Paid plans for full data access
✅ **Secure Transactions** - MTN MoMo payment integration
✅ **SMS Delivery** - Tickets sent via SMS after payment
✅ **Entry Logging** - Track who scanned which tickets and when

This system ensures customer privacy while still allowing event operations to run smoothly!
