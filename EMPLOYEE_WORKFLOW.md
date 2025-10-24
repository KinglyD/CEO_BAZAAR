# Employee Workflow Documentation

## Complete Employee Journey

### Overview
Employees are team members hired by Event Organizers to help manage events. They can scan tickets, register cash/POS transactions, and view live event data.

---

## Step-by-Step Flow

### 1. Organizer Invites Employee

**Organizer Dashboard:**
```
Organizer → Settings/Team → Add Employee
  ↓
Enters employee email
  ↓
System sends invitation email with token
  ↓
Email contains registration link: 
  https://ceobazaar.com/register?invite=TOKEN123
```

**Database:**
```sql
INSERT INTO invitations (
  organizer_id,
  email,
  role,
  token,
  status
) VALUES (
  'organizer-uuid',
  'employee@example.com',
  'ticket_scanner',
  'TOKEN123',
  'pending'
);
```

---

### 2. Employee Receives Email

**Email Template:**
```
Subject: You've been invited to join [Organizer Name]'s team on CEO Bazaar

Hi there!

[Organizer Name] has invited you to join their team as a [Role].

You'll be able to:
- View and work on their events
- Scan tickets at events
- Register cash and POS transactions
- See live event statistics

Click here to create your account and accept the invitation:
[Register Now Button] → /register?invite=TOKEN123

This invitation expires in 7 days.
```

---

### 3. Employee Registers

**Registration Page (`/register?invite=TOKEN123`):**

The invite token is automatically detected from URL and associated with the account.

Employee fills form:
- Full Name: "Alice Johnson"
- Email: "employee@example.com" (must match invited email)
- Phone: "+256 700 000 000"
- **Account Type: "Employee / Ticket Scanner"** ← Important!
- Password: ••••••••
- Confirm Password: ••••••••

**After Registration:**
```javascript
// Frontend stores user data
const userData = {
  id: 'emp-uuid',
  fullName: 'Alice Johnson',
  email: 'employee@example.com',
  role: 'employee',
  token: 'jwt-token'
}

// Redirect to invites page
navigate('/employee/invites')
```

---

### 4. Employee Sees Invites Page

**URL:** `/employee/invites`

Shows all pending invitations for this employee's email.

**Sample Display:**
```
┌─────────────────────────────────────────────────┐
│ Team Invitations                                │
│ Review and respond to invitations from event    │
│ organizers                                      │
├─────────────────────────────────────────────────┤
│                                                  │
│  🎪 Tech Events Uganda                          │
│     organizer@techevents.ug                     │
│                                                  │
│     📅 5 Active Events                          │
│     👥 Role: Ticket Scanner                     │
│                                                  │
│     "We would love to have you join our team    │
│      for upcoming tech events!"                 │
│                                                  │
│     Invited on October 20, 2025                 │
│                                                  │
│                    [✓ Accept]  [✗ Decline]     │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  🎵 Music Fest Promoters                        │
│     team@musicfest.com                          │
│                                                  │
│     📅 3 Active Events                          │
│     👥 Role: Entry Manager                      │
│                                                  │
│     "Join us to manage entry for our exciting   │
│      music festivals."                          │
│                                                  │
│     Invited on October 18, 2025                 │
│                                                  │
│                    [✓ Accept]  [✗ Decline]     │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Actions:**
- **Accept:** Employee joins that organizer's team
- **Decline:** Invitation is removed

---

### 5. Employee Accepts Invite

**When "Accept" is clicked:**

```javascript
// Frontend API call
axios.post('/api/employee/invites/123/accept')

// Backend creates relationship
INSERT INTO organizer_employees (
  organizer_id,
  employee_id,
  role,
  status
) VALUES (
  'organizer-uuid',
  'employee-uuid',
  'ticket_scanner',
  'active'
);

// Update invitation
UPDATE invitations 
SET status = 'accepted' 
WHERE id = 123;
```

**After accepting:**
```
✓ Success message appears
  ↓
