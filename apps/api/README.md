# Firfirtera API

Hono backend API for the Firfirtera meal-sharing application.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up Prisma:
```bash
pnpm db:generate  # Generate Prisma Client
pnpm db:push       # Push schema to database (creates SQLite database)
```

3. Start the development server:
```bash
pnpm dev
```

The API will be available at `http://localhost:3001`

## API Documentation

- Swagger UI: `http://localhost:3001/ui`
- OpenAPI JSON: `http://localhost:3001/doc`

## Database

The API uses Prisma with SQLite for development. The database file is located at `prisma/dev.db`.

### Database Schema

- **User**: User profiles and authentication
- **Meal**: Meal events (Split, Treat, Companion)
- **MealJoinedUser**: Users who have joined a meal
- **MealRequest**: Join requests for meals
- **Message**: Chat messages for meal conversations
- **ProfileComment**: Comments/ratings on user profiles

## API Routes

### Dashboard
- `GET /api/dashboard` - Get dashboard data (recommended, recent, near you, almost filled)

### Meals
- `GET /api/meals/:id` - Get meal by ID
- `POST /api/meals` - Create a new meal
- `POST /api/meals/:id/join` - Join a meal (create join request)
- `GET /api/meals/:id/requests` - Get meal join requests (host only)
- `POST /api/meals/:id/requests/:requestId/accept` - Accept join request
- `POST /api/meals/:id/requests/:requestId/decline` - Decline join request
- `GET /api/meals/:id/applied` - Get applied meal detail

### Events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/pending` - Get pending events
- `GET /api/events/past` - Get past events

### Profile
- `GET /api/profile` - Get current user profile
- `GET /api/profile/:userId` - Get participant profile

### Messages
- `GET /api/messages` - Get messages list
- `GET /api/messages/:mealId` - Get chat detail
- `POST /api/messages/:mealId` - Send a message

## Authentication

Currently uses a simple header-based authentication:
- Header: `X-User-Id: <userId>`

In production, this should be replaced with JWT token authentication.

## Environment Variables

Create a `.env` file:
```
DATABASE_URL="file:./dev.db"
```

## Development

The API uses:
- **Hono** - Web framework
- **Prisma** - ORM
- **Zod** - Schema validation
- **OpenAPI** - API documentation
