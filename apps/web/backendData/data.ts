// Mock data for current user
// This represents what a logged-in user object looks like

export const currentUser = {
    userId: "user_123456789",
    name: "Kenji",
    username: "kenji_foodie",
    phoneNumber: "555-123-4567",
    countryCode: "+1",
    email: "kenji@example.com", // From Google auth if used
    age: 28,
    showAge: true, // User preference to show/hide age
    gender: "Male" as const,
    profilePicture: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxaqLnyzddMGAraaRlcIXBAxs9PFkhCe7JRVh5_plC44Nay2nDbOwxsOtpBU1PemJfWShZQYOJoUY-PFLj0Dnq5Wl1X-JqoLrNIf6sXDAJWwbcecDO5FUzkBoUhhK_yDE0HbLJ5lGhD3KNar6kdCIBzFJSOMcLRm9HaHzPUEkE5tZy3zQAslDYExTRUVnPJOvDB2a3nQ7Ev8K18gT43wzeoLe6oWRKPb1CP4ExrPlXYpDoxE7AAEfnYX45FBApBuxC2CD2nEpNZw",
    occupation: "Software Engineer",
    work: "Google",
    aboutme: "Lover of food, culture, and good company. Let's share a meal!",
    interests: ["Ethiopian Cuisine", "Tech", "Travel", "Photography", "Hiking"],
    isVerified: true, // Verified badge status    // Current location (for distance calculations)
    currentLocation: {
        latitude: 9.1450, // Example: Addis Ababa coordinates
        longitude: 38.7617,
        address: "Addis Ababa, Ethiopia"
    },
    // Profile statistics
    stats: {
        hosted: 12,
        joined: 28,
        rating: 4.8
    },
    // Authentication info
    authMethod: "google" as "phone" | "google" | "telegram", // How they signed up
    isProfileComplete: true, // Whether they completed Step 2
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-01-20")
}

//-------------------------------------

import type {
    dashboardData,
    mealDetailData,
    upcomingEventsData,
    pendingEventsData,
    pastEventsData,
    hostMealRequestsData,
    profileData,
    participantProfileData,
    appliedMealDetailData
} from './data-type';

