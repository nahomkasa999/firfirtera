import { serve } from "@hono/node-server";
import app from "./app.js";
import { seedDatabase } from "./db/seed.js";

// Seed database with initial data
seedDatabase().catch(console.error);

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`Swagger UI: http://localhost:${info.port}/ui`);
  }
);