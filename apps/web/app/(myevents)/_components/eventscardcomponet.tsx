"use client"

import { upcomingEventCard } from "@/backendData/data-type"
import MealCard from "@/components/MealCard"

export function EventsMealCard({ meals }: { meals: upcomingEventCard[] }) {
  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <MealCard
          key={meal.mealId}
          meal={meal}
          layout="vertical"
        />
      ))}
    </div>
  )
}