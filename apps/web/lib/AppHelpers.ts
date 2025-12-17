import type { baseMealData, mealDetailData, dashboardMealCard } from "@/backendData/data-type";
import { allMeals, currentUser } from "@/backendData/data";

// ============================================
// DISTANCE CALCULATION UTILITIES
// ============================================

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Calculate distance for a meal from user's current location
 */
export function addDistanceToMeal(meal: baseMealData): baseMealData & { distance: number } {
    const distance = calculateDistance(
        currentUser.currentLocation.latitude,
        currentUser.currentLocation.longitude,
        meal.latitude,
        meal.longitude
    );
    return { ...meal, distance: Math.round(distance * 10) / 10 }; // Round to 1 decimal
}

// ============================================
// DATA TRANSFORMATION UTILITIES
// ============================================

/**
 * Transform baseMealData to mealDetailData
 * Calculates payment details, formats dates, and enriches host information
 */
export function transformToMealDetail(meal: baseMealData): mealDetailData {
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
        },
    };
}

// ============================================
// DATE FORMATTING UTILITIES
// ============================================

/**
 * Format meal time for display
 */
export function formatMealTime(date: Date): string {
    return date.toLocaleString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

/**
 * Format meal date for display
 */
export function formatMealDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

/**
 * Format meal time in short format (for event cards)
 */
export function formatMealTimeShort(date: Date): string {
    return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

/**
 * Format meal date in short format (for past events)
 */
export function formatMealDateShort(date: Date): string {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// ============================================
// FILTERING BUSINESS LOGIC
// ============================================

/**
 * Filter meals that are available for joining
 * (Future meals where user can join)
 */
export function filterAvailableMeals(meals: baseMealData[]): baseMealData[] {
    const now = new Date();
    return meals.filter((meal) => {
        // Only show future meals
        // if (meal.mealtime < now) return false; this should be on in development mode only
        // Only show meals user can join
        if (meal.userRelationship !== "can_join") return false;
        return true;
    });
}
/**
 * Filter meals that are almost filled (only 1 spot left)
 */
export function filterAlmostFilledMeals(meals: (baseMealData & { distance?: number })[]): (baseMealData & { distance?: number })[] {
    return meals.filter(
        (meal) => meal.expectedusers - meal.joinedusers.length === 1
    );
}

/**
 * Filter upcoming meals (user is hosting or attending)
 */
export function filterUpcomingMeals(meals: baseMealData[]): baseMealData[] {
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
export function filterPendingMeals(meals: baseMealData[]): baseMealData[] {
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
export function filterPastMeals(meals: baseMealData[]): baseMealData[] {
    const now = new Date();
    return meals.filter((meal) => meal.mealtime < now);
}

// ============================================
// SORTING BUSINESS LOGIC
// ============================================

/**
 * Sort meals by distance (closest first)
 */
export function sortByDistance(
    meals: (baseMealData & { distance?: number })[]
): (baseMealData & { distance?: number })[] {
    return meals.sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Sort meals by creation date (most recent first)
 */
export function sortByRecent(meals: baseMealData[]): baseMealData[] {
    return meals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// ============================================
// RECOMMENDATION ALGORITHM
// ============================================

/**
 * Calculate recommendation score for a meal
 * Based on user interests, meal quality indicators, and distance
 */
export function calculateRecommendationScore(
    meal: baseMealData & { distance?: number },
    userInterests: string[] = currentUser.interests
): number {
    let score = 0;

    // Check if meal matches user interests
    const mealNameLower = meal.mealname?.toLowerCase() || "";
    const mealDescLower = meal.mealdescription?.toLowerCase() || "";
    
    userInterests.forEach((interest) => {
        const interestLower = interest.toLowerCase();
        if (mealNameLower.includes(interestLower) || mealDescLower.includes(interestLower)) {
            score += 10; // High score for matching interests
        }
    });

    // Bonus for meals with pictures (quality indicator)
    if (meal.mealpicture) {
        score += 10;
    }

    // Penalty for distance (closer is better)
    // Subtract distance to prioritize closer meals
    score -= meal.distance || 0;

    return score;
}

/**
 * Filter and sort meals for recommendations
 */
export function getRecommendedMeals(
    meals: (baseMealData & { distance?: number })[]
): dashboardMealCard[] {
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
        .slice(0, 10) as dashboardMealCard[];
}

// ============================================
// MEAL STATUS UTILITIES
// ============================================

/**
 * Determine meal status (Completed or Cancelled) for past meals
 */
export function getMealStatus(meal: baseMealData): "Completed" | "Cancelled" {
    return meal.mealdescription?.toLowerCase().includes("cancelled")
        ? "Cancelled"
        : "Completed";
}

