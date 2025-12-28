import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import type { DashboardData } from "@repo/shared/types";
import { prisma } from "../db/client.js";
import {
  filterAvailableMeals,
  filterAlmostFilledMeals,
  sortByDistance,
  sortByRecent,
  getRecommendedMeals,
} from "../lib/mealHelpers.js";
import { addDistanceToMeal } from "../utils/distance.js";
import { getUserIdFromRequest } from "../lib/auth.js";
import { prismaMealToBaseMealData } from "../db/helpers.js";

const dashboardRoute = new OpenAPIHono();

// Get user's current location from their profile
async function getUserLocation(userId: string): Promise<{ lat: number; lon: number }> {
  const user = await prisma.user.findUnique({
    where: { userId },
  });
  if (user) {
    return {
      lat: user.currentLat,
      lon: user.currentLon,
    };
  }
  // Default location (Addis Ababa)
  return { lat: 9.1450, lon: 38.7617 };
}

dashboardRoute.openapi(
  {
    method: "get",
    path: "/dashboard",
    summary: "Get dashboard data",
    description: "Returns recommended, recent, near you, and almost filled meals",
    tags: ["Dashboard"],
    responses: {
      200: {
        description: "Dashboard data",
        content: {
          "application/json": {
            schema: z.object({
              recommendedForYou: z.array(z.any()),
              recent: z.array(z.any()),
              nearYou: z.array(z.any()),
              almostFilled: z.array(z.any()),
            }),
          },
        },
      },
    },
  },
  async (c) => {
    const userId = getUserIdFromRequest(c);
    const userLocation = await getUserLocation(userId || "user_123456789");

    // Fetch all meals with relations
    const mealsData = await prisma.meal.findMany({
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

    // Convert to BaseMealData
    const meals = mealsData.map((meal: any) =>
      prismaMealToBaseMealData(meal, userId)
    );

    // Filter and add distance to available meals
    const availableMeals = filterAvailableMeals(meals).map((meal) =>
      addDistanceToMeal(meal, userLocation.lat, userLocation.lon)
    );

    // Near You: Sort by distance, limit to closest 10
    const nearYou = sortByDistance(availableMeals).slice(0, 10);

    // Almost Filled: Meals with only 1 spot left, prioritize by distance
    const almostFilled = sortByDistance(
      filterAlmostFilledMeals(availableMeals)
    ).slice(0, 10);

    // Recent: Sort by creation date (most recent first), limit to 10
    const recent = sortByRecent(availableMeals).slice(0, 10);

    // Recommended For You: Based on user interests and previous meals
    const user = userId
      ? await prisma.user.findUnique({
          where: { userId },
        })
      : null;
    const userInterests = user ? JSON.parse(user.interests || "[]") : [];
    const recommendedForYou = getRecommendedMeals(availableMeals);

    const dashboardData: DashboardData = {
      recommendedForYou,
      recent,
      nearYou,
      almostFilled,
    };

    return c.json(dashboardData);
  }
);

export default dashboardRoute;

