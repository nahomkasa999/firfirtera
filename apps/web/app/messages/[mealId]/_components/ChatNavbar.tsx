"use client"

import { useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { chatDetailData } from "@/backendData/data-type"
import { currentUser } from "@/backendData/data"

interface ChatNavbarProps {
  chatData: chatDetailData
}

export default function ChatNavbar({ chatData }: ChatNavbarProps) {
  const router = useRouter()

  // Get other participants (excluding current user)
  const otherParticipants = chatData.participants.filter(
    (p) => p.userId !== currentUser.userId
  )

  // Format participant names for display
  const participantNames = otherParticipants.map((p) => p.name).join(", ")
  const displayNames = participantNames || "You"

  return (
    <header className="sticky top-0 z-10 bg-background-light/90 pt-4 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-start">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-foreground"
            onClick={() => router.back()}
            aria-label="Back"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
        </div>
        <div className="flex flex-1 flex-col items-center text-center">
          <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
            {chatData.mealName}
          </h1>
          <p className="text-sm text-muted-foreground">{displayNames}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-foreground"
            aria-label="More options"
          >
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}


