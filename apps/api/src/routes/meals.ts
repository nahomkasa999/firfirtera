import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import type {
  MealDetailData,
  CreateMealData,
  HostMealRequestsData,
  AppliedMealDetailData,
  MealRequestUser,
} from "@repo/shared/types";
import { prisma } from "../db/client.js";
import { transformToMealDetail } from "../lib/mealHelpers.js";
import { formatMealTime } from "../utils/date.js";
import { requireAuth } from "../lib/auth.js";
import { v4 as uuidv4 } from "uuid";
import {
  prismaMealToBaseMealData,
  createMealDataToPrisma,
} from "../db/helpers.js";

const mealsRoute = new OpenAPIHono();

// Get meal by ID
mealsRoute.openapi(
  {
    method: "get",
    path: "/meals/{id}",
    summary: "Get meal by ID",
    description: "Returns detailed meal information",
    tags: ["Meals"],
    request: {
      params: z.object({
        id: z.string().describe("Meal ID"),
      }),
    },
    responses: {
      200: {
        description: "Meal details",
        content: {
          "application/json": {
            schema: z.any(),
          },
        },
      },
      404: {
        description: "Meal not found",
      },
    },
  },
  async (c) => {
    const { id } = c.req.valid("param");
    const userId = c.req.header("X-User-Id") || "";

    const meal = await prisma.meal.findUnique({
      where: { mealId: id },
      include: {
        host: true,
        joinedUsers: true,
        mealRequests: {
          where: {
            userId,
            status: "Pending",
          },
        },
      },
    });

    if (!meal) {
      return c.json({ error: "Meal not found" }, 404);
    }

    const baseMeal = prismaMealToBaseMealData(meal, userId);
    const mealDetail = transformToMealDetail(baseMeal);
    return c.json(mealDetail);
  }
);

// Create meal
const createMealSchema = z.object({
  mealtype: z.enum(["Split", "Companion"]),
  mealname: z.string().optional(),
  totalMealPrice: z.number().optional(),
  contributionAmount: z.number().optional(),
  meallocation: z.string(),
  mealtime: z.string().datetime(),
  expectedusers: z.number(),
  mealgenderpreference: z.enum(["Anonymous", "Specific"]),
  numberofmales: z.number().optional(),
  mealdescription: z.string().optional(),
  mealpicture: z.string().optional(),
  mealvideo: z.string().optional(),
});

mealsRoute.openapi(
  {
    method: "post",
    path: "/meals",
    summary: "Create a new meal",
    description: "Creates a new meal event",
    tags: ["Meals"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: createMealSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Meal created",
        content: {
          "application/json": {
            schema: z.any(),
          },
        },
      },
      400: {
        description: "Invalid request",
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);
    const body = c.req.valid("json");

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Validate meal price
    if (body.mealtype === "Split" && !body.totalMealPrice) {
      return c.json({ error: "totalMealPrice is required for Split meals" }, 400);
    }
    if (body.mealtype === "Companion" && !body.contributionAmount) {
      return c.json(
        { error: "contributionAmount is required for Companion meals" },
        400
      );
    }

    // Convert string datetime to Date
    const createMealData: CreateMealData = {
      ...body,
      mealtime: new Date(body.mealtime),
    };

    const mealData = createMealDataToPrisma(createMealData, userId);

    const newMeal = await prisma.meal.create({
      data: mealData,
      include: {
        host: true,
        joinedUsers: true,
      },
    });

    const baseMeal = prismaMealToBaseMealData(newMeal, userId);
    const mealDetail = transformToMealDetail(baseMeal);
    return c.json(mealDetail, 201);
  }
);