// ============================================
// DASHBOARD PAGE MOCK DATA
// ============================================
export const dashboardMockData: dashboardData = {
    recommendedForYou: [
        {
            mealId: "meal_001",
            mealtype: "Split",
            mealname: "Ethiopian Platter",
            mealPrice: 450,
            meallocation: "Lucy Restaurant, Bole Road, Addis Ababa",
            latitude: 9.0120,
            longitude: 38.7617,
            distance: 2.3,
            mealtime: new Date("2024-01-25T19:00:00"),
            mealdescription: "Traditional Ethiopian food - let's share a large platter!",
            mealpicture: "https://robohash.org/ethiopian-platter.jpg",
            joinedusers: [
                { name: "Sarah M.", profilePicture: "https://robohash.org/sarah.jpg" },
                { name: "Mike T.", profilePicture: "https://robohash.org/mike.jpg" }
            ],
            expectedusers: 3,
            MealHost: {
                name: "Alem T.",
                profilePicture: "https://robohash.org/alem.jpg",
                userId: "user_alem_001"
            },
            createdAt: new Date("2024-01-20T10:00:00"),
            updatedAt: new Date("2024-01-20T10:00:00"),
            userRelationship: "can_join"
        },
        {
            mealId: "meal_002",
            mealtype: "Treat",
            mealPrice: "Free",
            meallocation: "Kaldi's Coffee, Meskel Square, Addis Ababa",
            latitude: 9.0200,
            longitude: 38.7500,
            distance: 1.8,
            mealtime: new Date("2024-01-24T14:00:00"),
            mealdescription: "Coffee and pastries on me! Let's chat about tech and travel.",
            joinedusers: [
                { name: "David K.", profilePicture: "https://robohash.org/david.jpg" }
            ],
            expectedusers: 2,
            MealHost: {
                name: "Elena R.",
                profilePicture: "https://robohash.org/elena.jpg",
                userId: "user_elena_002"
            },
            createdAt: new Date("2024-01-22T08:30:00"),
            updatedAt: new Date("2024-01-22T08:30:00"),
            userRelationship: "can_join"
        }
    ],
    recent: [
        {
            mealId: "meal_003",
            mealtype: "Companion",
            mealPrice: 200,
            meallocation: "Habesha Restaurant, Piazza, Addis Ababa",
            latitude: 9.0300,
            longitude: 38.7400,
            distance: 3.5,
            mealtime: new Date("2024-01-26T18:30:00"),
            mealdescription: "Let's explore local cuisine together! 200 birr per person.",
            mealvideo: "https://tiktok.com/@foodie/video123",
            joinedusers: [],
            expectedusers: 3,
            MealHost: {
                name: "Yonas B.",
                profilePicture: "https://robohash.org/yonas.jpg",
                userId: "user_yonas_003"
            },
            createdAt: new Date("2024-01-23T15:20:00"),
            updatedAt: new Date("2024-01-23T15:20:00"),
            userRelationship: "can_join"
        },
        {
            mealId: "meal_004",
            mealtype: "Split",
            mealname: "Pizza Night",
            mealPrice: 600,
            meallocation: "Pizza Hut, Bole, Addis Ababa",
            latitude: 9.0150,
            longitude: 38.7700,
            distance: 2.1,
            mealtime: new Date("2024-01-27T20:00:00"),
            mealdescription: "Large pizza to share - let's split the bill!",
            mealpicture: "https://robohash.org/pizza.jpg",
            joinedusers: [
                { name: "Lisa P.", profilePicture: "https://robohash.org/lisa.jpg" }
            ],
            expectedusers: 2,
            MealHost: {
                name: "Tom H.",
                profilePicture: "https://robohash.org/tom.jpg",
                userId: "user_tom_004"
            },
            createdAt: new Date("2024-01-23T12:00:00"),
            updatedAt: new Date("2024-01-23T12:00:00"),
            userRelationship: "can_join"
        }
    ],
    nearYou: [
        {
            mealId: "meal_005",
            mealtype: "Split",
            mealname: "Breakfast at Kaldi's",
            mealPrice: 350,
            meallocation: "Kaldi's Coffee, Bole Road, Addis Ababa",
            latitude: 9.0130,
            longitude: 38.7620,
            distance: 0.5,
            mealtime: new Date("2024-01-24T08:00:00"),
            mealdescription: "Early morning breakfast - close to your location!",
            joinedusers: [
                { name: "Anna L.", profilePicture: "https://robohash.org/anna.jpg" }
            ],
            expectedusers: 2,
            MealHost: {
                name: "John D.",
                profilePicture: "https://robohash.org/john.jpg",
                userId: "user_john_005"
            },
            createdAt: new Date("2024-01-23T20:00:00"),
            updatedAt: new Date("2024-01-23T20:00:00"),
            userRelationship: "can_join"
        },
        {
            mealId: "meal_006",
            mealtype: "Companion",
            mealPrice: 250,
            meallocation: "Traditional Restaurant, Bole, Addis Ababa",
            latitude: 9.0140,
            longitude: 38.7630,
            distance: 0.8,
            mealtime: new Date("2024-01-25T12:30:00"),
            mealdescription: "Lunch together - 250 birr contribution",
            mealpicture: "https://robohash.org/restaurant.jpg",
            joinedusers: [
                { name: "Maria G.", profilePicture: "https://robohash.org/maria.jpg" },
                { name: "Peter S.", profilePicture: "https://robohash.org/peter.jpg" }
            ],
            expectedusers: 3,
            MealHost: {
                name: "Sofia A.",
                profilePicture: "https://robohash.org/sofia.jpg",
                userId: "user_sofia_006"
            },
            createdAt: new Date("2024-01-22T14:00:00"),
            updatedAt: new Date("2024-01-22T14:00:00"),
            userRelationship: "can_join"
        }
    ],
    almostFilled: [
        {
            mealId: "meal_007",
            mealtype: "Split",
            mealname: "Sushi Dinner",
            mealPrice: 800,
            meallocation: "Sushi Restaurant, Bole, Addis Ababa",
            latitude: 9.0125,
            longitude: 38.7615,
            distance: 1.2,
            mealtime: new Date("2024-01-24T19:30:00"),
            mealdescription: "Only 1 spot left! Let's enjoy sushi together.",
            mealpicture: "https://robohash.org/sushi.jpg",
            joinedusers: [
                { name: "Emma W.", profilePicture: "https://robohash.org/emma.jpg" },
                { name: "James R.", profilePicture: "https://robohash.org/james.jpg" }
            ],
            expectedusers: 3,
            MealHost: {
                name: "Daniel K.",
                profilePicture: "https://robohash.org/daniel.jpg",
                userId: "user_daniel_007"
            },
            createdAt: new Date("2024-01-21T11:00:00"),
            updatedAt: new Date("2024-01-23T16:00:00"),
            userRelationship: "can_join"
        }
    ]
};

