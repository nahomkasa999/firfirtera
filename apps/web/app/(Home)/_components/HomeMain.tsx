"use client";

import { dashboardMockData } from "@/backendData/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

// Helper function to format time
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

// Helper function to format price
function formatPrice(price: number | "Free", expectedUsers: number): string {
  if (price === "Free") return "";
  const perPerson = Math.round(price / expectedUsers);
  return `$${perPerson}/person`;
}

// Helper function to get cuisine from meal name or default
function getCuisine(mealName?: string): string {
  // This is a simple heuristic - in a real app, this would come from the data
  if (mealName?.toLowerCase().includes("ethiopian")) return "Ethiopian";
  if (mealName?.toLowerCase().includes("pizza")) return "Italian";
  if (mealName?.toLowerCase().includes("sushi")) return "Japanese";
  if (mealName?.toLowerCase().includes("bbq")) return "American";
  return "Ethiopian"; // Default
}

export default function HomeMain() {
  // Combine all meal arrays
  const allMeals = [
    ...dashboardMockData.recommendedForYou,
    ...dashboardMockData.recent,
    ...dashboardMockData.nearYou,
    ...dashboardMockData.almostFilled,
  ];

  return (
    <main className="flex flex-col gap-4 p-4 pb-28">
      {allMeals.map((meal) => {
        const joinedCount = meal.joinedusers.length;
        const cuisine = getCuisine(meal.mealname);
        const time = formatTime(meal.mealtime);
        const distance = `${meal.distance?.toFixed(1) || "0.0"} mi`;
        const price = formatPrice(meal.mealPrice, meal.expectedusers);

        return (
          <div key={meal.mealId} className="@container">
            <Card className="flex flex-col items-stretch justify-start rounded-md shadow-sm bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col items-start gap-3 w-full">
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col gap-1">
                      <p className="text-foreground text-base font-bold leading-tight tracking-[-0.015em]">
                        {meal.mealname || "Meal"}
                      </p>
                      <p className="text-muted-foreground text-sm font-normal leading-normal">
                        Hosted by {meal.MealHost.name}
                      </p>
                      {price && (
                        <p className="text-primary text-sm font-semibold leading-normal">
                          {price}
                        </p>
                      )}
                    </div>
                    <div className="flex h-7 items-center justify-center gap-x-2 rounded-full px-3 bg-primary/10 self-start">
                      <p className="text-primary text-xs font-bold leading-normal">
                        {meal.mealtype}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground w-full">
                    <span className="text-sm">{cuisine}</span>
                    <span className="text-sm">{time}</span>
                    <span className="text-sm">{distance}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1.5 self-center">
                  <div className="flex -space-x-2">
                    {meal.joinedusers.slice(0, 3).map((user, index) => (
                      <Avatar
                        key={index}
                        className="size-6 ring-2 ring-card rounded-full"
                      >
                        <AvatarImage
                          src={user.profilePicture}
                          alt={`Profile picture of ${user.name}`}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-muted text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {/* Show empty avatars for remaining spots (up to 3 total avatars visible) */}
                    {Array.from({
                      length: Math.min(
                        Math.max(0, 3 - meal.joinedusers.length),
                        meal.expectedusers - meal.joinedusers.length
                      ),
                    }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="flex size-6 items-center justify-center rounded-full bg-muted ring-2 ring-card"
                      />
                    ))}
                  </div>
                  {joinedCount >= meal.expectedusers - 1 ? (
                    <div className="flex items-baseline gap-1">
                      <p className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">
                        {joinedCount}/{meal.expectedusers}
                      </p>
                      <span className="text-muted-foreground text-xs font-medium">
                        joined
                      </span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm font-medium">
                      {joinedCount}/{meal.expectedusers} joined
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </main>
  );
}

