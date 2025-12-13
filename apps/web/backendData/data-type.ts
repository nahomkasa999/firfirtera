// Shared interfaces
interface joinedusers {
    name: string;
    profilePicture: string;
}

interface Host {
    name: string;
    profilePicture: string;
    userId: string; // For navigation to profile
}

// Base meal data structure
export type baseMealData = {
    mealId: string; // Unique identifier
    mealtype: "Split" | "Treat" | "Companion"; // Treat = Free (someone pays), Companion = contribution-based
    mealname?: string; // Optional for Companion type
    mealPrice: number | "Free"; // For Treat = "Free", for Split/Companion = number
    meallocation: string; // Full address string (for display to users)
    latitude: number; // Geocoded latitude from address (stored when meal is created using Google Geocoding API)
    longitude: number; // Geocoded longitude from address (stored when meal is created using Google Geocoding API)
    distance?: number; // Calculated distance in miles/km (calculated on-the-fly on backend based on user's current location)
    mealtime: Date;
    mealdescription?: string;
    mealpicture?: string; // Image URL (if provided)
    mealvideo?: string; // Video URL or link (TikTok, YouTube, etc.) (if provided)
    joinedusers: joinedusers[];
    expectedusers: number;
    MealHost: Host; // Host object with name, profile picture, and userId
    createdAt: Date;
    updatedAt: Date;
    // User's relationship to this meal (determines if button shows "Join" or "Chat")
    userRelationship: "can_join" | "joined" | "pending" | "host";
}

// ============================================
// DASHBOARD/DISCOVERY PAGE DATA TYPES
// ============================================
// This is the main discovery page with sections: Recommended, Recent, Near You, Almost Filled
// Similar to Play Store's "Recommended for you" structure

// Dashboard/Discovery Page Data
export type dashboardMealCard = baseMealData;

export type dashboardData = {
    recommendedForYou: dashboardMealCard[]; // Personalized recommendations based on user preferences/history
    recent: dashboardMealCard[]; // Recently created meals
    nearYou: dashboardMealCard[]; // Meals near user's current location (sorted by distance)
    almostFilled: dashboardMealCard[]; // Meals with only 1 person left (prioritized, especially near user location)
}

// ============================================
// MEAL DETAIL PAGE DATA TYPES
// ============================================
// This is the detailed view when a user clicks on a meal card from the dashboard
// Shows full meal information, payment details, host info, and Join/Chat button

interface HostDetail extends Host {
    rating?: number; // Host rating (e.g., 4.8)
    badge?: "New Host" | "Verified Host" | "Top Host"; // Host badge/status
    memberSince?: Date; // When host joined the platform
}

export type mealDetailData = baseMealData & {
    // Payment breakdown (calculated fields)
    paymentDetails: {
        perPerson: number | "Free"; // Amount each person pays (or "Free" for Treat meals)
        totalAmount?: number; // Total amount (perPerson × expectedusers) - only for Split/Companion
        description: string; // Payment description (e.g., "Order food together, split the bill")
    };
    // Formatted display strings
    formattedTime: string; // Formatted time string (e.g., "nege, mata 1:00LT" or "Saturday, Nov 18 at 7:00 PM")
    formattedDate: string; // Formatted date string for display
    // Enhanced host information
    MealHost: HostDetail; // Extended host info with rating and badge
}

// ============================================
// CREATE MEAL PAGE DATA TYPES
// ============================================
// This is the data structure for creating a new meal event
// User submits this data, backend processes it and creates the meal

// Split meal: User enters total meal price, backend calculates per-person cost
// Companion meal: User enters contribution amount per person, no meal name

export type createMealData = {
    mealtype: "Split" | "Companion"; // User selects mode
    // Split-specific fields
    mealname?: string; // Food name (required for Split, not used for Companion)
    totalMealPrice?: number; // Total cost of meal (required for Split, backend calculates: totalMealPrice / (expectedusers + 1) = per person)
    // Companion-specific fields
    contributionAmount?: number; // Amount each person contributes (required for Companion, e.g., 200 birr per person)
    // Common fields
    meallocation: string; // Full address string (backend will geocode to get latitude/longitude)
    mealtime: Date; // Date and time of the meal
    expectedusers: number; // Number of people (for Split: invited people, for Companion: people looking)
    mealgenderpreference: "Anonymous" | "Specific"; // Gender preference
    numberofmales?: number; // Required if mealgenderpreference is "Specific" (females = expectedusers - numberofmales)
    mealdescription?: string; // Optional description
    mealpicture?: string; // Optional image URL (for Split: meal image, for Companion: location reference)
    mealvideo?: string; // Optional video URL or link (for Split: meal video, for Companion: location reference)
}

// ============================================
// MY EVENTS PAGE - UPCOMING EVENTS DATA TYPES
// ============================================
// This page shows upcoming meals the user is hosting or attending
// Two separate sections: Hosting and Attending

export type upcomingEventCard = Omit<baseMealData, "userRelationship"> & {
    isHosting: boolean; // true if user is hosting, false if attending
    formattedTime: string; // Formatted time string (e.g., "Today, 7:00 PM" or "Tue, Oct 24 • 6:30 PM")
    // For hosting meals only
    pendingRequestsCount?: number; // Number of people who applied to join (only for hosting meals)
}

export type upcomingEventsData = {
    hosting: upcomingEventCard[]; // Meals the user is hosting (shown first)
    attending: upcomingEventCard[]; // Meals the user is attending (shown second)
}

// ============================================
// MY EVENTS PAGE - PENDING EVENTS DATA TYPES
// ============================================
// This page shows meals where the user has requested to join
// Status can be: Pending (waiting for host), Accepted (host approved), or Rejected (host declined)
// When Accepted, the meal moves to Upcoming Events

export type pendingEventCard = Omit<baseMealData, "userRelationship"> & {
    requestStatus: "Pending" | "Accepted" | "Rejected"; // Status of the join request
    formattedTime?: string; // Optional formatted time string for display
}

export type pendingEventsData = {
    events: pendingEventCard[]; // List of meals with pending join requests
}

// ============================================
// MY EVENTS PAGE - PAST EVENTS DATA TYPES
// ============================================
// This page shows past meals the user attended or hosted (for history)
// Status can be: Completed (meal happened) or Cancelled (meal was cancelled)
// Past events are for history only, cannot be recreated

export type pastEventCard = Omit<baseMealData, "userRelationship"> & {
    mealStatus: "Completed" | "Cancelled"; // Status of the past meal
    formattedDate: string; // Formatted date string (e.g., "Oct 28, 2023")
    isHosting: boolean; // true if user was hosting, false if attending
}

export type pastEventsData = {
    events: pastEventCard[]; // List of past meals (history)
}

