"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function MealDetailNavbar() {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-10 flex items-center bg-background-light/80 p-4 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full text-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <div className="flex-1 text-center">
        <h2 className="text-lg font-bold leading-tight tracking-tight text-foreground">
          Meal Detail
        </h2>
      </div>
      <div className="w-10" />
    </div>
  )
}
