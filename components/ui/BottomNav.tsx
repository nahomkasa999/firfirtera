'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { useState } from 'react';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { createFormState } = useRestaurantStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFormComplete = createFormState !== null && pathname === '/create';

  async function handleSubmitForm() {
    if (!isFormComplete) return;
    
    setIsSubmitting(true);
    try {
      // Trigger form submission by navigating to create page with a flag
      // The create page will handle the submission
      const event = new CustomEvent('submitCreateForm');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const navItems = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/meals', icon: 'group', label: 'Groups' },
    { href: '/create', icon: 'add', label: 'Create meal', isCreate: true },
    { href: '/restaurants', icon: 'restaurant', label: 'Restaurants' },
    { href: '/settings', icon: 'person', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-card border-t border-border">
      <div className="flex justify-around items-center h-20 px-2 md:px-[20%] lg:px-[25%] xl:px-[30%] pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCreate = item.isCreate;
          
          if (isCreate) {
            // If form is complete, show send button instead
            if (isFormComplete) {
              return (
                <button
                  key={item.href}
                  onClick={handleSubmitForm}
                  disabled={isSubmitting}
                  className="flex flex-col items-center justify-center text-center -mt-6 disabled:opacity-50"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-1">
                    {isSubmitting ? (
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <span className="material-symbols-outlined text-white text-2xl">send</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-medium text-primary">post</span>
                    <span className="text-xs font-medium text-primary">meal</span>
                  </div>
                </button>
              );
            }
            
            // Default: show create button
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center text-center -mt-6"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-1">
                  <span className="material-symbols-outlined text-white text-2xl">{item.icon}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-primary">create</span>
                  <span className="text-xs font-medium text-primary">meal</span>
                </div>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center text-center w-16 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

