"use client"

import { useState } from "react"
import { Calendar, CalendarCheck, Users, Settings, MoreHorizontal, Star } from "lucide-react"
import { upcomingEventCard } from "@/backendData/data-type"

export function EventsMealCard({ meals }: { meals: upcomingEventCard[] }) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (mealId: string) => {
    setImageErrors((prev) => ({ ...prev, [mealId]: true }))
  }

  const getDefaultMealImage = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect fill='%23f47b25' width='64' height='64'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' dominant-baseline='middle' fill='white' font-family='sans-serif'%3E🍽️%3C/text%3E%3C/svg%3E"
  }

  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <div
          key={meal.mealId}
          className={`flex items-center gap-4 rounded-lg bg-card p-3 shadow-sm ${
            meal.isHosting ? "ring-1 ring-primary/20" : ""
          }`}
        >
          {/* Image with optional star badge for hosting */}
          <div className="relative">
            <img
              alt={meal.mealname || "Meal"}
              className="h-16 w-16 flex-shrink-0 rounded-lg object-cover bg-muted"
              src={imageErrors[meal.mealId] ? getDefaultMealImage() : meal.mealpicture || getDefaultMealImage()}
              onError={() => handleImageError(meal.mealId)}
            />
            {meal.isHosting && (
              <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-card">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base leading-tight text-foreground">
                {meal.mealname || "Meal"}
              </h3>
              {meal.isHosting && (
                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  You
                </span>
              )}
            </div>

            {!meal.isHosting && (
              <p className="text-sm text-muted-foreground">
                Hosted by {meal.MealHost.name}
              </p>
            )}

            <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
              {meal.isHosting ? (
                <Calendar className="w-4 h-4" />
              ) : (
                <CalendarCheck className="w-4 h-4" />
              )}
              <span className="text-xs font-semibold">{meal.formattedTime}</span>
            </div>

            {meal.isHosting && (
              <div className="mt-2 flex items-center">
                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-1">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-primary">
                    {meal.joinedusers.length}/{meal.expectedusers} joined
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            className={`flex items-center justify-center rounded-full transition-colors ${
              meal.isHosting
                ? "h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20"
                : "p-2 text-muted-foreground"
            }`}
          >
            {meal.isHosting ? (
              <Settings className="w-5 h-5" />
            ) : (
              <MoreHorizontal className="w-5 h-5" />
            )}
          </button>
        </div>
      ))}
    </div>
  )
}