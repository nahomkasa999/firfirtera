"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { ChatMessage } from "@/backendData/data-type"

interface ChatMessagesProps {
  messages: ChatMessage[]
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatTime(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${ampm}`
}

function formatDisplayDate(date: Date): string {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const dateKey = formatDate(date)
  const todayKey = formatDate(today)
  const yesterdayKey = formatDate(yesterday)

  if (dateKey === todayKey) {
    return "Today"
  } else if (dateKey === yesterdayKey) {
    return "Yesterday"
  } else {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const displayDate = formatDisplayDate(message.timestamp)

    if (!acc[displayDate]) {
      acc[displayDate] = []
    }
    acc[displayDate].push(message)
    return acc
  }, {} as Record<string, ChatMessage[]>)

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(groupedMessages).map(([dateLabel, dateMessages]) => (
        <div key={dateLabel} className="flex flex-col gap-4">
          <p className="text-center text-xs text-muted-foreground">{dateLabel}</p>
          {dateMessages.map((message) => (
            <div
              key={message.messageId}
              className={`flex items-end gap-2 ${message.isCurrentUser ? "self-end" : ""}`}
            >
              {!message.isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={message.senderProfilePicture}
                    alt={`Profile picture of ${message.senderName}`}
                  />
                  <AvatarFallback>
                    {message.senderName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`flex flex-col gap-1 ${message.isCurrentUser ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-xs rounded-xl p-3 ${
                    message.isCurrentUser
                      ? "rounded-br-lg bg-primary text-primary-foreground"
                      : "rounded-bl-lg bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

