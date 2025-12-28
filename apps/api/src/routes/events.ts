import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import type {
  UpcomingEventsData,
  PendingEventsData,
  PastEventsData,
} from "@repo/shared/types";
import { prisma } from "../db/client.js";
import {
  filterUpcomingMeals,
  filterPendingMeals,
  filterPastMeals,
  getMealStatus,
} from "../lib/mealHelpers.js";
import { formatMealTimeShort, formatMealDateShort } from "../utils/date.js";
import { requireAuth } from "../lib/auth.js";
import { prismaMealToBaseMealData } from "../db/helpers.js";

const eventsRoute = new OpenAPIHono();

// Get upcoming events
eventsRoute.openapi(
  {
    method: "get",
    path: "/events/upcoming",
    summary: "Get upcoming events",
    description: "Returns meals the user is hosting or attending",
    tags: ["Events"],
    responses: {
      200: {
        description: "Upcoming events",
        content: {
          "application/json": {
            schema: z.object({
              hosting: z.array(z.any()),
              attending: z.array(z.any()),
            }),
          },
        },
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);

    // Get meals where user is host or has joined
    const userMeals = await prisma.meal.findMany({
      where: {
        OR: [
          { host: { userId } },
          { joinedUsers: { some: { name: { contains: userId } } } },
        ],
      },
      include: {
        host: true,
        joinedUsers: true,
        mealRequests: {
          where: {
            status: "Pending",
          },
        },
      },
    });

    const meals = userMeals.map((meal: any) =>
      prismaMealToBaseMealData(meal, userId)
    );
    const upcomingMeals = filterUpcomingMeals(meals).map((meal: any) => {
      const isHosting = meal.MealHost.userId === userId;
      const { userRelationship, ...mealWithoutRelationship } = meal;

      // Count pending requests for hosting meals
      const mealData = userMeals.find((m: any) => m.mealId === meal.mealId);
      const pendingRequestsCount = isHosting
        ? mealData?.mealRequests.length || 0
        : undefined;

      return {
        ...mealWithoutRelationship,
        isHosting,
        formattedTime: formatMealTimeShort(meal.mealtime),
        ...(pendingRequestsCount !== undefined && { pendingRequestsCount }),
      };
    });

    const hosting = upcomingMeals.filter((meal) => meal.isHosting);
    const attending = upcomingMeals.filter((meal) => !meal.isHosting);

    const upcomingEvents: UpcomingEventsData = {
      hosting,
      attending,
    };

    return c.json(upcomingEvents);
  }
);

// Get pending events
eventsRoute.openapi(
  {
    method: "get",
    path: "/events/pending",
    summary: "Get pending events",
    description: "Returns meals where user has requested to join",
    tags: ["Events"],
    responses: {
      200: {
        description: "Pending events",
        content: {
          "application/json": {
            schema: z.any(),
          },
        },
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);

    // Get meal requests for user
    const requests = await prisma.mealRequest.findMany({
      where: {
        userId,
        status: "Pending",
      },
      include: {
        meal: {
          include: {
            host: true,
            joinedUsers: true,
          },
        },
      },
    });

    const pendingMeals = requests.map((request: any) => {
      const meal = prismaMealToBaseMealData(request.meal, userId);
      const { userRelationship, ...mealWithoutRelationship } = meal;

      return {
        ...mealWithoutRelationship,
        requestStatus: request.status as "Pending" | "Accepted" | "Rejected",
        formattedTime: formatMealTimeShort(meal.mealtime),
      };
    });

    const pendingEvents: PendingEventsData = {
      events: pendingMeals,
    };

    return c.json(pendingEvents);
  }
);

// Get past events
eventsRoute.openapi(
  {
    method: "get",
    path: "/events/past",
    summary: "Get past events",
    description: "Returns past meals the user attended or hosted",
    tags: ["Events"],
    responses: {
      200: {
        description: "Past events",
        content: {
          "application/json": {
            schema: z.any(),
          },
        },
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);

    // Get meals where user was involved
    const userMeals = await prisma.meal.findMany({
      where: {
        OR: [
          { host: { userId } },
          { joinedUsers: { some: { name: { contains: userId } } } },
        ],
      },
      include: {
        host: true,
        joinedUsers: true,
      },
    });

    const meals = userMeals.map((meal: any) =>
      prismaMealToBaseMealData(meal, userId)
    );
    const pastMeals = filterPastMeals(meals).map((meal: any) => {
      const isHosting = meal.MealHost.userId === userId;
      const { userRelationship, ...mealWithoutRelationship } = meal;

      return {
        ...mealWithoutRelationship,
        mealStatus: getMealStatus(meal),
        formattedDate: formatMealDateShort(meal.mealtime),
        isHosting,
      };
    });

    const pastEvents: PastEventsData = {
      events: pastMeals,
    };

    return c.json(pastEvents);
  }
);

export default eventsRoute;
