import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import type { ProfileData, ParticipantProfileData } from "@repo/shared/types";
import { prisma } from "../db/client.js";
import { requireAuth, getUserIdFromRequest } from "../lib/auth.js";
import {
  prismaUserToProfileData,
  prismaUserToParticipantProfileData,
} from "../db/helpers.js";

const profileRoute = new OpenAPIHono();

// Get current user profile
profileRoute.openapi(
  {
    method: "get",
    path: "/profile",
    summary: "Get current user profile",
    description: "Returns the authenticated user's profile",
    tags: ["Profile"],
    responses: {
      200: {
        description: "User profile",
        content: {
          "application/json": {
            schema: z.object({
              name: z.string(),
              profilePicture: z.string(),
              aboutme: z.string(),
              interests: z.array(z.string()),
              occupation: z.string(),
              stats: z.object({
                hosted: z.number(),
                joined: z.number(),
                rating: z.number(),
              }),
              comments: z.array(z.any()),
            }),
          },
        },
      },
      404: {
        description: "User not found",
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Fetch comments
    const comments = await prisma.profileComment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const profileData = prismaUserToProfileData(user, comments);
    return c.json(profileData);
  }
);

// Get participant profile
profileRoute.openapi(
  {
    method: "get",
    path: "/profile/{userId}",
    summary: "Get participant profile",
    description: "Returns profile information for another user",
    tags: ["Profile"],
    request: {
      params: z.object({
        userId: z.string().describe("User ID"),
      }),
      query: z.object({
        requestId: z.string().optional().describe("Request ID (if viewing from join request)"),
      }),
    },
    responses: {
      200: {
        description: "Participant profile",
        content: {
          "application/json": {
            schema: z.any(),
          },
        },
      },
      404: {
        description: "User not found",
      },
    },
  },
  async (c) => {
    const { userId } = c.req.valid("param");
    const { requestId } = c.req.valid("query");
    const currentUserId = getUserIdFromRequest(c);

    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const participantProfile = prismaUserToParticipantProfileData(
      user,
      requestId,
      !!requestId && currentUserId !== userId
    );

    return c.json(participantProfile);
  }
);

export default profileRoute;
