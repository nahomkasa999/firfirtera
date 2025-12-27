"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MessagesNavbar() {
  return (
    <header className="sticky top-0 z-10 bg-background-light/90 pt-4 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-start">
          {/* Empty div for spacing */}
        </div>
        <div className="flex flex-1 flex-col items-center text-center">
          <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
            Messages
          </h1>
          <p className="text-sm text-muted-foreground">Meal Events</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-foreground"
            aria-label="Search"
          >
            <Search className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}


