"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { pastEventCard } from "@/backendData/data-type"
import MealCard from "@/components/MealCard"

export function PastMealCard({ meals }: { meals: pastEventCard[] }) {
  const getStatusDisplay = (meal: pastEventCard) => {
    if (meal.mealStatus === "Completed") {
      return {
        icon: CheckCircle2,
        text: "Completed",
        color: "text-green-500",
      }
    } else if (meal.mealStatus === "Cancelled") {
      return {
        icon: XCircle,
        text: "Cancelled",
        color: "text-red-500",
      }
    }
    return null
  }

  return (
    <div className="space-y-4">
      {meals.map((meal) => {
        const statusDisplay = getStatusDisplay(meal)

        // Map formattedDate to formattedTime for the MealCard component
        const mealWithFormattedTime = {
          ...meal,
          formattedTime: meal.formattedDate,
        }

        return (
          <MealCard
            key={meal.mealId}
            meal={mealWithFormattedTime}
            layout="vertical"
            status={statusDisplay || undefined}
            variant="dull"
          />
        )
      })}
    </div>
  )
}

