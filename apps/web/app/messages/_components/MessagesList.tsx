"use client"

import Link from "next/link"
import MessageListItem from "./MessageListItem"
import type { messagesListData } from "@/backendData/data-type"

interface MessagesListProps {
  messagesData: messagesListData
}

export default function MessagesList({ messagesData }: MessagesListProps) {
  return (
    <>
      {/* Current Event Section */}
      {messagesData.currentEvent.length > 0 && (
        <>
          <div className="p-4">
            <h2 className="text-base font-bold text-foreground">Current Event</h2>
          </div>
          {messagesData.currentEvent.map((chat) => (
            <Link
              key={chat.mealId}
              href={`/messages/${chat.mealId}`}
              className="flex items-center gap-4 bg-primary/10 px-4 py-3 transition-colors hover:bg-primary/20"
            >
              <MessageListItem chat={chat} />
            </Link>
          ))}
        </>
      )}

      {/* Past Events Section */}
      {messagesData.pastEvents.length > 0 && (
        <>
          <div className="p-4 pb-2">
            <h2 className="text-base font-bold text-foreground">Past Events</h2>
          </div>
          <div className="flex flex-col">
            {messagesData.pastEvents.map((chat, index) => (
              <Link
                key={chat.mealId}
                href={`/messages/${chat.mealId}`}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted"
              >
                <MessageListItem chat={chat} isLast={index === messagesData.pastEvents.length - 1} />
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {messagesData.currentEvent.length === 0 && messagesData.pastEvents.length === 0 && (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-center">
            <p className="text-muted-foreground">No messages yet</p>
          </div>
        </div>
      )}
    </>
  )
}


