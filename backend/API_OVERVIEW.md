# CEO BAZAAR Backend API Documentation

## Server Configuration
- **Base URL**: `http://localhost:5001`
- **Environment**: Development
- **Database**: MongoDB (running on default port 27017)
- **Authentication**: JWT Tokens (Access + Refresh)

## Authentication System 🔐

### Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| GET | `/api/auth/profile` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Features
- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- Role-based access control (Admin, Employee per organization)
- User profile management
- Organization membership tracking

## AI Integration System 🤖

### Claude AI Services
| Method | Endpoint | Description | Credits | Auth Required |
|--------|----------|-------------|---------|---------------|
| POST | `/api/ai/generate-content` | Generate event content | 3 | Yes |
| POST | `/api/ai/suggest-titles` | Get title suggestions | 1 | Yes |
| POST | `/api/ai/improve-content` | Enhance existing content | 2 | Yes |
| POST | `/api/ai/marketing-campaign` | Create marketing content | 5 | Yes |
| POST | `/api/ai/social-media-posts` | Generate social posts | 3 | Yes |
| POST | `/api/ai/sms-campaign` | Create SMS campaign | 4 | Yes |
| POST | `/api/ai/business-insights` | Generate business insights | 6 | Yes |
| GET | `/api/ai/credits` | Check AI credit balance | 0 | Yes |

### AI Credit System
- **Free Tier**: 10 credits/month
- **Pro Tier**: 100 credits/month  
- **Premium Tier**: 500 credits/month
- Credits reset monthly
- Usage tracking and history

## Event Management System 📅

### Event CRUD Operations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | List all events | Yes |
| POST | `/api/events` | Create new event | Yes |
| GET | `/api/events/:id` | Get event details | Yes |
| PUT | `/api/events/:id` | Update event | Yes |
| DELETE | `/api/events/:id` | Delete event | Yes |

### AI-Enhanced Event Features
| Method | Endpoint | Description | Credits | Auth Required |
|--------|----------|-------------|---------|---------------|
| POST | `/api/events/ai-create` | AI-powered event creation | 3 | Yes |
| POST | `/api/events/:id/ai-enhance` | Enhance event with AI | 2 | Yes |
| GET | `/api/events/organization/:orgId` | Organization events | 0 | Yes |

### Event Features
- Complete CRUD operations
- AI-generated descriptions and titles
- Date and capacity validation
- Ticket type management
- Organization-based access control
- Event status tracking (draft, published, active, completed, cancelled)

## Organization Management 🏢

### Organization Operations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/organizations` | User's organizations | Yes |
| GET | `/api/organizations/:id` | Organization details | Yes |
| PUT | `/api/organizations/:id` | Update organization | Yes (Admin only) |
| GET | `/api/organizations/:id/stats` | Organization statistics | Yes |

### Features
- User organization membership
- Role-based permissions
- Organization statistics
- Multi-tenant architecture support

## Data Models 📊

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  organizations: [{ organizationId, role }],
  subscription: { type, aiCredits, creditsUsed, resetDate },
  isActive: Boolean,
  createdAt: Date
}
```

### Organization Model
```javascript
{
  name: String,
  description: String,
  type: String (business, nonprofit, personal),
  phone: String,
  email: String,
  address: Object,
  members: [{ userId, role, joinedAt }],
  subscription: Object,
  createdAt: Date
}
```

### Event Model
```javascript
{
  title: String,
  description: String,
  organization: ObjectId,
  venue: Object,
  startDate: Date,
  endDate: Date,
  capacity: Number,
  ticketTypes: [Object],
  status: String (draft, published, active, completed, cancelled),
  aiGenerated: Object,
  createdBy: ObjectId,
  createdAt: Date
}
```

## Authentication Flow 🔄

1. **Registration/Login**: User provides credentials
2. **Token Generation**: Server returns access + refresh tokens
3. **API Access**: Include `Authorization: Bearer <token>` header
4. **Token Refresh**: Use refresh token when access token expires
5. **Organization Access**: User must be member of organization to access org resources

## AI Credit Management 💳

1. **Credit Allocation**: Based on subscription tier
2. **Usage Tracking**: Each AI operation deducts credits
3. **Credit Validation**: Operations blocked if insufficient credits
4. **Monthly Reset**: Credits reset on subscription renewal date
5. **Usage History**: Track all AI operations for analytics

## Validation & Security 🛡️

### Input Validation
- All endpoints have comprehensive validation middleware
- Email format validation
- Password strength requirements
- Date range validation
- Capacity and numeric limits

### Security Features
- JWT token authentication
- Password hashing with salt
- Role-based access control
- Organization membership validation
- API rate limiting (to be implemented)

## Error Handling 🚨

### Standard Error Responses
```javascript
{
  success: false,
  message: "Error description",
  errors: ["Detailed error messages"],
  code: "ERROR_CODE"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Environment Configuration ⚙️

### Required Environment Variables
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ceo_bazaar
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
ANTHROPIC_API_KEY=your_claude_api_key
```

## Next Development Priorities 🎯

1. **Collaborative Events System**: Multi-organization event creation
2. **Transaction & Payment System**: Mobile Money, Card, Cash processing
3. **AI-Powered Merchandise**: Product management with AI descriptions
4. **Ticket Validation**: QR code generation and scanning
5. **Subscription Management**: Platform billing and AI credit management

## Testing Status ✅

### Completed & Tested
- ✅ Server startup and health checks
- ✅ MongoDB connection
- ✅ Authentication endpoints
- ✅ AI credit management
- ✅ Event CRUD operations (ready for testing)

### Pending Testing
- 🔄 AI integration (requires API key)
- 🔄 Organization management
- 🔄 Event AI enhancement features

---

**Last Updated**: Current Session  
**API Version**: v1.0  
**Status**: Development Phase  