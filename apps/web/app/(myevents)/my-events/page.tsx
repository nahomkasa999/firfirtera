import React from 'react'
import { EventsMealCard } from '../_components/eventscardcomponet'
import { getUpcomingEvents } from '@/backendData/queries'
import { SecondaryPagesNavbar } from '@/components/SecondaryPagesNavbar'
import MealCardNavigation from '../_components/MealCardNavigation'

export default function MyEventsPage() {
    const upcomingEvents = getUpcomingEvents()
  return (
    <div>
        <SecondaryPagesNavbar title={"My Events"} />
        <MealCardNavigation />
        <h1>Hosting</h1>
        <EventsMealCard meals={upcomingEvents.hosting} />
        <h1>Attending</h1>
        <EventsMealCard meals={upcomingEvents.attending} />
    </div>
  )
}