"use client";

import { dashboardMockData } from "@/backendData/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Helper functions for formatting
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatPrice(price: number | "Free", expectedUsers: number): string {
  if (price === "Free") return "";
  const perPerson = Math.round(price / expectedUsers);
  return `$${perPerson}/person`;
}

function getCuisine(mealName?: string): string {
  if (mealName?.toLowerCase().includes("ethiopian")) return "Ethiopian";
  if (mealName?.toLowerCase().includes("pizza")) return "Italian";
  if (mealName?.toLowerCase().includes("sushi")) return "Japanese";
  return "Cuisine";
}

// Reusable Meal Card Component
function MealCard({ meal, layout = "vertical" }: { meal: any; layout?: "horizontal" | "vertical" }) {
  const cuisine = getCuisine(meal.mealname);
  const time = formatTime(meal.mealtime);
  const distance = `${meal.distance?.toFixed(1) || "0.0"} mi`;
  const price = formatPrice(meal.mealPrice, meal.expectedusers);
  const joinedCount = meal.joinedusers.length;

  return (
    <Card className={cn(
      "flex flex-col items-stretch justify-start rounded-[var(--radius)] shadow-sm bg-card p-4 shrink-0",
      layout === "horizontal" ? "w-[300px]" : "w-full"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex justify-between w-full">
            <div className="flex flex-col">
              <p className="text-foreground text-base font-bold leading-tight tracking-tight">
                {meal.mealname || "Meal"}
              </p>
              <p className="text-muted-foreground text-xs font-normal">
                Hosted by {meal.MealHost.name}
              </p>
            </div>
            <div className="flex h-6 items-center justify-center rounded-full px-2 bg-primary/10 self-start">
              <p className="text-primary text-[10px] font-bold uppercase tracking-wider">
                {meal.mealtype}
              </p>
            </div>
          </div>
          
          {price && <p className="text-primary text-sm font-semibold">{price}</p>}

          <div className="flex items-center gap-3 text-muted-foreground mt-1">
            <span className="text-xs">{cuisine}</span>
            <span className="text-xs">•</span>
            <span className="text-xs">{time}</span>
            <span className="text-xs">•</span>
            <span className="text-xs">{distance}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5 self-center">
          <div className="flex -space-x-2">
            {meal.joinedusers.slice(0, 3).map((user: any, index: number) => (
              <Avatar key={index} className="size-6 ring-2 ring-card rounded-full">
                <AvatarImage src={user.profilePicture} className="object-cover" />
                <AvatarFallback className="bg-muted text-[10px]">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-foreground text-xs font-bold whitespace-nowrap">
            {joinedCount}/{meal.expectedusers} <span className="text-muted-foreground font-medium text-[10px]">joined</span>
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function HomeMain() {
  return (
    <main className="flex flex-col gap-8 pb-28">
      
      {/* 1. Near You - Horizontal Scroll */}
      <section>
        <div className="px-4 mb-3 flex justify-between items-end">
          <h2 className="text-lg font-bold text-foreground">Near You</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
          {dashboardMockData.nearYou.map((meal) => (
            <MealCard key={meal.mealId} meal={meal} layout="horizontal" />
          ))}
        </div>
      </section>

      {/* 2. Almost Full - Horizontal Scroll */}
      <section>
        <div className="px-4 mb-3 flex justify-between items-end">
          <h2 className="text-lg font-bold text-foreground">Almost Full</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
          {dashboardMockData.almostFilled.map((meal) => (
            <MealCard key={meal.mealId} meal={meal} layout="horizontal" />
          ))}
        </div>
      </section>

      {/* 3. Recent - Vertical List */}
      <section className="px-4">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-foreground">Recent</h2>
        </div>
        <div className="flex flex-col gap-3">
          {dashboardMockData.recent.map((meal) => (
            <MealCard key={meal.mealId} meal={meal} layout="vertical" />
          ))}
        </div>
      </section>

    </main>
  );
}