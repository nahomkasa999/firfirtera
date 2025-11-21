# Local Database Setup

This Next.js app uses SQLite with Prisma for local development.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

3. **Create database and tables:**
   ```bash
   npm run db:push
   ```

4. **Seed the database with mock data:**
   ```bash
   npm run db:seed
   ```

5. **Enable local database mode:**
   Create a `.env.local` file in the `miniapp` directory with:
   ```
   NEXT_PUBLIC_USE_LOCAL_DB=true
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

## Available Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database (creates tables)
- `npm run db:seed` - Seed database with mock data
- `npm run db:studio` - Open Prisma Studio to view/edit data

## Database Location

The SQLite database file is located at: `prisma/dev.db`

## Mock Data Includes

- **5 Restaurants** (Kategna, Habesha 2000, Yod Abyssinia, Lucy, Fasika)
- **15+ Menu Items** with prices and descriptions
- **4 Users** with different usernames
- **2 Meal Requests** (one OPEN, one FULL)
- **3 Participants** for the meal requests

## API Routes

The app includes local API routes in `app/api/` that use the SQLite database:
- `/api/restaurants` - Get all restaurants
- `/api/restaurants/[id]` - Get restaurant details
- `/api/menus/[restaurantId]` - Get menu items for a restaurant
- `/api/meals` - Get all meals / Create new meal
- `/api/meals/[id]` - Get meal details
- `/api/meals/[id]/join` - Join a meal
- `/api/meals/[id]/cancel` - Cancel a meal
- `/api/user/profile` - Get user profile

## Notes

- The database is SQLite, so it's file-based and perfect for local development
- All data is stored in `prisma/dev.db`
- You can view/edit data using Prisma Studio: `npm run db:studio`
- The database schema matches the main PostgreSQL schema but uses SQLite types
- Set `NEXT_PUBLIC_USE_LOCAL_DB=true` in `.env.local` to use local API routes instead of external API
