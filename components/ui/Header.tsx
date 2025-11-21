'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center bg-background/80 backdrop-blur-sm px-6 md:px-[20%] lg:px-[25%] xl:px-[30%] pb-4 justify-between border-b border-border">
      <div className="relative flex items-center gap-3">
        {user?.id ? (
          <div className="relative">
            <div className="rounded-full size-12 border-2 border-primary bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-sm font-bold">
                {user.firstName?.[0] || user.username?.[0] || 'U'}
              </span>
            </div>
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-chart-2 ring-2 ring-background"></span>
          </div>
        ) : (
          <div className="relative">
            <div className="rounded-full size-12 border-2 border-primary bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">person</span>
            </div>
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-chart-2 ring-2 ring-background"></span>
          </div>
        )}
        <h1 className="text-xl font-bold text-foreground">
          {user?.firstName ? `Hey, ${user.firstName}` : user?.username ? `Hey, ${user.username}` : 'Hey there'}
        </h1>
      </div>
      <div className="flex items-center">
        <Link
          href="/settings"
          className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <span className="material-symbols-outlined">settings</span>
        </Link>
      </div>
    </header>
  );
}