Redirect to /employee/dashboard after 1.5 seconds
```

---

### 6. Employee Dashboard

**URL:** `/employee/dashboard`

Shows all events from organizers the employee works for.

**Sidebar Navigation:**
- 🏠 My Events
- ✉️ Invitations (shows badge if pending invites exist)

**Main Content:**

Filter tabs:
- All Events
- Live Now (events happening right now)
- Today
- Upcoming

**Event Cards Display:**
```
┌──────────────────────────────────────┐
│  [Event Image]       🔴 Live Now     │
├──────────────────────────────────────┤
│  Music Festival                       │
│  by Music Fest Promoters             │
│                                       │
│  📅 Oct 24, 2025                     │
│  🕐 14:00 - 23:00                    │
│  📍 Kololo Airstrip                  │
│  👥 1847 / 2000 tickets sold         │
│                                       │
│  ✓ Entry Manager                     │
│                  Start Working →     │
└──────────────────────────────────────┘
```

Employee clicks on an event card to start working.

---

### 7. Event Work Page

**URL:** `/employee/event/:eventId`

This is where the magic happens!

**Page Sections:**

#### A. Header
```
← Back to Events

Music Festival                          🔴 Live
Kololo Airstrip • Oct 24, 2025
```

#### B. Stats Dashboard
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 👥 Tickets  │ │ Regular     │ │ VIP         │ │ VVIP        │
│    Sold     │ │             │ │             │ │             │
│   1,847     │ │   1,200     │ │    500      │ │    147      │
│ of 2000     │ │ UGX 50,000  │ │ UGX 100,000 │ │ UGX 200,000 │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

#### C. Manual Transaction Entry
```
[+ Register Cash/POS Transaction]  ← Button to expand form

When clicked, form appears:
┌──────────────────────────────────────────────────┐
│ Manual Transaction Entry                          │
├──────────────────────────────────────────────────┤
│ Customer Name:    [John Doe              ]       │
│ Phone Number:     [+256 700 000 000      ]       │
│ Ticket Type:      [VIP - UGX 100,000   ▼]       │
│ Amount:           [100000                ]       │
│ Payment Method:   [Cash                 ▼]       │
│                                                   │
│                [Register Transaction]            │
└──────────────────────────────────────────────────┘
```

#### D. Live Transaction Feed
```
┌──────────────────────────────────────────────────────────────┐
│ Live Transaction Feed                                         │
│ Real-time ticket purchases                                   │
├──────────────────────────────────────────────────────────────┤
│ Time     │ Customer      │ Phone          │ Amount  │ Payment │
├──────────────────────────────────────────────────────────────┤
│ 14:32:05 │ [Manual] John │ +256 700...    │ 100,000 │ 💵 Cash │
│ 14:31:42 │ Jane Smith    │ +256 701...    │ 50,000  │ 📱 MoMo │
│ 14:31:15 │ Bob Wilson    │ +256 702...    │ 200,000 │ 💳 POS  │
│ 14:30:58 │ Alice Brown   │ +256 703...    │ 100,000 │ 📱 MoMo │
│ ...                                                           │
└──────────────────────────────────────────────────────────────┘
```

**Live Updates:**
- New transactions appear at the top automatically (via WebSocket)
- Each new row gets highlighted briefly in gold
- Manual entries are marked with [Manual] badge
- Auto-updates every few seconds

---

## Use Cases

### Use Case 1: Cash Payment at Entry
```
Customer arrives at event without ticket
  ↓
Employee opens event page
  ↓
Clicks "+ Register Cash/POS Transaction"
  ↓
Fills form:
  - Name: "John Doe"
  - Phone: "+256 700 123 456"
  - Ticket Type: "Regular"
  - Amount: 50,000 (auto-filled from ticket type)
  - Payment Method: "Cash"
  ↓
Clicks "Register Transaction"
  ↓
Transaction appears in live feed
  ↓
