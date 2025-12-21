"use client"

import React, { useState } from 'react'

type TabType = 'upcoming' | 'pending' | 'past'

export default function MealCardNavigation() {
  const [activeTab, setActiveTab] = useState<TabType>('pending')

  const tabs = [
    { id: 'upcoming' as TabType, label: 'Upcoming' },
    { id: 'pending' as TabType, label: 'Pending' },
    { id: 'past' as TabType, label: 'Past' },
  ]

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-center gap-2 rounded-full bg-muted/50 p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-[80px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-3 text-xs font-bold leading-normal tracking-[0.015em] transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-foreground'
              }`}
            >
              <span className="truncate">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}