// ============================================
// MEAL DETAIL PAGE MOCK DATA
// ============================================
export const mealDetailMockData: mealDetailData = {
    mealId: "meal_001",
    mealtype: "Split",
    mealname: "Ethiopian Platter",
    mealPrice: 450,
    meallocation: "Lucy Restaurant, Bole Road, Addis Ababa",
    latitude: 9.0120,
    longitude: 38.7617,
    distance: 2.3,
    mealtime: new Date("2024-01-25T19:00:00"),
    mealdescription: "Traditional Ethiopian food - let's share a large platter! Injera, doro wat, and more. Perfect for food lovers!",
    mealpicture: "https://robohash.org/ethiopian-platter.jpg",
    joinedusers: [
        { name: "Sarah M.", profilePicture: "https://robohash.org/sarah.jpg" },
        { name: "Mike T.", profilePicture: "https://robohash.org/mike.jpg" }
    ],
    expectedusers: 3,
    MealHost: {
        name: "Alem T.",
        profilePicture: "https://robohash.org/alem.jpg",
        userId: "user_alem_001",
        rating: 4.9,
        badge: "Verified Host",
        memberSince: new Date("2023-06-15")
    },
    createdAt: new Date("2024-01-20T10:00:00"),
    updatedAt: new Date("2024-01-20T10:00:00"),
    userRelationship: "can_join",
    paymentDetails: {
        perPerson: 150,
        totalAmount: 450,
        description: "Order food together, split the bill equally"
    },
    formattedTime: "Thursday, Jan 25 at 7:00 PM",
    formattedDate: "January 25, 2024"
};

// ============================================
// UPCOMING EVENTS PAGE MOCK DATA
// ============================================
export const upcomingEventsMockData: upcomingEventsData = {
    hosting: [
        {
            mealId: "meal_host_001",
            mealtype: "Split",
            mealname: "Italian Dinner",
            mealPrice: 550,
            meallocation: "Italian Restaurant, Bole, Addis Ababa",
            latitude: 9.0135,
            longitude: 38.7625,
            mealtime: new Date("2024-01-26T20:00:00"),
            mealdescription: "Pasta and wine night!",
            mealpicture: "https://robohash.org/italian.jpg",
            joinedusers: [
                { name: "Alex B.", profilePicture: "https://robohash.org/alex.jpg" },
                { name: "Nina C.", profilePicture: "https://robohash.org/nina.jpg" }
            ],
            expectedusers: 3,
            MealHost: {
                name: "Kenji",
                profilePicture: currentUser.profilePicture,
                userId: currentUser.userId
            },
            createdAt: new Date("2024-01-20T09:00:00"),
            updatedAt: new Date("2024-01-23T10:00:00"),
            isHosting: true,
            formattedTime: "Friday, Jan 26 • 8:00 PM",
            pendingRequestsCount: 2
        }
    ],
    attending: [
        {
            mealId: "meal_attend_001",
            mealtype: "Treat",
            mealPrice: "Free",
            meallocation: "Coffee Shop, Meskel Square, Addis Ababa",
            latitude: 9.0200,
            longitude: 38.7500,
            mealtime: new Date("2024-01-24T15:00:00"),
            mealdescription: "Afternoon coffee and snacks",
            joinedusers: [
                { name: "Kenji", profilePicture: currentUser.profilePicture },
                { name: "Rachel M.", profilePicture: "https://robohash.org/rachel.jpg" }
            ],
            expectedusers: 3,
            MealHost: {
                name: "Sophie L.",
                profilePicture: "https://robohash.org/sophie.jpg",
                userId: "user_sophie_008"
            },
            createdAt: new Date("2024-01-21T11:00:00"),
            updatedAt: new Date("2024-01-22T14:00:00"),
            isHosting: false,
            formattedTime: "Today, 3:00 PM"
        },
        {
            mealId: "meal_attend_002",
            mealtype: "Split",
            mealname: "BBQ Night",
            mealPrice: 700,
            meallocation: "BBQ Place, Bole, Addis Ababa",
            latitude: 9.0145,
            longitude: 38.7640,
            mealtime: new Date("2024-01-28T19:00:00"),
            mealdescription: "Grilled meats and sides",
            mealpicture: "https://robohash.org/bbq.jpg",
            joinedusers: [
                { name: "Kenji", profilePicture: currentUser.profilePicture },
                { name: "Mark T.", profilePicture: "https://robohash.org/mark.jpg" },
                { name: "Julia K.", profilePicture: "https://robohash.org/julia.jpg" }
            ],
            expectedusers: 4,
            MealHost: {
                name: "Chris P.",
                profilePicture: "https://robohash.org/chris.jpg",
                userId: "user_chris_009"
            },
            createdAt: new Date("2024-01-22T10:00:00"),
            updatedAt: new Date("2024-01-23T09:00:00"),
            isHosting: false,
            formattedTime: "Sun, Jan 28 • 7:00 PM"
        }
    ]
};

