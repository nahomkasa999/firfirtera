"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

type TabType = 'upcoming' | 'pending' | 'past'

export default function MealCardNavigation() {
  const pathname = usePathname()
  
  // Extract the current tab from the pathname (e.g., '/pending' -> 'pending')
  const currentTab = pathname?.split('/').pop() || 'pending' as TabType

  const tabs = [
    { id: 'upcoming' as TabType, label: 'Upcoming', href: '/upcoming' },
    { id: 'pending' as TabType, label: 'Pending', href: '/pending' },
    { id: 'past' as TabType, label: 'Past', href: '/past' },
  ]

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-center gap-2 rounded-full bg-muted/50 p-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex min-w-[80px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-3 text-xs font-bold leading-normal tracking-[0.015em] transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-foreground'
              }`}
            >
              <span className="truncate">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}