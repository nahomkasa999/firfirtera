import React from 'react'
import { PendingMealCard } from '../_components/pendingmealcard'
import { getPendingEvents, getUpcomingEvents } from '@/backendData/queries'
import { SecondaryPagesNavbar } from '@/components/SecondaryPagesNavbar'
import MealCardNavigation from '../_components/MealCardNavigation'

export default function PendingPage() {
  const pendingEvents = getPendingEvents()
  const upcomingEvents = getUpcomingEvents()
  
  // Combine pending events and hosting meals
  const allPendingMeals = [
    ...pendingEvents.events,
    ...upcomingEvents.hosting,
  ]

  return (
    <div className="flex flex-col">
      <SecondaryPagesNavbar title={"My Events"} />
      <main className="flex-1 px-4 pt-6">
        <MealCardNavigation />
        <div className="mt-8">
          <PendingMealCard meals={allPendingMeals} />
        </div>
      </main>
    </div>
  )
}


