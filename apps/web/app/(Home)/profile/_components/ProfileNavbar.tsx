"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfileNavbar() {
  return (
    <header className="sticky top-0 z-10 bg-background-light/90 backdrop-blur-sm pt-4">
      <div className="flex items-center p-4 pb-2 justify-between">
        <div className="flex size-12 shrink-0 items-center justify-start" />
        <h1 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Profile
        </h1>
        <div className="flex w-12 items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full"
            aria-label="Settings"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}

