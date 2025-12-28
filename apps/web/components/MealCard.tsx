"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatTime, formatPrice, getCuisine } from "@/app/(Home)/_helpers/HomeHelper";
import { Hourglass, CheckCircle2, XCircle, LucideIcon } from "lucide-react";

type StatusDisplay = {
  icon: LucideIcon;
  text: string;
  color: string;
};

// Reusable Meal Card Component
export default function MealCard({ 
  meal, 
  layout = "vertical",
  status,
  variant = "default"
}: { 
  meal: any; 
  layout?: "horizontal" | "vertical";
  status?: StatusDisplay;
  variant?: "default" | "dull";
}) {
  const cuisine = getCuisine(meal.mealname);
  const time = meal.formattedTime || formatTime(meal.mealtime);
  const distance = `${meal.distance?.toFixed(1) || "0.0"} mi`;
  const price = formatPrice(meal.mealPrice, meal.expectedusers);
  const joinedCount = meal.joinedusers.length;
  const StatusIcon = status?.icon;

  // If user is hosting, link to requests page, otherwise link to meal detail
  const href = meal.isHosting ? `/meal/${meal.mealId}/requests` : `/meal/${meal.mealId}`

  return (
    <Link href={href} className="block">
      <Card className={cn(
        "flex flex-col items-stretch justify-start rounded-[var(--radius)] shadow-sm bg-card p-4 shrink-0 cursor-pointer transition-opacity hover:opacity-90",
        layout === "horizontal" ? "w-[300px]" : "w-full",
        variant === "dull" && "opacity-60 bg-muted/30"
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

            {status && StatusIcon && (
              <div className="mt-2 flex items-center gap-1.5">
                <StatusIcon className={`w-4 h-4 ${status.color}`} />
                <span className={`text-xs font-semibold ${status.color}`}>
                  {status.text}
                </span>
              </div>
            )}
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
    </Link>
  );
}

