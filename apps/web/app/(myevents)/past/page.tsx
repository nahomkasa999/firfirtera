import React from 'react'
import { PastMealCard } from '../_components/pastmealcard'
import { getPastEvents } from '@/backendData/queries'
import { SecondaryPagesNavbar } from '@/components/SecondaryPagesNavbar'
import MealCardNavigation from '../_components/MealCardNavigation'

export default function PastPage() {
  const pastEvents = getPastEvents()

  return (
    <div className="flex flex-col">
      <SecondaryPagesNavbar title={"My Events"} />
      <main className="flex-1 px-4 pt-6">
        <MealCardNavigation />
        <div className="mt-8">
          <PastMealCard meals={pastEvents.events} />
        </div>
      </main>
    </div>
  )
}