// ============================================
// PENDING EVENTS PAGE MOCK DATA
// ============================================
export const pendingEventsMockData: pendingEventsData = {
    events: [
        {
            mealId: "meal_pending_001",
            mealtype: "Split",
            mealname: "Seafood Dinner",
            mealPrice: 900,
            meallocation: "Seafood Restaurant, Bole, Addis Ababa",
            latitude: 9.0150,
            longitude: 38.7650,
            mealtime: new Date("2024-01-29T19:30:00"),
            mealdescription: "Fresh seafood platter",
            mealpicture: "https://robohash.org/seafood.jpg",
            joinedusers: [
                { name: "Oliver H.", profilePicture: "https://robohash.org/oliver.jpg" },
                { name: "Grace F.", profilePicture: "https://robohash.org/grace.jpg" }
            ],
            expectedusers: 3,
            MealHost: {
                name: "Michael R.",
                profilePicture: "https://robohash.org/michael.jpg",
                userId: "user_michael_010"
            },
            createdAt: new Date("2024-01-22T15:00:00"),
            updatedAt: new Date("2024-01-23T08:00:00"),
            requestStatus: "Pending",
            formattedTime: "Mon, Jan 29 • 7:30 PM"
        },
        {
            mealId: "meal_pending_002",
            mealtype: "Companion",
            mealPrice: 300,
            meallocation: "Local Eatery, Piazza, Addis Ababa",
            latitude: 9.0300,
            longitude: 38.7400,
            mealtime: new Date("2024-01-30T18:00:00"),
            mealdescription: "Exploring local cuisine",
            mealvideo: "https://youtube.com/watch?v=local-food",
            joinedusers: [
                { name: "Lucas M.", profilePicture: "https://robohash.org/lucas.jpg" }
            ],
            expectedusers: 3,
            MealHost: {
                name: "Isabella S.",
                profilePicture: "https://robohash.org/isabella.jpg",
                userId: "user_isabella_011"
            },
            createdAt: new Date("2024-01-23T12:00:00"),
            updatedAt: new Date("2024-01-23T12:00:00"),
            requestStatus: "Pending",
            formattedTime: "Tue, Jan 30 • 6:00 PM"
        }
    ]
};

