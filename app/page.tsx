'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMealStore } from '@/store/useMealStore';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { SurfaceButton } from '@/components/ui/SurfaceButton';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { organized, joined, setOrganized, setJoined, setLoading } = useMealStore();
  const { noShowCount } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only load data on client side
    if (typeof window !== 'undefined') {
      loadData();
    }
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [mealsData, profileData] = await Promise.all([
        api.getMeals().catch((err) => {
          console.error('Failed to load meals:', err);
          return { organized: [], joined: [] };
        }),
        api.getProfile().catch((err) => {
          console.error('Failed to load profile:', err);
          return { noShowCount: 0 };
        }),
      ]);
      setOrganized(mealsData.organized);
      setJoined(mealsData.joined);
      useAuthStore.getState().setNoShowCount(profileData.noShowCount);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }

  // Get meal invitations (meals user is invited to but hasn't organized)
  const invitations = joined.filter((m) => m.status === 'OPEN' || m.status === 'FULL');

  // Get upcoming meals (organized meals that are confirmed/full)
  const upcomingMeals = organized.filter((m) => m.status === 'FULL');

  function formatMealTime(meal: any) {
    if (meal.mealTimeText) {
      return meal.mealTimeText;
    }
    const date = new Date(meal.mealTime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const mealDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (mealDate.getTime() === today.getTime()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (mealDate.getTime() === today.getTime() + 24 * 60 * 60 * 1000) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }
  }

  // Show empty state if no meals
  if (invitations.length === 0 && upcomingMeals.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="bg-card p-12 rounded-3xl w-full max-w-lg shadow-xl border border-border/50">
          <div className="flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mx-auto mb-8">
            <span className="material-symbols-outlined text-5xl text-primary">restaurant_menu</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Hungry?</h2>
          <p className="text-muted-foreground mb-10 text-lg">
            Discover amazing local restaurants or plan a meal with friends.
          </p>
          <Link href="/create" className="block w-full">
            <SurfaceButton variant="primary" fullWidth className="w-full py-6 text-lg">
              Start Planning
            </SurfaceButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Meal Invitations Section */}
      {invitations.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-foreground text-2xl font-bold leading-tight tracking-tight">
              Invitations
            </h3>
            <span className="bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">
              {invitations.length} New
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {invitations.map((meal) => (
              <Link key={meal.id} href={`/meals/${meal.id}`} className="block">
                <SurfaceCard className="p-3">
                  <div className="flex flex-col gap-2">
                    {/* Image */}
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                      {meal.menuItem?.imageUrl || meal.restaurant?.imageUrl ? (
                        <div
                          className="w-full h-full bg-center bg-cover"
                          style={{
                            backgroundImage: `url(${meal.menuItem?.imageUrl || meal.restaurant?.imageUrl})`,
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary/40 text-2xl">restaurant</span>
                        </div>
                      )}
                      <div className="absolute top-1 right-1 bg-background/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm">
                        Invited
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-foreground text-sm font-semibold leading-tight line-clamp-1">
                        {meal.restaurant?.name || meal.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span className="line-clamp-1">{formatMealTime(meal)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                          {meal.organizer?.firstName?.[0] || meal.organizer?.username?.[0] || 'O'}
                        </div>
                        <span className="text-xs text-muted-foreground truncate">{meal.organizer?.firstName || meal.organizer?.username || 'Someone'}</span>
                      </div>
                    </div>
                  </div>
                </SurfaceCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Meals Section */}
      {upcomingMeals.length > 0 && (
        <section>
          <h3 className="text-foreground text-2xl font-bold leading-tight tracking-tight mb-3">
            Upcoming Meals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {upcomingMeals.map((meal) => (
              <Link key={meal.id} href={`/meals/${meal.id}`} className="block">
                <SurfaceCard className="p-3">
                  <div className="flex flex-col gap-2">
                    {/* Image */}
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                      {meal.restaurant?.imageUrl || meal.menuItem?.imageUrl ? (
                        <div
                          className="w-full h-full bg-center bg-cover"
                          style={{ backgroundImage: `url(${meal.restaurant?.imageUrl || meal.menuItem?.imageUrl})` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <span className="material-symbols-outlined text-primary/50 text-2xl">restaurant</span>
                        </div>
                      )}
                      <div className="absolute top-1 right-1 bg-green-500/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                        <span className="material-symbols-outlined text-white text-[10px]">check_circle</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-foreground text-sm font-semibold leading-tight line-clamp-1">
                        {meal.restaurant?.name || meal.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="material-symbols-outlined text-xs">event</span>
                        <span className="line-clamp-1">{formatMealTime(meal)}</span>
                      </div>
                      <div className="flex items-center gap-1 -space-x-1 mt-1">
                        <div className="size-5 rounded-full ring-2 ring-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-foreground z-10">
                          {meal.organizer?.firstName?.[0] || 'O'}
                        </div>
                        {meal.participants?.slice(0, 2).map((p: any, i: number) => (
                          <div key={i} className="size-5 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                            {p.user?.firstName?.[0] || 'U'}
                          </div>
                        ))}
                        {(meal.participants?.length || 0) > 2 && (
                          <div className="size-5 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                            +{(meal.participants?.length || 0) - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </SurfaceCard>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
