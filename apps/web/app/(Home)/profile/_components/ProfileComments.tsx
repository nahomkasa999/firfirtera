"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { profileData } from "@/backendData/data-type"

type ProfileComment = profileData["comments"][number]

interface ProfileCommentsProps {
  comments: ProfileComment[]
}

export default function ProfileComments({ comments }: ProfileCommentsProps) {
  if (!comments || comments.length === 0) return null

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? "fill-amber-500 text-amber-500"
            : "fill-none text-muted-foreground"
        }`}
      />
    ))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-foreground">Previous Comments & Stars</h3>
        <button className="text-sm font-semibold text-primary">See all</button>
      </div>
      <div className="flex flex-col gap-4">
        {comments.map((comment, index) => {
          const initials = comment.commenterName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()

          return (
            <Card key={index} className="rounded-xl shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={comment.commenterAvatarUrl}
                      alt={`Avatar of ${comment.commenterName}`}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-foreground">{comment.commenterName}</p>
                        <p className="text-xs text-muted-foreground">{comment.commentTimeAgo}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {renderStars(comment.rating)}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">"{comment.comment}"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

