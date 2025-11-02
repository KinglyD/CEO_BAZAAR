# CEO Bazaar Data Storage Architecture

## 📍 Where User Data is Stored

All user data is stored in **MongoDB** database with the following structure:

### 🗄️ Database: `ceo_bazaar`
**Location**: `mongodb://localhost:27017/ceo_bazaar`

---

## 📊 Data Collections (Tables)

### 1. **Users Collection** (`users`)
**Stores**: All user accounts, profiles, authentication data

```javascript
// Example User Document
{
  _id: ObjectId("..."),
  firstName: "John",
  lastName: "Doe", 
  email: "john@example.com",
  phone: "+256700123456",
  password: "hashed_password", // BCrypt hashed
  organizations: [
    {
      organization: ObjectId("org_id"),
      role: "admin", // or "employee"
      permissions: {
        canCreateEvents: true,
        canManageUsers: true
      }
    }
  ],
  subscription: {
    plan: "pro", // free, pro, premium
    aiCreditsUsed: 25,
    smsCreditsUsed: 50
  },
  preferences: {
    language: "en",
    notifications: { email: true, sms: true }
  },
  createdAt: ISODate("2025-11-02T..."),
  updatedAt: ISODate("2025-11-02T...")
}
```

### 2. **Organizations Collection** (`organizations`)
**Stores**: Company/organization profiles, settings, subscriptions

```javascript
// Example Organization Document  
{
  _id: ObjectId("..."),
  name: "EventsPro Uganda",
  slug: "eventspro-uganda",
  email: "info@eventspro.ug",
  phone: "+256700000000",
  address: {
    street: "Plot 123 Kampala Road",
    city: "Kampala", 
    country: "Uganda"
  },
  subscription: {
    plan: "pro",
    startDate: ISODate("..."),
    endDate: ISODate("...")
  },
  platformFees: {
    oneTime: 0.07, // 7% for pro plan
    recurring: 0.05 // 5% for pro plan
  },
  stats: {
    totalEvents: 25,
    totalRevenue: 50000000, // UGX
    totalCustomers: 1250
  },
  owner: ObjectId("user_id")
}
```

### 3. **Events Collection** (`events`)
**Stores**: All event information, tickets, collaboration data

```javascript
// Example Event Document
{
  _id: ObjectId("..."),
  title: "Music Festival 2025",
  slug: "music-festival-2025-1730544000000",
  description: "East Africa's biggest music festival...",
  category: "music",
  startDate: ISODate("2025-12-25T14:00:00Z"),
  venue: {
    name: "Kololo Airstrip",
    address: {
      city: "Kampala",
      country: "Uganda"
    }
  },
  capacity: 10000,
  ticketTypes: [
    {
      name: "VIP",
      price: 100000,
      quantity: 1000,
      sold: 750
    }
  ],
  organizer: ObjectId("organization_id"),
  coOrganizers: [
    {
      organization: ObjectId("co_org_id"),
      revenueShare: 30, // 30%
      status: "accepted"
    }
  ],
  totalRevenue: 85000000,
  platformRevenue: 5100000, // 6%
  status: "active",
  isFeatured: true
}
```

### 4. **Transactions Collection** (`transactions`) 
**Stores**: All payments, ticket purchases, customer data (masked/unmasked)

```javascript
// Example Transaction Document
{
  _id: ObjectId("..."),
  transactionId: "TXN-30544000-AB12", 
  type: "ticket_purchase",
  event: ObjectId("event_id"),
  organization: ObjectId("org_id"),
  
  // Customer data - masked for free plans, full for paid plans
  customer: {
    email: {
      original: "john.doe@gmail.com", // Only for paid subscriptions
      masked: "jo***@gmail.com",      // For free subscriptions
      type: "masked" // or "original"
    },
    phone: {
      original: "+256700123456",
      masked: "07*****456", 
      type: "masked"
    },
    name: "John Doe"
  },
  
  items: [
    {
      type: "ticket",
      name: "VIP Ticket", 
      price: 100000,
      quantity: 2,
      subtotal: 200000
    }
  ],
  
  amount: 200000,
  platformFee: 12000, // 6%
  organizerAmount: 188000,
  
  payment: {
    method: "mobile_money",
    provider: "MTN",
    status: "completed",
    paidAt: ISODate("...")
  },
  
  // Generated tickets with QR codes
  tickets: [
    {
      ticketId: "TKT-1730544000-ABC123",
      qrCode: "https://api.ceobazaar.com/tickets/validate/TKT-1730544000-ABC123",
      ticketType: "VIP",
      status: "valid"
    }
  ]
}
```

### 5. **Merchandise Collection** (`merchandise`)
**Stores**: Product information, inventory, sales data

### 6. **Analytics Collection** (`analytics`)
**Stores**: Aggregated statistics, reports, performance metrics

---

## 🔐 Data Privacy & Security

### **Customer Data Masking**
- **Free Plan**: Customer emails/phones are **masked** (`jo***@gmail.com`, `07*****345`)
- **Paid Plans**: Full customer data access for marketing purposes
- **Stored Both Ways**: Original data for paid access, masked for free display

### **Password Security**
- Passwords hashed with **BCrypt** (cost factor 12)
- Never stored in plain text
- JWT tokens for authentication

### **Data Access Control**
```javascript
// Based on organization subscription plan
if (organization.subscription.plan === 'free') {
  return transaction.customer.email.masked; // "jo***@gmail.com"
} else {
  return transaction.customer.email.original; // "john@gmail.com" 
}
```

---

## 📈 Data Flow

### **User Registration**
1. **Input**: Frontend form → `POST /api/auth/register`
2. **Processing**: Validate data, hash password, create user document
3. **Storage**: Save to `users` collection in MongoDB
4. **Response**: Return JWT token + masked user data

### **Event Creation**
1. **Input**: Admin creates event → `POST /api/events`
2. **Processing**: Validate data, generate slug, set organization
3. **Storage**: Save to `events` collection
4. **Update**: Update organization stats

### **Ticket Purchase**
1. **Input**: Customer buys ticket → `POST /api/transactions`
2. **Processing**: Process payment, generate QR codes
3. **Storage**: Save to `transactions` collection with masked/original customer data
4. **Update**: Update event ticket count, organization revenue

---

## 🛠️ Database Configuration

### **Connection String**
```bash
MONGODB_URI=mongodb://localhost:27017/ceo_bazaar
```

### **Indexes for Performance**
- User email, phone (unique)
- Organization slug (unique) 
- Event organizer, status, dates
- Transaction organization, customer info, dates

### **Data Retention**
- **Transactions**: Permanent (for financial records)
- **User Data**: Configurable per organization (default 365 days after deletion)
- **Analytics**: Aggregated data retained indefinitely

---

## 📊 Data Size Estimates

### **Per User** 
- User document: ~2KB
- Average transactions: ~50KB/month
- Event data: ~10KB per event created

### **Per Organization**
- Organization document: ~5KB  
- Events: ~500KB/month (50 events)
- Transactions: ~1MB/month (1000 transactions)

### **Total Database Size** (1000 users, 100 organizations)
- Users: ~2MB
- Organizations: ~500KB
- Events: ~50MB
- Transactions: ~100MB/month
- **Estimated Growth**: ~150MB/month

This architecture ensures **scalable storage**, **data privacy compliance**, and **efficient querying** for the CEO Bazaar platform.