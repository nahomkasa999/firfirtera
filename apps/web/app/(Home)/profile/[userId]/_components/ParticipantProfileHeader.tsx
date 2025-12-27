"use client"

import { CheckCircle2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { participantProfileData } from "@/backendData/data-type"

interface ParticipantProfileHeaderProps {
  profile: participantProfileData
}

export default function ParticipantProfileHeader({ profile }: ParticipantProfileHeaderProps) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={profile.profilePicture} alt={`Profile picture of ${profile.name}`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {profile.isVerified && (
          <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
          {profile.name}
          {profile.age && `, ${profile.age}`}
        </p>
        {profile.occupation && (
          <p className="text-muted-foreground text-base font-normal leading-normal text-center">
            {profile.occupation}
          </p>
        )}
        {profile.aboutme && (
          <p className="text-muted-foreground text-sm mt-2 text-center">{profile.aboutme}</p>
        )}
      </div>
    </div>
  )
}