// Join meal (create join request)
mealsRoute.openapi(
  {
    method: "post",
    path: "/meals/{id}/join",
    summary: "Join a meal",
    description: "Creates a join request for a meal",
    tags: ["Meals"],
    request: {
      params: z.object({
        id: z.string().describe("Meal ID"),
      }),
    },
    responses: {
      201: {
        description: "Join request created",
        content: {
          "application/json": {
            schema: z.object({
              requestId: z.string(),
              message: z.string(),
            }),
          },
        },
      },
      404: {
        description: "Meal not found",
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);
    const { id } = c.req.valid("param");

    const meal = await prisma.meal.findUnique({
      where: { mealId: id },
    });

    if (!meal) {
      return c.json({ error: "Meal not found" }, 404);
    }

    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Check if already requested
    const existingRequest = await prisma.mealRequest.findFirst({
      where: {
        mealId: id,
        userId,
      },
    });

    if (existingRequest) {
      return c.json({ error: "Already requested to join" }, 400);
    }

    const requestId = `request_${uuidv4()}`;
    await prisma.mealRequest.create({
      data: {
        requestId,
        mealId: id,
        userId,
        status: "Pending",
      },
    });

    return c.json(
      {
        requestId,
        message: "Join request created",
      },
      201
    );
  }
);

// Get host meal requests
mealsRoute.openapi(
  {
    method: "get",
    path: "/meals/{id}/requests",
    summary: "Get meal join requests",
    description: "Returns pending join requests for a meal (host only)",
    tags: ["Meals"],
    request: {
      params: z.object({
        id: z.string().describe("Meal ID"),
      }),
    },
    responses: {
      200: {
        description: "Meal requests",
        content: {
          "application/json": {
            schema: z.any(),
          },
        },
      },
      403: {
        description: "Not authorized",
      },
      404: {
        description: "Meal not found",
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);
    const { id } = c.req.valid("param");

    const meal = await prisma.meal.findUnique({
      where: { mealId: id },
      include: {
        host: true,
        joinedUsers: true,
      },
    });

    if (!meal) {
      return c.json({ error: "Meal not found" }, 404);
    }

    // Check if user is the host
    if (meal.host.userId !== userId) {
      return c.json({ error: "Not authorized" }, 403);
    }

    // Get pending requests
    const pendingRequests = await prisma.mealRequest.findMany({
      where: {
        mealId: id,
        status: "Pending",
      },
      include: {
        user: true,
      },
    });

    const pendingRequestsData = pendingRequests.map((r: any) => ({
      userId: r.user.userId,
      name: r.user.name,
      profilePicture: r.user.profilePicture,
      requestId: r.requestId,
    }));

    const baseMeal = prismaMealToBaseMealData(meal, userId);
    const { userRelationship, joinedusers, ...mealWithoutFields } = baseMeal;

    const hostMealRequests: HostMealRequestsData = {
      ...mealWithoutFields,
      formattedTime: formatMealTime(meal.mealtime),
      pendingRequests: pendingRequestsData as MealRequestUser[],
      pendingRequestsCount: pendingRequestsData.length,
    };

    return c.json(hostMealRequests);
  }
);

// Accept join request
mealsRoute.openapi(
  {
    method: "post",
    path: "/meals/{id}/requests/{requestId}/accept",
    summary: "Accept a join request",
    description: "Accepts a pending join request",
    tags: ["Meals"],
    request: {
      params: z.object({
        id: z.string().describe("Meal ID"),
        requestId: z.string().describe("Request ID"),
      }),
    },
    responses: {
      200: {
        description: "Request accepted",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
      404: {
        description: "Request not found",
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);
    const { id, requestId } = c.req.valid("param");

    const meal = await prisma.meal.findUnique({
      where: { mealId: id },
      include: { host: true },
    });

    if (!meal) {
      return c.json({ error: "Meal not found" }, 404);
    }

    if (meal.host.userId !== userId) {
      return c.json({ error: "Not authorized" }, 403);
    }

    const request = await prisma.mealRequest.findFirst({
      where: {
        requestId,
        mealId: id,
      },
      include: {
        user: true,
      },
    });

    if (!request) {
      return c.json({ error: "Request not found" }, 404);
    }

    // Update request status and add user to joined users
    await prisma.$transaction([
      prisma.mealRequest.update({
        where: { id: request.id },
        data: { status: "Accepted" },
      }),
      prisma.mealJoinedUser.create({
        data: {
          mealId: id,
          name: request.user.name,
          profilePicture: request.user.profilePicture,
        },
      }),
    ]);

    return c.json({ message: "Request accepted" });
  }
);

// Decline join request
mealsRoute.openapi(
  {
    method: "post",
    path: "/meals/{id}/requests/{requestId}/decline",
    summary: "Decline a join request",
    description: "Declines a pending join request",
    tags: ["Meals"],
    request: {
      params: z.object({
        id: z.string().describe("Meal ID"),
        requestId: z.string().describe("Request ID"),
      }),
    },
    responses: {
      200: {
        description: "Request declined",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
      404: {
        description: "Request not found",
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);
    const { id, requestId } = c.req.valid("param");

    const meal = await prisma.meal.findUnique({
      where: { mealId: id },
      include: { host: true },
    });

    if (!meal) {
      return c.json({ error: "Meal not found" }, 404);
    }

    if (meal.host.userId !== userId) {
      return c.json({ error: "Not authorized" }, 403);
    }

    const request = await prisma.mealRequest.findFirst({
      where: {
        requestId,
        mealId: id,
      },
    });

    if (!request) {
      return c.json({ error: "Request not found" }, 404);
    }

    await prisma.mealRequest.update({
      where: { id: request.id },
      data: { status: "Rejected" },
    });

    return c.json({ message: "Request declined" });
  }
);

// Get applied meal detail
mealsRoute.openapi(
  {
    method: "get",
    path: "/meals/{id}/applied",
    summary: "Get applied meal detail",
    description: "Returns meal detail for a meal the user applied to join",
    tags: ["Meals"],
    request: {
      params: z.object({
        id: z.string().describe("Meal ID"),
      }),
    },
    responses: {
      200: {
        description: "Applied meal detail",
        content: {
          "application/json": {
            schema: z.any(),
          },
        },
      },
      404: {
        description: "Meal or request not found",
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);
    const { id } = c.req.valid("param");

    const meal = await prisma.meal.findUnique({
      where: { mealId: id },
      include: {
        host: true,
        joinedUsers: true,
        mealRequests: {
          where: { userId },
        },
      },
    });

    if (!meal) {
      return c.json({ error: "Meal not found" }, 404);
    }

    const request = meal.mealRequests[0];
    if (!request) {
      return c.json({ error: "Request not found" }, 404);
    }

    const baseMeal = prismaMealToBaseMealData(meal, userId);
    const mealDetail = transformToMealDetail(baseMeal);
    const appliedMealDetail: AppliedMealDetailData = {
      ...mealDetail,
      requestId: request.requestId,
      requestStatus: request.status as "Pending" | "Accepted" | "Rejected",
      requestSubmittedAt: request.submittedAt,
    };

    return c.json(appliedMealDetail);
  }
);

export default mealsRoute;
