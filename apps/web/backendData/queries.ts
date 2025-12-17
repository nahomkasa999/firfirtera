import type { 
    baseMealData, 
    mealDetailData, 
    dashboardData,
    dashboardMealCard,
    upcomingEventsData,
    upcomingEventCard,
    pendingEventsData,
    pendingEventCard,
    pastEventsData,
    pastEventCard,
    hostMealRequestsData,
    appliedMealDetailData
} from "./data-type";
import { allMeals } from "./data";
import {
    addDistanceToMeal,
    transformToMealDetail,
    filterAvailableMeals,
    filterAlmostFilledMeals,
    filterUpcomingMeals,
    filterPendingMeals,
    filterPastMeals,
    sortByDistance,
    sortByRecent,
    getRecommendedMeals,
    formatMealTimeShort,
    formatMealDateShort,
    formatMealTime,
    getMealStatus,
} from "@/lib/AppHelpers";

// ============================================
// QUERY FUNCTIONS
// ============================================

/**
 * Get meal by ID
 * Returns mealDetailData format for the detail page
 */
export function getMealById(mealId: string): mealDetailData | null {
    const meal = allMeals.find((m) => m.mealId === mealId);
    if (!meal) return null;
    return transformToMealDetail(meal);
}

/**
 * Get dashboard data
 * Filters and transforms meals for the home/dashboard page
 */
export function getDashboardData(): dashboardData {
    // Filter and add distance to available meals
    const availableMeals = filterAvailableMeals(allMeals).map(addDistanceToMeal);
    // Near You: Sort by distance, limit to closest 10
    const nearYou: dashboardMealCard[] = sortByDistance(availableMeals).slice(0, 10);

    // Almost Filled: Meals with only 1 spot left, prioritize by distance
    const almostFilled: dashboardMealCard[] = sortByDistance(
        filterAlmostFilledMeals(availableMeals)
    ).slice(0, 10);

    // All: Sort by creation date (most recent first), always show up to 10 meals
    // This should never be empty - it shows all available meals up to 10
    const recent: dashboardMealCard[] = sortByRecent(availableMeals).slice(0, 10);

    // Recommended For You: Based on user interests and previous meals
    const recommendedForYou: dashboardMealCard[] = getRecommendedMeals(availableMeals);

    return {
        recommendedForYou,
        recent,
        nearYou,
        almostFilled,
    };
}

/**
 * Get upcoming events
 * Meals the user is hosting or attending
 */
export function getUpcomingEvents(): upcomingEventsData {
    const upcomingMeals = filterUpcomingMeals(allMeals).map((meal) => {
        const isHosting = meal.userRelationship === "host";
        const { userRelationship, ...mealWithoutRelationship } = meal;

        return {
            ...mealWithoutRelationship,
            isHosting,
            formattedTime: formatMealTimeShort(meal.mealtime),
            // For hosting meals, add pending requests count (mock data)
            ...(isHosting && { pendingRequestsCount: 2 }),
        } as upcomingEventCard;
    });

    const hosting = upcomingMeals.filter((meal) => meal.isHosting);
    const attending = upcomingMeals.filter((meal) => !meal.isHosting);

    return {
        hosting,
        attending,
    };
}

/**
 * Get pending events
 * Meals where user has requested to join (waiting for approval)
 */
export function getPendingEvents(): pendingEventsData {
    const pendingMeals = filterPendingMeals(allMeals).map((meal) => {
        const { userRelationship, ...mealWithoutRelationship } = meal;

        return {
            ...mealWithoutRelationship,
            requestStatus: "Pending" as const,
            formattedTime: formatMealTimeShort(meal.mealtime),
        } as pendingEventCard;
    });

    return {
        events: pendingMeals,
    };
}

/**
 * Get past events
 * Meals that have already happened (completed or cancelled)
 */
export function getPastEvents(): pastEventsData {
    const pastMeals = filterPastMeals(allMeals).map((meal) => {
        const isHosting = meal.userRelationship === "host";
        const { userRelationship, ...mealWithoutRelationship } = meal;

        return {
            ...mealWithoutRelationship,
            mealStatus: getMealStatus(meal),
            formattedDate: formatMealDateShort(meal.mealtime),
            isHosting,
        } as pastEventCard;
    });

    return {
        events: pastMeals,
    };
}

/**
 * Get host meal requests
 * For a specific meal the user is hosting, get pending join requests
 */
export function getHostMealRequests(mealId: string): hostMealRequestsData | null {
    const meal = allMeals.find(
        (m) => m.mealId === mealId && m.userRelationship === "host"
    );
    
    if (!meal) return null;

    // Mock pending requests - in real app, fetch from join requests table
    const pendingRequests = [
        {
            userId: "user_jane_014",
            name: "Jane D.",
            profilePicture: "https://robohash.org/jane.jpg",
            requestId: "request_001",
        },
        {
            userId: "user_robert_015",
            name: "Robert K.",
            profilePicture: "https://robohash.org/robert.jpg",
            requestId: "request_002",
        },
    ];

    const { userRelationship, joinedusers, ...mealWithoutRelationship } = meal;

    return {
        ...mealWithoutRelationship,
        formattedTime: formatMealTime(meal.mealtime),
        pendingRequests,
        pendingRequestsCount: pendingRequests.length,
    };
}

/**
 * Get applied meal detail
 * When user clicks on a meal they applied to join
 */
export function getAppliedMealDetail(mealId: string): appliedMealDetailData | null {
    const meal = allMeals.find(
        (m) => m.mealId === mealId && m.userRelationship === "pending"
    );
    
    if (!meal) return null;

    const mealDetail = transformToMealDetail(meal);

    return {
        ...mealDetail,
        requestId: `request_${mealId}`,
        requestStatus: "Pending" as const,
        requestSubmittedAt: meal.updatedAt, // Use updatedAt as request submission time
    };
}
