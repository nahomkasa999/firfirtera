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

// ============================================
// HOST MEAL REQUESTS PAGE DATA TYPES
// ============================================
// This page is shown when a host clicks on a meal they created
// Shows meal details and list of users who requested to join
// Host can accept or decline each request

interface MealRequestUser {
    userId: string; // User ID for navigation to profile
    name: string; // User's name (e.g., "Jane D.")
    profilePicture: string; // User's profile picture URL
    requestId: string; // Unique identifier for this request
}

export type hostMealRequestsData = Omit<baseMealData, "userRelationship" | "joinedusers"> & {
    // Meal header information
    formattedTime: string; // Formatted time string (e.g., "Saturday, Nov 18 at 7:00 PM")
    // Pending requests
    pendingRequests: MealRequestUser[]; // List of users who requested to join (pending approval)
    pendingRequestsCount: number; // Total number of pending requests
}

// ============================================
// PROFILE PAGE DATA TYPES
// ============================================
// Profile page shows user's own profile with stats, comments, and bio

interface ProfileComment {
    commenterName: string; // Name of person who left the comment
    commenterAvatarUrl: string; // Profile picture of commenter
    commentTimeAgo: string; // Time ago string (e.g., "2 days ago", "1 week ago")
    rating: number; // Rating from 1 to 5 (stars)
    comment: string; // Comment text
}

interface ProfileStats {
    hosted: number; // Number of meals hosted
    joined: number; // Number of meals joined
    rating: number; // Overall rating (e.g., 4.8)
}

export type profileData = {
    name: string; // User's name
    profilePicture: string; // User's profile picture URL
    aboutme: string; // Bio/about me text
    interests: string[]; // Array of interest tags (e.g., ["Vegan", "Tech", "Travel"])
    occupation: string; // User's occupation (e.g., "Product Designer")
    stats: ProfileStats; // Profile statistics
    comments: ProfileComment[]; // Previous comments and ratings from other users
}

// ============================================
// PARTICIPANT PROFILE VIEW DATA TYPES
// ============================================
// This is shown when viewing someone else's profile (e.g., from a join request)
// Includes Accept/Decline buttons and verified badge

export type participantProfileData = {
    userId: string; // User ID for navigation
    name: string; // User's name(username) 
    age?: number; // User's age -> the user can hide or unhide their age,
    profilePicture: string; // User's profile picture URL
    isVerified: boolean; // Verified badge (earned after 3 meals where 3 people confirmed gender)
    occupation: string; // User's occupation
    aboutme: string; // Bio/about me text
    interests: string[]; // Array of interest tags
    stats: ProfileStats; // Profile statistics
    // Only shown when viewing from a join request context
    showAcceptDecline?: boolean; // Whether to show Accept/Decline buttons
    requestId?: string; // Request ID if viewing from a join request
}

// ============================================
// APPLIED MEAL DETAIL PAGE DATA TYPES
// ============================================
// This page is shown when a user clicks on a meal they applied to join
// Different views based on request status: Pending, Accepted, or Rejected

// Base type for applied meal detail (extends meal detail with request info)
export type appliedMealDetailData = mealDetailData & {
    requestId: string; // Unique identifier for the join request
    requestStatus: "Pending" | "Accepted" | "Rejected"; // Status of the join request which is shown in the place of the button which used to be the "join button" 
    requestSubmittedAt: Date; // When the user submitted the join request
}

export type tellusaboutyourselfData = {
    name: string; // User's name
    gender: "Male" | "Female"; // User's gender
    profilePicture?: string; // User's profile picture URL
    aboutme?: string; // Bio/about me text
    interests?: string[]; // Array of interest tags (e.g., ["Vegan", "Tech", "Travel"])
    occupation: string; // User's occupation (e.g., "Product Designer")
}

// ============================================
// MESSAGES PAGE DATA TYPES
// ============================================
// Messages page shows list of meal chats (Current Event and Past Events)
// Each chat is associated with a meal

export interface ChatMessage {
    messageId: string; // Unique identifier for the message
    senderId: string; // User ID of the sender
    senderName: string; // Name of the sender
    senderProfilePicture: string; // Profile picture of the sender
    content: string; // Message content
    timestamp: Date; // When the message was sent
    isCurrentUser: boolean; // Whether this message is from the current user
}

export interface MealChat {
    mealId: string; // Meal ID this chat belongs to
    mealName: string; // Name of the meal (e.g., "Firfir Dinner", "Sushi Night")
    mealPicture?: string; // Meal picture or group picture
    participants: Array<{
        userId: string;
        name: string;
        profilePicture: string;
    }>; // List of participants in the chat
    lastMessage: {
        senderName: string; // Name of the last message sender
        content: string; // Last message content
        timestamp: Date; // When the last message was sent
    };
    formattedLastMessageTime: string; // Formatted time (e.g., "4:34 PM", "Yesterday", "May 5")
    isActive: boolean; // true for current event, false for past event
    unreadCount?: number; // Number of unread messages (optional)
}

export type messagesListData = {
    currentEvent: MealChat[]; // Active meal chats
    pastEvents: MealChat[]; // Past meal chats
}

export type chatDetailData = {
    mealId: string; // Meal ID
    mealName: string; // Name of the meal
    participants: Array<{
        userId: string;
        name: string;
        profilePicture: string;
    }>; // List of participants
    messages: ChatMessage[]; // All messages in the chat
}