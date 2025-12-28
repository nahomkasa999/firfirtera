// Meal transformation and filtering utilities

import type {
  BaseMealData,
  MealDetailData,
  DashboardMealCard,
  HostDetail,
} from "@repo/shared/types";
import { formatMealTime, formatMealDate } from "../utils/date.js";

/**
 * Transform baseMealData to mealDetailData
 * Calculates payment details, formats dates, and enriches host information
 */
export function transformToMealDetail(meal: BaseMealData): MealDetailData {
  const perPerson =
    meal.mealPrice === "Free"
      ? "Free"
      : Math.round(
          (typeof meal.mealPrice === "number" ? meal.mealPrice : 0) /
            meal.expectedusers
        );

  const totalAmount =
    meal.mealPrice === "Free"
      ? undefined
      : typeof meal.mealPrice === "number"
        ? meal.mealPrice
        : 0;

  return {
    ...meal,
    paymentDetails: {
      perPerson,
      totalAmount,
      description:
        meal.mealtype === "Treat"
          ? "This meal is free - the host is treating everyone!"
          : "Order food together, split the bill equally",
    },
    formattedTime: formatMealTime(meal.mealtime),
    formattedDate: formatMealDate(meal.mealtime),
    MealHost: {
      ...meal.MealHost,
      rating: 4.5, // Default rating - in real app, fetch from user profile
      badge: "New Host" as const, // Default badge - in real app, calculate based on history
      memberSince: meal.createdAt, // Default to meal creation date
    } as HostDetail,
  };
}

/**
 * Filter meals that are available for joining
 * (Future meals where user can join)
 */
export function filterAvailableMeals(meals: BaseMealData[]): BaseMealData[] {
  const now = new Date();
  return meals.filter((meal) => {
    // Only show future meals (commented out for dev)
    // if (meal.mealtime < now) return false;
    // Only show meals user can join
    if (meal.userRelationship !== "can_join") return false;
    return true;
  });
}

/**
 * Filter meals that are almost filled (only 1 spot left)
 */
export function filterAlmostFilledMeals<T extends BaseMealData>(
  meals: T[]
): T[] {
  return meals.filter(
    (meal) => meal.expectedusers - meal.joinedusers.length === 1
  );
}

/**
 * Filter upcoming meals (user is hosting or attending)
 */
export function filterUpcomingMeals(meals: BaseMealData[]): BaseMealData[] {
  const now = new Date();
  return meals.filter((meal) => {
    // Only future meals
    if (meal.mealtime < now) return false;
    // User is hosting or attending
    return meal.userRelationship === "host" || meal.userRelationship === "joined";
  });
}

/**
 * Filter pending meals (user has requested to join)
 */
export function filterPendingMeals(meals: BaseMealData[]): BaseMealData[] {
  const now = new Date();
  return meals.filter((meal) => {
    // Only future meals
    if (meal.mealtime < now) return false;
    // User has pending request
    return meal.userRelationship === "pending";
  });
}

/**
 * Filter past meals
 */
export function filterPastMeals(meals: BaseMealData[]): BaseMealData[] {
  const now = new Date();
  return meals.filter((meal) => meal.mealtime < now);
}

/**
 * Sort meals by distance (closest first)
 */
export function sortByDistance<T extends { distance?: number }>(
  meals: T[]
): T[] {
  return meals.sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Sort meals by creation date (most recent first)
 */
export function sortByRecent(meals: BaseMealData[]): BaseMealData[] {
  return meals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Calculate recommendation score for a meal
 */
export function calculateRecommendationScore(
  meal: BaseMealData & { distance?: number },
  userInterests: string[] = []
): number {
  let score = 0;

  // Check if meal matches user interests
  const mealNameLower = meal.mealname?.toLowerCase() || "";
  const mealDescLower = meal.mealdescription?.toLowerCase() || "";

  userInterests.forEach((interest) => {
    const interestLower = interest.toLowerCase();
    if (
      mealNameLower.includes(interestLower) ||
      mealDescLower.includes(interestLower)
    ) {
      score += 10; // High score for matching interests
    }
  });

  // Bonus for meals with pictures (quality indicator)
  if (meal.mealpicture) {
    score += 10;
  }

  // Penalty for distance (closer is better)
  score -= meal.distance || 0;

  return score;
}

/**
 * Filter and sort meals for recommendations
 */
export function getRecommendedMeals(
  meals: (BaseMealData & { distance?: number })[]
): DashboardMealCard[] {
  return meals
    .filter((meal) => {
      // Simple recommendation: prefer Ethiopian cuisine or meals with pictures
      const isEthiopian =
        meal.mealname?.toLowerCase().includes("ethiopian") ||
        meal.mealdescription?.toLowerCase().includes("ethiopian");
      return isEthiopian || meal.mealpicture;
    })
    .sort((a, b) => {
      // Use recommendation score for sorting
      const aScore = calculateRecommendationScore(a);
      const bScore = calculateRecommendationScore(b);
      return bScore - aScore;
    })
    .slice(0, 10) as DashboardMealCard[];
}

/**
 * Determine meal status (Completed or Cancelled) for past meals
 */
export function getMealStatus(meal: BaseMealData): "Completed" | "Cancelled" {
  return meal.mealdescription?.toLowerCase().includes("cancelled")
    ? "Cancelled"
    : "Completed";
}

