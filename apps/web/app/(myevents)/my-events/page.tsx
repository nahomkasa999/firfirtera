import React from 'react'
import { EventsMealCard } from '../_components/eventscardcomponet'
import { getUpcomingEvents } from '@/backendData/queries'
import { SecondaryPagesNavbar } from '@/components/SecondaryPagesNavbar'
import MealCardNavigation from '../_components/MealCardNavigation'

export default function MyEventsPage() {
    const upcomingEvents = getUpcomingEvents()
  return (
    <div className="flex flex-col">
        <SecondaryPagesNavbar title={"My Events"} />
        <main className="flex-1 px-4 pt-6">
          <MealCardNavigation />
          <div className="mt-6 space-y-6">
            {upcomingEvents.hosting.length > 0 && (
              <div>
                <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                  Hosting
                </h2>
                <EventsMealCard meals={upcomingEvents.hosting} />
              </div>
            )}
            {upcomingEvents.attending.length > 0 && (
              <div>
                <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                  Attending
                </h2>
                <EventsMealCard meals={upcomingEvents.attending} />
              </div>
            )}
          </div>
        </main>
    </div>
  )
}