// ============================================
// PAST EVENTS PAGE MOCK DATA
// ============================================
export const pastEventsMockData: pastEventsData = {
    events: [
        {
            mealId: "meal_past_001",
            mealtype: "Split",
            mealname: "Pizza Night",
            mealPrice: 500,
            meallocation: "Pizza Place, Bole, Addis Ababa",
            latitude: 9.0130,
            longitude: 38.7620,
            mealtime: new Date("2024-01-15T20:00:00"),
            mealdescription: "Great pizza and conversation",
            mealpicture: "https://robohash.org/pizza-past.jpg",
            joinedusers: [
                { name: "Emma W.", profilePicture: "https://robohash.org/emma.jpg" },
                { name: "James R.", profilePicture: "https://robohash.org/james.jpg" }
            ],
            expectedusers: 3,
            MealHost: {
                name: "Kenji",
                profilePicture: currentUser.profilePicture,
                userId: currentUser.userId
            },
            createdAt: new Date("2024-01-10T10:00:00"),
            updatedAt: new Date("2024-01-15T21:00:00"),
            mealStatus: "Completed",
            formattedDate: "Jan 15, 2024",
            isHosting: true
        },
        {
            mealId: "meal_past_002",
            mealtype: "Treat",
            mealPrice: "Free",
            meallocation: "Cafe, Meskel Square, Addis Ababa",
            latitude: 9.0200,
            longitude: 38.7500,
            mealtime: new Date("2024-01-12T14:00:00"),
            mealdescription: "Coffee meetup",
            joinedusers: [
                { name: "Kenji", profilePicture: currentUser.profilePicture },
                { name: "Sarah M.", profilePicture: "https://robohash.org/sarah.jpg" }
            ],
            expectedusers: 3,
            MealHost: {
                name: "David K.",
                profilePicture: "https://robohash.org/david.jpg",
                userId: "user_david_012"
            },
            createdAt: new Date("2024-01-08T09:00:00"),
            updatedAt: new Date("2024-01-12T15:00:00"),
            mealStatus: "Completed",
            formattedDate: "Jan 12, 2024",
            isHosting: false
        },
        {
            mealId: "meal_past_003",
            mealtype: "Split",
            mealname: "Sushi Dinner",
            mealPrice: 750,
            meallocation: "Sushi Restaurant, Bole, Addis Ababa",
            latitude: 9.0125,
            longitude: 38.7615,
            mealtime: new Date("2024-01-18T19:00:00"),
            mealdescription: "Cancelled due to host emergency",
            mealpicture: "https://robohash.org/sushi-past.jpg",
            joinedusers: [
                { name: "Kenji", profilePicture: currentUser.profilePicture }
            ],
            expectedusers: 3,
            MealHost: {
                name: "Lisa P.",
                profilePicture: "https://robohash.org/lisa.jpg",
                userId: "user_lisa_013"
            },
            createdAt: new Date("2024-01-14T11:00:00"),
            updatedAt: new Date("2024-01-18T18:00:00"),
            mealStatus: "Cancelled",
            formattedDate: "Jan 18, 2024",
            isHosting: false
        }
    ]
};

// ============================================
// HOST MEAL REQUESTS PAGE MOCK DATA
// ============================================
export const hostMealRequestsMockData: hostMealRequestsData = {
    mealId: "meal_host_001",
    mealtype: "Split",
    mealname: "Italian Dinner",
    mealPrice: 550,
    meallocation: "Italian Restaurant, Bole, Addis Ababa",
    latitude: 9.0135,
    longitude: 38.7625,
    mealtime: new Date("2024-01-26T20:00:00"),
    mealdescription: "Pasta and wine night!",
    mealpicture: "https://robohash.org/italian.jpg",
    expectedusers: 3,
    MealHost: {
        name: "Kenji",
        profilePicture: currentUser.profilePicture,
        userId: currentUser.userId
    },
    createdAt: new Date("2024-01-20T09:00:00"),
    updatedAt: new Date("2024-01-23T10:00:00"),
    formattedTime: "Friday, Jan 26 at 8:00 PM",
    pendingRequests: [
        {
            userId: "user_jane_014",
            name: "Jane D.",
            profilePicture: "https://robohash.org/jane.jpg",
            requestId: "request_001"
        },
        {
            userId: "user_robert_015",
            name: "Robert K.",
            profilePicture: "https://robohash.org/robert.jpg",
            requestId: "request_002"
        }
    ],
    pendingRequestsCount: 2
};

