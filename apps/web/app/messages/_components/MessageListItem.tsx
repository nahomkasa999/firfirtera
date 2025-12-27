"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { MealChat } from "@/backendData/data-type"
import { currentUser } from "@/backendData/data"

interface MessageListItemProps {
  chat: MealChat
  isLast?: boolean
}

export default function MessageListItem({ chat, isLast }: MessageListItemProps) {
  // Get other participants (excluding current user)
  const otherParticipants = chat.participants.filter(
    (p) => p.userId !== currentUser.userId
  )

  // Determine the group picture or use first participant's picture
  const groupPicture = chat.mealPicture || otherParticipants[0]?.profilePicture

  // Format participant names for display
  const participantNames = otherParticipants.map((p) => p.name).join(", ")
  const displayNames = participantNames || "You"

  return (
    <>
      <div className="relative shrink-0">
        {chat.participants.length > 2 ? (
          // Multiple participants - show overlapping avatars
          <div className="flex -space-x-2">
            {chat.participants.slice(0, 2).map((participant) => (
              <Avatar
                key={participant.userId}
                className="h-12 w-12 ring-2 ring-background-light"
              >
                <AvatarImage
                  src={participant.profilePicture}
                  alt={`Profile picture of ${participant.name}`}
                />
                <AvatarFallback>
                  {participant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          // Single participant or group picture
          <Avatar className="h-12 w-12">
            <AvatarImage src={groupPicture} alt={`Group picture for ${chat.mealName}`} />
            <AvatarFallback>
              {chat.mealName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        {chat.isActive && (
          <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-background-light bg-green-400" />
        )}
      </div>
      <div className={`flex-1 overflow-hidden ${!isLast ? "border-b border-border pb-3" : "pb-3"}`}>
        <div className="flex items-baseline justify-between">
          <p className={`truncate ${chat.isActive ? "font-bold" : "font-semibold"} text-foreground`}>
            {chat.mealName}
          </p>
          <p className={`text-xs ${chat.isActive ? "text-primary" : "text-muted-foreground"}`}>
            {chat.formattedLastMessageTime}
          </p>
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {chat.lastMessage.senderName === currentUser.name ? "You" : chat.lastMessage.senderName}: {chat.lastMessage.content}
        </p>
      </div>
    </>
  )
}


