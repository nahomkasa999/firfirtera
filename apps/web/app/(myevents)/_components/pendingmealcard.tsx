"use client"

import { Hourglass, CheckCircle2, XCircle } from "lucide-react"
import { pendingEventCard, upcomingEventCard } from "@/backendData/data-type"
import MealCard from "@/components/MealCard"

type PendingMealCardData = pendingEventCard | upcomingEventCard

export function PendingMealCard({ meals }: { meals: PendingMealCardData[] }) {
  const getStatusDisplay = (meal: PendingMealCardData) => {
    // For hosting meals (upcomingEventCard with isHosting=true), no status needed
    if ("isHosting" in meal && meal.isHosting) {
      return null
    }
    
    // For pending event cards
    if ("requestStatus" in meal) {
      const status = meal.requestStatus
      if (status === "Pending") {
        return {
          icon: Hourglass,
          text: "Pending Approval",
          color: "text-yellow-500",
        }
      } else if (status === "Accepted") {
        return {
          icon: CheckCircle2,
          text: "Accepted",
          color: "text-green-500",
        }
      } else if (status === "Rejected") {
        return {
          icon: XCircle,
          text: "Declined",
          color: "text-red-500",
        }
      }
    }
    return null
  }

  return (
    <div className="space-y-4">
      {meals.map((meal) => {
        const statusDisplay = getStatusDisplay(meal)

        return (
          <MealCard
            key={meal.mealId}
            meal={meal}
            layout="vertical"
            status={statusDisplay || undefined}
          />
        )
      })}
    </div>
  )
}

