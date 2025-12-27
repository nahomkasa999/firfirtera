"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, MapPin, CreditCard } from "lucide-react"
import type { hostMealRequestsData } from "@/backendData/data-type"

interface MealHeaderCardProps {
  meal: hostMealRequestsData
}

export default function MealHeaderCard({ meal }: MealHeaderCardProps) {
  return (
    <Card className="rounded-lg border border-border bg-card shadow-sm overflow-hidden mt-4">
      <CardContent className="flex flex-col gap-6 p-4">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium leading-normal text-primary uppercase">
            {meal.mealtype}
          </p>
          <p className="text-xl font-bold leading-tight tracking-[-0.015em]">
            {meal.mealname || "Meal"}
          </p>
          <p className="text-base font-normal leading-normal text-muted-foreground mt-1">
            {meal.formattedTime}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/20">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="font-bold text-foreground">
                {meal.joinedusers?.length || 0}/{meal.expectedusers} Joined
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/20">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Time</p>
              <p className="font-bold text-foreground">{meal.formattedTime}</p>
            </div>
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/20">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="font-bold text-foreground">{meal.meallocation}</p>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div>
          <h3 className="mb-3 text-lg font-bold text-foreground">Payment</h3>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/20">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Each person pays
              </p>
              <p className="text-lg font-bold text-foreground">
                {meal.mealPrice === "Free"
                  ? "Free"
                  : typeof meal.mealPrice === "number"
                  ? `${meal.mealPrice} Birr`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        {meal.mealdescription && (
          <div>
            <h3 className="mb-2 text-lg font-bold text-foreground">About this meal</h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              {meal.mealdescription}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