System generates ticket and sends SMS to customer
```

### Use Case 2: POS Payment
```
Customer wants to pay via card
  ↓
Employee processes POS payment
  ↓
Registers transaction selecting "POS/Card" method
  ↓
Customer receives ticket instantly
```

### Use Case 3: Monitoring Live Sales
```
Employee opens event page
  ↓
Sees real-time dashboard of ticket sales
  ↓
Watches live feed of online purchases
  ↓
Can see how many tickets left
  ↓
Can inform management if event is selling out
```

---

## Key Features

### For Employees:
✅ Accept/decline invites from multiple organizers
✅ Work for multiple organizers simultaneously
✅ See only events they're assigned to
✅ View live event statistics
✅ Register cash and POS transactions on-site
✅ See real-time purchase feed
✅ Easy-to-use mobile-friendly interface

### For Organizers:
✅ Invite team members via email
✅ Assign roles to employees
✅ Track employee activity
✅ Employees can handle cash/POS payments
✅ Reduce ticket fraud with trained staff
✅ Get real-time sales data through employee portal

---

## API Endpoints Needed

### Employee Endpoints
```
GET    /api/employee/invites              - Get pending invites
POST   /api/employee/invites/:id/accept   - Accept invite
POST   /api/employee/invites/:id/decline  - Decline invite
GET    /api/employee/events                - Get events from organizers they work for
GET    /api/employee/events/:id            - Get specific event details
POST   /api/employee/events/:id/transactions - Register manual transaction
GET    /api/employee/events/:id/live       - Get live transaction feed (WebSocket)
```

### Organizer Endpoints (for sending invites)
```
POST   /api/organizer/invite               - Send employee invitation
GET    /api/organizer/team                 - Get team members
DELETE /api/organizer/team/:id             - Remove team member
```

---

## Database Tables

### invitations
```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY,
  organizer_id UUID REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  message TEXT,
  status ENUM('pending', 'accepted', 'declined', 'expired') DEFAULT 'pending',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### organizer_employees
```sql
CREATE TABLE organizer_employees (
  id UUID PRIMARY KEY,
  organizer_id UUID REFERENCES users(id),
  employee_id UUID REFERENCES users(id),
  role VARCHAR(50) NOT NULL,
  status ENUM('active', 'suspended') DEFAULT 'active',
  hired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organizer_id, employee_id)
);
```

### manual_transactions
```sql
CREATE TABLE manual_transactions (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  employee_id UUID REFERENCES users(id),
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  ticket_type VARCHAR(100),
  amount DECIMAL(10, 2),
  payment_method ENUM('cash', 'pos') NOT NULL,
  status ENUM('completed', 'pending') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Testing the Flow

### Frontend Testing (Available Now):

1. **Register as Employee:**
   - Go to http://localhost:3000/register
   - Select "Employee / Ticket Scanner"
   - Complete registration
   - You'll be redirected to `/employee/invites`

2. **View Invites:**
   - See mock invitations
   - Click "Accept" on an invite
   - Get redirected to dashboard

3. **View Events:**
   - See events from organizers you work for
   - Filter by "Live Now", "Today", "Upcoming"
   - Click on an event

4. **Work on Event:**
   - See live stats
   - Click "+ Register Cash/POS Transaction"
   - Fill form and submit
   - See transaction appear in feed
   - Watch live feed auto-update

### Backend Integration Required:
- Connect to actual API endpoints
- Implement WebSocket for real-time updates
- Add email sending for invitations
- Implement proper authentication
- Add transaction validation

---

## Summary

The employee flow provides a complete system for:
1. **Inviting** team members to help with events
2. **Onboarding** employees through email invitations
3. **Managing** multiple organizer relationships
4. **Working** live events with real-time data
5. **Processing** cash and POS payments on-site
6. **Tracking** all transactions in real-time

This creates a professional event management system where organizers can scale their operations by bringing in trusted team members to handle various aspects of event execution!
