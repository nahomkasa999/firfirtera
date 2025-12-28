// Database helper functions to convert between Prisma models and shared types

import type {
  BaseMealData,
  JoinedUser,
  Host,
  CreateMealData,
  ProfileData,
  ParticipantProfileData,
  ChatMessage,
} from "@repo/shared/types";
import type { Meal, User, MealJoinedUser, MealRequest, Message } from "@prisma/client";

// Convert Prisma Meal to BaseMealData
export function prismaMealToBaseMealData(
  meal: Meal & {
    host: User;
    joinedUsers: MealJoinedUser[];
    mealRequests?: MealRequest[];
  },
  currentUserId?: string
): BaseMealData {
  const mealPrice = meal.mealPrice === "Free" ? "Free" : parseFloat(meal.mealPrice);

  // Determine user relationship
  let userRelationship: "can_join" | "joined" | "pending" | "host" = "can_join";
  if (meal.host.userId === currentUserId) {
    userRelationship = "host";
  } else if (meal.joinedUsers.some((u) => u.name === currentUserId)) {
    userRelationship = "joined";
  } else if (      meal.mealRequests?.some((r: MealRequest) => r.userId === currentUserId && r.status === "Pending")) {
    userRelationship = "pending";
  }

  return {
    mealId: meal.mealId,
    mealtype: meal.mealtype as "Split" | "Treat" | "Companion",
    mealname: meal.mealname || undefined,
    mealPrice,
    meallocation: meal.meallocation,
    latitude: meal.latitude,
    longitude: meal.longitude,
    distance: meal.distance || undefined,
    mealtime: meal.mealtime,
    mealdescription: meal.mealdescription || undefined,
    mealpicture: meal.mealpicture || undefined,
    mealvideo: meal.mealvideo || undefined,
    joinedusers: meal.joinedUsers.map((u: MealJoinedUser) => ({
      name: u.name,
      profilePicture: u.profilePicture,
    })),
    expectedusers: meal.expectedusers,
    MealHost: {
      name: meal.host.name,
      profilePicture: meal.host.profilePicture,
      userId: meal.host.userId,
    },
    createdAt: meal.createdAt,
    updatedAt: meal.updatedAt,
    userRelationship,
  };
}

// Convert Prisma User to ProfileData
export function prismaUserToProfileData(
  user: User,
  comments: any[] = []
): ProfileData {
  return {
    name: user.name,
    profilePicture: user.profilePicture,
    aboutme: user.aboutme,
    interests: JSON.parse(user.interests || "[]"),
    occupation: user.occupation,
    stats: {
      hosted: user.statsHosted,
      joined: user.statsJoined,
      rating: user.statsRating,
    },
    comments: comments.map((c: any) => ({
      commenterName: c.commenterName,
      commenterAvatarUrl: c.commenterAvatarUrl,
      commentTimeAgo: formatTimeAgo(c.createdAt),
      rating: c.rating,
      comment: c.comment,
    })),
  };
}

// Convert Prisma User to ParticipantProfileData
export function prismaUserToParticipantProfileData(
  user: User,
  requestId?: string,
  showAcceptDecline?: boolean
): ParticipantProfileData {
  return {
    userId: user.userId,
    name: user.name,
    age: user.showAge ? user.age || undefined : undefined,
    profilePicture: user.profilePicture,
    isVerified: user.isVerified,
    occupation: user.occupation,
    aboutme: user.aboutme,
    interests: JSON.parse(user.interests || "[]"),
    stats: {
      hosted: user.statsHosted,
      joined: user.statsJoined,
      rating: user.statsRating,
    },
    showAcceptDecline,
    requestId,
  };
}

// Convert CreateMealData to Prisma Meal input
export function createMealDataToPrisma(
  data: CreateMealData,
  hostUserId: string
) {
  const mealPrice =
    data.mealtype === "Split" && data.totalMealPrice
      ? data.totalMealPrice.toString()
      : data.mealtype === "Companion" && data.contributionAmount
        ? data.contributionAmount.toString()
        : "Free";

  return {
    mealId: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    mealtype: data.mealtype,
    mealname: data.mealname || null,
    mealPrice,
    meallocation: data.meallocation,
    latitude: 9.1450, // TODO: Geocode address
    longitude: 38.7617, // TODO: Geocode address
    mealtime: new Date(data.mealtime),
    mealdescription: data.mealdescription || null,
    mealpicture: data.mealpicture || null,
    mealvideo: data.mealvideo || null,
    expectedusers: data.expectedusers,
    mealgenderpreference: data.mealgenderpreference,
    numberofmales: data.numberofmales || null,
    host: {
      connect: {
        userId: hostUserId,
      },
    },
  };
}

// Convert Prisma Message to ChatMessage
export function prismaMessageToChatMessage(
  message: Message & { sender: User },
  currentUserId: string
): ChatMessage {
  return {
    messageId: message.messageId,
    senderId: message.sender.userId,
    senderName: message.sender.name,
    senderProfilePicture: message.sender.profilePicture,
    content: message.content,
    timestamp: message.timestamp,
    isCurrentUser: message.sender.userId === currentUserId,
  };
}

// Helper to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

