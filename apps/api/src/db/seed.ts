// Database seed data using Prisma
import { prisma } from "./client.js";

export async function seedDatabase() {
  try {
    // Check if database is already seeded
    const existingUser = await prisma.user.findFirst({
      where: { userId: "user_123456789" },
    });

    if (existingUser) {
      console.log("Database already seeded");
      return;
    }

    // Create default user
    const user = await prisma.user.create({
      data: {
        userId: "user_123456789",
        name: "Kenji",
        username: "kenji_foodie",
        email: "kenji@example.com",
        age: 28,
        showAge: true,
        gender: "Male",
        profilePicture:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBxaqLnyzddMGAraaRlcIXBAxs9PFkhCe7JRVh5_plC44Nay2nDbOwxsOtpBU1PemJfWShZQYOJoUY-PFLj0Dnq5Wl1X-JqoLrNIf6sXDAJWwbcecDO5FUzkBoUhhK_yDE0HbLJ5lGhD3KNar6kdCIBzFJSOMcLRm9HaHzPUEkE5tZy3zQAslDYExTRUVnPJOvDB2a3nQ7Ev8K18gT43wzeoLe6oWRKPb1CP4ExrPlXYpDoxE7AAEfnYX45FBApBuxC2CD2nEpNZw",
        occupation: "Software Engineer",
        aboutme: "Lover of food, culture, and good company. Let's share a meal!",
        interests: JSON.stringify([
          "Ethiopian Cuisine",
          "Tech",
          "Travel",
          "Photography",
          "Hiking",
        ]),
        isVerified: true,
        currentLat: 9.1450,
        currentLon: 38.7617,
        currentAddress: "Addis Ababa, Ethiopia",
        statsHosted: 12,
        statsJoined: 28,
        statsRating: 4.8,
      },
    });

    // Create additional users for sample meals
    const host1 = await prisma.user.upsert({
      where: { userId: "user_alem_001" },
      update: {},
      create: {
        userId: "user_alem_001",
        name: "Alem T.",
        username: "alem_t",
        profilePicture: "https://robohash.org/alem.jpg",
        occupation: "Chef",
        aboutme: "Food enthusiast",
        interests: JSON.stringify(["Cooking", "Ethiopian Cuisine"]),
        gender: "Male",
        currentLat: 9.0120,
        currentLon: 38.7617,
        currentAddress: "Addis Ababa, Ethiopia",
      },
    });

    const host2 = await prisma.user.upsert({
      where: { userId: "user_elena_002" },
      update: {},
      create: {
        userId: "user_elena_002",
        name: "Elena R.",
        username: "elena_r",
        profilePicture: "https://robohash.org/elena.jpg",
        occupation: "Designer",
        aboutme: "Coffee lover",
        interests: JSON.stringify(["Coffee", "Tech"]),
        gender: "Female",
        currentLat: 9.0200,
        currentLon: 38.7500,
        currentAddress: "Addis Ababa, Ethiopia",
      },
    });

    // Create sample meals
    const meal1 = await prisma.meal.create({
      data: {
        mealId: "meal_001",
        mealtype: "Split",
        mealname: "Ethiopian Platter",
        mealPrice: "450",
        meallocation: "Lucy Restaurant, Bole Road, Addis Ababa",
        latitude: 9.0120,
        longitude: 38.7617,
        mealtime: new Date("2026-01-05T19:00:00"),
        mealdescription:
          "Traditional Ethiopian food - let's share a large platter! Injera, doro wat, and more. Perfect for food lovers!",
        mealpicture: "https://robohash.org/ethiopian-platter.jpg",
        expectedusers: 3,
        mealgenderpreference: "Anonymous",
        hostId: host1.userId,
        joinedUsers: {
          create: [
            {
              name: "Sarah M.",
              profilePicture: "https://robohash.org/sarah.jpg",
            },
            {
              name: "Mike T.",
              profilePicture: "https://robohash.org/mike.jpg",
            },
          ],
        },
      },
    });

    const meal2 = await prisma.meal.create({
      data: {
        mealId: "meal_002",
        mealtype: "Treat",
        mealPrice: "Free",
        meallocation: "Kaldi's Coffee, Meskel Square, Addis Ababa",
        latitude: 9.0200,
        longitude: 38.7500,
        mealtime: new Date("2026-01-06T14:00:00"),
        mealdescription: "Coffee and pastries on me! Let's chat about tech and travel.",
        expectedusers: 2,
        mealgenderpreference: "Anonymous",
        hostId: host2.userId,
        joinedUsers: {
          create: [
            {
              name: "David K.",
              profilePicture: "https://robohash.org/david.jpg",
            },
          ],
        },
      },
    });

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
