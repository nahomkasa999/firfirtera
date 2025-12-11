import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono<{

  }>();

  
  app.use(
    "*",
    cors({
      origin: ["http://localhost:3000"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  );

  app.onError((err, c) => {
    console.error("Unhandled error:", err);
    return c.json(
      {
        error: "Internal Server Error",
        message: err.message || "Something went wrong",
      },
      500
    );
  });

  
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