// ============================================
// PROFILE PAGE MOCK DATA (User's Own Profile)
// ============================================
export const profileMockData: profileData = {
    name: "Kenji",
    profilePicture: currentUser.profilePicture,
    aboutme: "Lover of food, culture, and good company. Let's share a meal!",
    interests: ["Ethiopian Cuisine", "Tech", "Travel", "Photography", "Hiking"],
    occupation: "Software Engineer",
    stats: {
        hosted: 12,
        joined: 28,
        rating: 4.8
    },
    comments: [
        {
            commenterName: "Sarah M.",
            commenterAvatarUrl: "https://robohash.org/sarah.jpg",
            commentTimeAgo: "2 days ago",
            rating: 5,
            comment: "Great host! Had an amazing time at the pizza night. Very friendly and organized."
        },
        {
            commenterName: "Mike T.",
            commenterAvatarUrl: "https://robohash.org/mike.jpg",
            commentTimeAgo: "1 week ago",
            rating: 5,
            comment: "Kenji is awesome! Great conversation and always punctual. Highly recommend joining his meals."
        },
        {
            commenterName: "Emma W.",
            commenterAvatarUrl: "https://robohash.org/emma.jpg",
            commentTimeAgo: "2 weeks ago",
            rating: 4,
            comment: "Nice person to share a meal with. Good food choices and interesting stories!"
        },
        {
            commenterName: "David K.",
            commenterAvatarUrl: "https://robohash.org/david.jpg",
            commentTimeAgo: "3 weeks ago",
            rating: 5,
            comment: "One of the best hosts on the platform. Always creates a welcoming atmosphere."
        }
    ]
};

// ============================================
// PARTICIPANT PROFILE PAGE MOCK DATA
// ============================================
// (Viewing someone else's profile, e.g., from a join request)
export const participantProfileMockData: participantProfileData = {
    userId: "user_jane_014",
    name: "Jane D.",
    age: 26,
    profilePicture: "https://robohash.org/jane.jpg",
    isVerified: true,
    occupation: "Graphic Designer",
    aboutme: "Food enthusiast and design lover. Always up for trying new cuisines!",
    interests: ["Design", "Food", "Art", "Coffee"],
    stats: {
        hosted: 5,
        joined: 15,
        rating: 4.7
    },
    showAcceptDecline: true,
    requestId: "request_001"
};

// ============================================
// APPLIED MEAL DETAIL PAGE MOCK DATA
// ============================================
// (When user clicks on a meal they applied to join)
export const appliedMealDetailMockData: appliedMealDetailData = {
    mealId: "meal_pending_001",
    mealtype: "Split",
    mealname: "Seafood Dinner",
    mealPrice: 900,
    meallocation: "Seafood Restaurant, Bole, Addis Ababa",
    latitude: 9.0150,
    longitude: 38.7650,
    mealtime: new Date("2024-01-29T19:30:00"),
    mealdescription: "Fresh seafood platter with a variety of dishes. Let's enjoy together!",
    mealpicture: "https://robohash.org/seafood.jpg",
    joinedusers: [
        { name: "Oliver H.", profilePicture: "https://robohash.org/oliver.jpg" },
        { name: "Grace F.", profilePicture: "https://robohash.org/grace.jpg" }
    ],
    expectedusers: 3,
    MealHost: {
        name: "Michael R.",
        profilePicture: "https://robohash.org/michael.jpg",
        userId: "user_michael_010",
        rating: 4.6,
        badge: "Verified Host",
        memberSince: new Date("2023-08-20")
    },
    createdAt: new Date("2024-01-22T15:00:00"),
    updatedAt: new Date("2024-01-23T08:00:00"),
    userRelationship: "pending",
    paymentDetails: {
        perPerson: 300,
        totalAmount: 900,
        description: "Order food together, split the bill equally"
    },
    formattedTime: "Monday, Jan 29 at 7:30 PM",
    formattedDate: "January 29, 2024",
    requestId: "request_pending_001",
    requestStatus: "Pending",
    requestSubmittedAt: new Date("2024-01-23T10:30:00")
};

