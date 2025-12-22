"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { profileData } from "@/backendData/data-type"

type ProfileStats = profileData["stats"]

interface ProfileStatsProps {
  stats: ProfileStats
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="grid grid-cols-3 gap-4 p-4 text-center">
        <div>
          <p className="text-2xl font-bold text-primary">{stats.hosted}</p>
          <p className="text-sm text-muted-foreground">Hosted</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">{stats.joined}</p>
          <p className="text-sm text-muted-foreground">Joined</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">{stats.rating}</p>
          <p className="text-sm text-muted-foreground">Rating</p>
        </div>
      </CardContent>
    </Card>
  )
}

