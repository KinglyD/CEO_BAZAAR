# CEO Bazaar Backend API

Backend API for the CEO Bazaar event management platform built with Node.js, Express, and MongoDB.

## Features

- **Event Management**: Create, manage, and collaborate on events
- **Organization System**: Multi-tenant architecture with role-based access
- **Ticket Validation**: QR code generation and scanning
- **Payment Processing**: Multiple payment methods support
- **Real-time Updates**: Live transaction feeds and notifications
- **Subscription System**: Tiered plans with different features
- **Admin Controls**: Event moderation and platform management

## Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone and navigate to backend
cd /Users/kingly/CEO_BAZAAR/backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Variables

Key environment variables (see `.env` for full list):

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ceo_bazaar
JWT_SECRET=your_secure_secret
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication (Coming Soon)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Events (Coming Soon)
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Organizations (Coming Soon)
- `GET /api/organizations` - List user's organizations
- `POST /api/organizations` - Create organization
- `POST /api/organizations/:id/members` - Add member

## Project Structure

```
backend/
├── server.js                 # Main server file
├── src/
│   ├── config/
│   │   └── database.js       # Database connection
│   ├── controllers/          # Route controllers
│   ├── middleware/          # Custom middleware
│   │   └── errorHandler.js   # Global error handler
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   └── services/            # Business logic
├── uploads/                 # File upload directory
└── .env                    # Environment variables
```

## Development Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with sample data
npm test         # Run tests (not implemented yet)
```

## Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Real-time**: Socket.io
- **Validation**: express-validator
- **Email**: Nodemailer
- **QR Codes**: qrcode package

## Development Status

✅ **Completed**
- [x] Basic server setup
- [x] Database connection
- [x] Error handling
- [x] Security middleware
- [x] Environment configuration

⚠️ **In Progress**
- [ ] Authentication system
- [ ] Event management APIs
- [ ] Organization system

📋 **Planned**
- [ ] Payment processing
- [ ] Real-time features
- [ ] File upload system
- [ ] AI marketing integration
- [ ] Analytics and reporting

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

ISC License - CEO Bazaar Team