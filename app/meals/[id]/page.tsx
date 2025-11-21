'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';

import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { SurfaceButton } from '@/components/ui/SurfaceButton';
import { ArrowLeft, Clock, Users, DollarSign, MapPin, User, X } from 'lucide-react';
import Link from 'next/link';

export default function MealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mealId = params.id as string;
  const { user } = useAuthStore();
  const [meal, setMeal] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // Only load on client side
    if (typeof window !== 'undefined') {
      loadMeal();
    }
  }, [mealId]);

  async function loadMeal() {
    try {
      setIsLoading(true);
      const data = await api.getMeal(mealId);
      setMeal(data.meal);
      setParticipants(data.meal.participants || []);
    } catch (error) {
      console.error('Failed to load meal:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleJoin() {
    try {
      setIsJoining(true);
      await api.joinMeal(mealId);
      await loadMeal();
    } catch (error: any) {
      alert(error.message || 'Failed to join meal');
    } finally {
      setIsJoining(false);
    }
  }

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel this meal?')) return;

    try {
      await api.cancelMeal(mealId);
      router.push('/meals');
    } catch (error: any) {
      alert(error.message || 'Failed to cancel meal');
    }
  }

  const isOrganizer = user && meal && meal.organizerId === String(user.id);
  const hasJoined = user && participants.some((p) => p.userId === String(user.id));
  const canJoin = !isOrganizer && !hasJoined && meal?.status === 'OPEN';

  if (isLoading) {
    return (
      <SurfaceCard>
        <p className="text-center text-muted-foreground">Loading...</p>
      </SurfaceCard>
    );
  }

  if (!meal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-8">
        <div className="size-24 rounded-full bg-muted flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-muted-foreground opacity-50">no_meals</span>
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-foreground">Meal Not Found</h2>
          <p className="text-muted-foreground">
            The meal request you're looking for doesn't exist or has been removed. It might have been cancelled by the organizer.
          </p>
        </div>
        <Link href="/meals">
          <SurfaceButton className="min-w-[200px] gap-2">
            <ArrowLeft size={18} />
            Back to Meals
          </SurfaceButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <Link href="/meals" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Meals</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Hero & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Image */}
          <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-xl group">
            {meal.restaurant?.imageUrl || meal.menuItem?.imageUrl ? (
              <div
                className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${meal.menuItem?.imageUrl || meal.restaurant?.imageUrl})`,
                }}
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary/40 text-8xl">restaurant</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-sans leading-tight">{meal.description}</h1>
              {meal.restaurant && (
                <p className="text-white/90 text-lg font-medium flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  {meal.restaurant.name}
                </p>
              )}
            </div>
          </div>

          {/* Meal Details */}
          <SurfaceCard className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 font-sans flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">Time</p>
                  <p className="text-base text-muted-foreground">{meal.mealTimeText || new Date(meal.mealTime).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">Participants</p>
                  <p className="text-base text-muted-foreground">
                    {meal.currentParticipants} / {meal.requiredParticipants} people
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">Cost per Person</p>
                  <p className="text-base text-muted-foreground">
                    {parseFloat(meal.splitAmount) === 0
                      ? 'FREE (Treat)'
                      : `${parseFloat(meal.splitAmount).toFixed(2)} Birr`}
                  </p>
                </div>
              </div>

              {meal.menuItem && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground mb-1">Menu Item</p>
                    <p className="text-base text-muted-foreground">{meal.menuItem.name}</p>
                  </div>
                </div>
              )}
            </div>

            {meal.genderPreferences && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">wc</span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">Gender Preferences</span>
                </div>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Looking for:
                  {meal.genderPreferences.male > 0 && ` ${meal.genderPreferences.male} male`}
                  {meal.genderPreferences.male > 0 && meal.genderPreferences.female > 0 && ','}
                  {meal.genderPreferences.female > 0 && ` ${meal.genderPreferences.female} female`}
                </p>
              </div>
            )}
          </SurfaceCard>
        </div>

        {/* Right Column: Participants & Actions */}
        <div className="space-y-8">
          {/* Status Card */}
          <SurfaceCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground font-sans">Status</h2>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-bold ${meal.status === 'FULL'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : meal.status === 'OPEN'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                  }`}
              >
                {meal.status}
              </span>
            </div>

            <div className="space-y-4">
              {canJoin && (
                <SurfaceButton fullWidth onClick={handleJoin} disabled={isJoining} className="py-4 text-lg shadow-lg shadow-primary/20">
                  {isJoining ? 'Joining...' : 'Join Meal'}
                </SurfaceButton>
              )}

              {isOrganizer && meal.status === 'OPEN' && (
                <SurfaceButton fullWidth variant="danger" onClick={handleCancel}>
                  Cancel Meal
                </SurfaceButton>
              )}

              {hasJoined && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-400">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                  <p className="font-bold">You're going!</p>
                </div>
              )}
            </div>
          </SurfaceCard>

          {/* Participants List */}
          <SurfaceCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground font-sans">Who's Going</h2>
              <span className="text-sm text-muted-foreground font-medium">{participants.length} joined</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg ring-2 ring-background">
                  {meal.organizer.firstName?.[0] || meal.organizer.username?.[0] || 'O'}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">
                    {meal.organizer.firstName || meal.organizer.username || 'Organizer'}
                  </p>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider">Organizer</p>
                </div>
              </div>

              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-lg ring-2 ring-background">
                    {participant.user?.firstName?.[0] || participant.user?.username?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {participant.user?.firstName || participant.user?.username || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">Participant</p>
                  </div>
                </div>
              ))}

              {participants.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Be the first to join!</p>
                </div>
              )}
            </div>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
