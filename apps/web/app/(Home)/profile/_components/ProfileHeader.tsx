"use client"

import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { profileData } from "@/backendData/data-type"

interface ProfileHeaderProps {
  profile: profileData
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24 ring-4 ring-white">
          <AvatarImage src={profile.profilePicture} alt={`Profile picture of ${profile.name}`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-white shadow"
          aria-label="Edit profile picture"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
        <p className="text-muted-foreground mt-1">{profile.aboutme}</p>
        {profile.occupation && (
          <p className="text-muted-foreground text-sm mt-1">{profile.occupation}</p>
        )}
      </div>
    </div>
  )
}

