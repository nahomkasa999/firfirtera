'use client';

import { ReactNode, useEffect } from 'react';
import { initTelegram } from '@/lib/telegram';
import { useAuthStore } from '@/store/useAuthStore';
import { BottomNav } from '@/components/ui/BottomNav';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/layout/Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    initTelegram();
    init();
  }, [init]);

  return (
    <div className="relative flex h-auto min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header - Hidden on Desktop */}
        <div className="md:hidden">
          <Header />
        </div>

        <main className="flex-grow pb-24 md:pb-8 px-4 md:px-8 pt-4 md:pt-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav - Hidden on Desktop */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}

