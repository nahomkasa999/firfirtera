"use client"
import { Plus, Home, Calendar, MessageCircle, UserCircle} from 'lucide-react'
import { usePathname} from 'next/navigation'
import Link from 'next/link'
import React from 'react'

const BottomNav = () => {
   const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'My Events', href: '/upcoming', icon: Calendar },
        { name: 'Create', href: '/create', icon: Plus },
        { name: 'Messages', href: '/messages', icon: MessageCircle },
        { name: 'Profile', href: '/profile', icon: UserCircle },
      ] 

  const pathname = usePathname()
  const isActive = (href: string) => {
    if (href === '/upcoming') {
      return pathname === '/upcoming' || pathname === '/pending' || pathname === '/past'
    }
    return pathname === href
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 mx-auto w-full md:max-w-[50%]">
        <div className="flex justify-around p-2">
            {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
                        <item.icon
                            className={
                                `w-6 h-6 ${active ? 'text-primary' : 'text-gray-400'}`
                            }
                        />
                        <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-gray-400'}`}>{item.name}</span>
                    </Link>
                );
            })}
        </div>
    </div>
  )
}

export default BottomNav
