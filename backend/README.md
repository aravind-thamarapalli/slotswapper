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

## Using MongoDB Atlas

You can host your database on MongoDB Atlas instead of running a local MongoDB instance.

1. Create a free cluster at https://cloud.mongodb.com.
2. Create a database user and note the username/password.
3. Add network access (for development you can add 0.0.0.0/0, but restrict this in production).
4. In Atlas, click "Connect" → "Drivers" and copy the connection string (it will look like `mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority`).
5. Set the `MONGODB_URI` environment variable in your `.env` file to the Atlas connection string.

Example `.env` entry:

```
MONGODB_URI=mongodb+srv://slotswapper_user:ChangeMe@cluster0.abcd123.mongodb.net/slotswapper?retryWrites=true&w=majority
```

Note: If you're using the included `docker-compose.yml`, the compose file provides a local `mongodb` service for convenience. If you switch to Atlas you can keep that service but the backend will use the `MONGODB_URI` value from your environment; you can also remove or ignore the `mongodb` service when deploying with Atlas.


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
