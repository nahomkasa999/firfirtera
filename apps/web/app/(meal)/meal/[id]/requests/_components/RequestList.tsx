"use client"

import RequestItem from "./RequestItem"
import type { hostMealRequestsData } from "@/backendData/data-type"

interface RequestListProps {
  meal: hostMealRequestsData
  onAccept: (requestId: string) => void
  onDecline: (requestId: string) => void
}

export default function RequestList({ meal, onAccept, onDecline }: RequestListProps) {
  if (!meal.pendingRequests || meal.pendingRequests.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 mt-8">
        <div className="flex items-center justify-center size-20 rounded-full bg-primary/10 mb-6">
          <span className="text-4xl text-primary">📭</span>
        </div>
        <h4 className="text-lg font-bold">No New Requests</h4>
        <p className="text-muted-foreground mt-1 max-w-xs">
          You're all caught up! No new requests at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold leading-tight text-left pb-2 pt-8">
        {meal.pendingRequestsCount} Pending Request{meal.pendingRequestsCount !== 1 ? "s" : ""}
      </h3>
      <div className="flex flex-col gap-2">
        {meal.pendingRequests.map((request) => (
          <RequestItem
            key={request.requestId}
            request={request}
            onAccept={onAccept}
            onDecline={onDecline}
          />
        ))}
      </div>
    </div>
  )
}




