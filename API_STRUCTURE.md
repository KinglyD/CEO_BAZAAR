# CEO Bazaar - Backend API Structure

## Overview
This document explains how the frontend connects to the backend and how events flow from organizer creation to customer viewing.

## The Complete Flow

### 1. **User Registration → Organizer Dashboard**
```
User clicks "Start Selling" 
  → Fills registration form (/register)
  → POST /api/auth/register
  → Backend creates user with role='organizer'
  → Returns: { user, token }
  → Frontend stores token in localStorage
  → Redirects to /organizer/dashboard
```

### 2. **Organizer Creates Event**
```
Organizer clicks "Create Event"
  → Fills event form
  → POST /api/events
  → Backend saves event with organizer_id
  → Returns: { event }
  → Redirects to /organizer/dashboard
```

### 3. **Homepage Shows All Events**
```
Customer visits homepage (/)
  → GET /api/events (public)
  → Backend returns all active events
  → Frontend displays in "Upcoming Events" section
```

## Required API Endpoints

### Authentication
```
POST /api/auth/register
Body: {
  fullName: string
  email: string
  phone: string
  password: string
  accountType: 'organizer' | 'employee' | 'customer'
}
Response: {
  user: { id, fullName, email, phone, role },
  token: string
}

POST /api/auth/login
Body: { email: string, password: string }
Response: {
  user: { id, fullName, email, phone, role },
  token: string
}
```

### Events (Organizer)
```
POST /api/events
Headers: { Authorization: Bearer <token> }
Body: {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  capacity: number
  eventType: 'paid' | 'free'
  image: File
  tickets: [{ name, price, quantity }]
}
Response: { event }

GET /api/organizer/events
Headers: { Authorization: Bearer <token> }
Response: { events: [] } // Only organizer's events

PUT /api/events/:id
Headers: { Authorization: Bearer <token> }
Body: { ...event fields }
Response: { event }

DELETE /api/events/:id
Headers: { Authorization: Bearer <token> }
Response: { success: true }
```

### Events (Public)
```
GET /api/events
Response: { events: [] } // All active events

GET /api/events/:id
Response: { event } // Single event details
```

### Merchandise (Similar structure to events)
```
POST /api/merchandise
GET /api/merchandise
GET /api/organizer/merchandise
PUT /api/merchandise/:id
DELETE /api/merchandise/:id
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('organizer', 'employee', 'customer', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  organizer_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location VARCHAR(255),
  capacity INTEGER,
  event_type ENUM('paid', 'free') DEFAULT 'paid',
  image_url VARCHAR(500),
  status ENUM('draft', 'published', 'cancelled') DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tickets Table
```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  sold INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Merchandise Table
```sql
CREATE TABLE merchandise (
  id UUID PRIMARY KEY,
  organizer_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES users(id),
  order_type ENUM('event', 'merchandise') NOT NULL,
  item_id UUID NOT NULL, -- event_id or merchandise_id
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  payment_method VARCHAR(50),
  momo_transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Frontend State Management

### Using localStorage (Current Implementation)
```javascript
// After login/register
localStorage.setItem('user', JSON.stringify(userData))
localStorage.setItem('token', token)

// To get current user
const user = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('token')

// To logout
localStorage.removeItem('user')
localStorage.removeItem('token')
```

### Recommended: Create Auth Context (Next Step)
Create `/frontend/src/context/AuthContext.jsx` to manage auth state globally.

## API Integration Steps

1. **Install axios** (already in package.json)
2. **Create API service file**:
   ```javascript
   // src/services/api.js
   import axios from 'axios'
   
   const API_BASE_URL = 'http://localhost:5000/api' // Your backend URL
   
   const api = axios.create({
     baseURL: API_BASE_URL,
   })
   
   // Add token to requests
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token')
     if (token) {
       config.headers.Authorization = `Bearer ${token}`
     }
     return config
   })
   
   export default api
   ```

3. **Replace mock API calls** in components with actual axios calls
4. **Handle errors** properly
5. **Add loading states**

## Next Steps

1. ✅ Frontend registration flow (DONE)
2. ✅ Frontend login flow (DONE)
3. ✅ Frontend create event form (EXISTS)
4. 🔄 Connect frontend to backend API
5. 🔄 Build backend API with Node.js/Express or Python/Flask
6. 🔄 Implement database
7. 🔄 Add authentication middleware
8. 🔄 Implement payment integration (MTN MoMo)
9. 🔄 Add image upload functionality
10. 🔄 Implement real-time event updates
