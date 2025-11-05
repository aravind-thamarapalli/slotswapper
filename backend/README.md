# Backend - SlotSwapper API

Node.js/Express REST API for SlotSwapper application with MongoDB.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and update:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Events
- `POST /api/events` - Create event (protected)
- `GET /api/events` - Get user's events (protected)
- `PUT /api/events/:eventId` - Update event (protected)
- `DELETE /api/events/:eventId` - Delete event (protected)
- `PATCH /api/events/:eventId/toggle-swappable` - Toggle swappable status (protected)

### Swaps
- `GET /api/swaps/available` - Get available slots for swapping (protected)
- `POST /api/swaps/request` - Create swap request (protected)
- `GET /api/swaps/requests` - Get swap requests (protected)
- `POST /api/swaps/request/:requestId/respond` - Respond to swap request (protected)
- `DELETE /api/swaps/request/:requestId/cancel` - Cancel swap request (protected)

## Technologies

- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS enabled
- Helmet for security
- Rate limiting

## Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```
