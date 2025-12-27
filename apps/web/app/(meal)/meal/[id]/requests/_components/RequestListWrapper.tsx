"use client"

import { useState } from "react"
import RequestItem from "./RequestItem"
import type { hostMealRequestsData } from "@/backendData/data-type"
import { toast } from "sonner"
import { BellOff } from "lucide-react"

interface RequestListWrapperProps {
  meal: hostMealRequestsData
}

export default function RequestListWrapper({ meal: initialMeal }: RequestListWrapperProps) {
  const [meal, setMeal] = useState(initialMeal)

  const handleAccept = (requestId: string) => {
    // TODO: Implement accept request API call
    toast.success("Request accepted!")
    // Remove the accepted request from the list
    setMeal({
      ...meal,
      pendingRequests: meal.pendingRequests.filter((r) => r.requestId !== requestId),
      pendingRequestsCount: meal.pendingRequestsCount - 1,
    })
  }

  const handleDecline = (requestId: string) => {
    // TODO: Implement decline request API call
    toast.info("Request declined.")
    // Remove the declined request from the list
    setMeal({
      ...meal,
      pendingRequests: meal.pendingRequests.filter((r) => r.requestId !== requestId),
      pendingRequestsCount: meal.pendingRequestsCount - 1,
    })
  }

  if (!meal.pendingRequests || meal.pendingRequests.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 mt-8">
        <div className="flex items-center justify-center size-20 rounded-full bg-primary/10 mb-6">
          <BellOff className="h-10 w-10 text-primary" />
        </div>
        <h4 className="text-lg font-bold text-foreground">No New Requests</h4>
        <p className="text-muted-foreground mt-1 max-w-xs">
          You're all caught up! No new requests at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {meal.pendingRequests.map((request) => (
        <RequestItem
          key={request.requestId}
          request={request}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      ))}
    </div>
  )
}


