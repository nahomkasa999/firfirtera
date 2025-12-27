"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { MealRequestUser } from "@/backendData/data-type"

interface RequestItemProps {
  request: MealRequestUser
  onAccept: (requestId: string) => void
  onDecline: (requestId: string) => void
}

export default function RequestItem({ request, onAccept, onDecline }: RequestItemProps) {
  const initials = request.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="flex items-center gap-4 p-3 min-h-14 justify-between">
        <Link
          href={`/profile/${request.userId}`}
          className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={request.profilePicture} alt={`Profile picture of ${request.name}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <p className="text-base font-medium leading-normal flex-1 truncate">{request.name}</p>
        </Link>
        <div className="shrink-0 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-semibold leading-normal py-2 px-4 rounded-full bg-muted/60 hover:bg-muted"
            onClick={() => onDecline(request.requestId)}
          >
            Decline
          </Button>
          <Button
            size="sm"
            className="text-sm font-semibold leading-normal py-2 px-4 rounded-full"
            onClick={() => onAccept(request.requestId)}
          >
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

