"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { mealDetailData } from "@/backendData/data-type"
import { useMemo } from "react"

interface MealDetailFooterProps {
  meal: mealDetailData
}

export default function MealDetailFooter({ meal }: MealDetailFooterProps) {
  // Determine meal state and what to show
  const mealState = useMemo(() => {
    const now = new Date();
    const mealTime = new Date(meal.mealtime);
    const isCompleted = mealTime < now;
    const hasApplied = meal.userRelationship === "pending";
    const hasJoined = meal.userRelationship === "joined";
    const isFull = meal.joinedusers.length >= meal.expectedusers;
    const isActive = mealTime >= now;

    return {
      isCompleted,
      hasApplied,
      hasJoined,
      isFull,
      isActive,
      showJoinCTA: !isCompleted && !hasApplied && !hasJoined && isActive && !isFull && meal.userRelationship === "can_join",
      showChatCTA: !isCompleted && hasJoined && isActive,
      showWaiting: !isCompleted && hasApplied,
    };
  }, [meal]);

  // Don't render anything if meal is completed
  if (mealState.isCompleted) {
    return null;
  }

  return (
    <>
      {/* Footer Button - Conditionally rendered based on meal state */}
      {mealState.showJoinCTA && (
        <footer className="fixed bottom-0 left-0 right-0 md:left-1/2 md:right-auto md:w-1/2 md:-translate-x-1/2 bg-gradient-to-t from-background-light via-background-light to-transparent p-4 mb-13">
          <Button
            className={cn(
              "flex h-14 w-full items-center justify-center rounded-lg text-lg font-bold shadow-lg"
            )}
          >
            Join
          </Button>
        </footer>
      )}

      {/* Chat Button - Show when user has joined */}
      {mealState.showChatCTA && (
        <footer className="fixed bottom-0 left-0 right-0 md:left-1/2 md:right-auto md:w-1/2 md:-translate-x-1/2 bg-gradient-to-t from-background-light via-background-light to-transparent p-4 mb-13">
          <Button
            className={cn(
              "flex h-14 w-full items-center justify-center rounded-lg text-lg font-bold shadow-lg"
            )}
          >
            Chat
          </Button>
        </footer>
      )}

      {/* Waiting Status - Show when user has applied */}
      {mealState.showWaiting && (
        <footer className="fixed bottom-0 left-0 right-0 md:left-1/2 md:right-auto md:w-1/2 md:-translate-x-1/2 bg-gradient-to-t from-background-light via-background-light to-transparent p-4 mb-13">
          <div className="flex h-14 w-full items-center justify-center rounded-lg bg-muted border border-border">
            <p className="text-lg font-semibold text-muted-foreground">Waiting</p>
          </div>
        </footer>
      )}
    </>
  );
}

