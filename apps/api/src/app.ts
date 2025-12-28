import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import dashboardRoute from "./routes/dashboard.js";
import mealsRoute from "./routes/meals.js";
import eventsRoute from "./routes/events.js";
import profileRoute from "./routes/profile.js";
import messagesRoute from "./routes/messages.js";

const app = new OpenAPIHono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization", "X-User-Id"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.onError((err, c) => {
  console.error("ERROR:", err);
  return c.json(
    {
      error: "Internal Server Error",
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
    500
  );
});

// API Routes - Mount them BEFORE doc definition to ensure they are collected
app.route("/api", dashboardRoute);
app.route("/api", mealsRoute);
app.route("/api", eventsRoute);
app.route("/api", profileRoute);
app.route("/api", messagesRoute);

// Swagger UI configuration
app.get("/ui", swaggerUI({ url: "/doc" }));

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Firfirtera API",
    description: "API for Firfirtera",
  },
});

export default app;