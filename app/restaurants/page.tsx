'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { api } from '@/lib/api';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

export default function RestaurantsPage() {
  const router = useRouter();
  const { setSelectedRestaurant } = useRestaurantStore();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  async function loadRestaurants() {
    try {
      const data = await api.getRestaurants();
      setRestaurants(data.restaurants || []);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleRestaurantClick(restaurant: any) {
    setSelectedRestaurant(restaurant);
    router.push(`/restaurants/${restaurant.id}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="max-w-4xl mx-auto w-full">
        {/* Top App Bar & Filters */}
        <div className="sticky top-0 z-10 bg-background">
          {/* Header */}
          <div className="flex items-center bg-background px-0.5 md:px-4 pb-2 pt-4 md:pt-4 justify-between">
            <button
              onClick={() => router.back()}
              className="flex size-12 shrink-0 items-center justify-start text-foreground"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
            </button>
            <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-sans">
              Restaurants
            </h2>
            <div className="flex size-12 shrink-0 items-center"></div>
          </div>

          {/* Search Bar */}
          <div className="px-0.5 md:px-4 py-3">
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full border border-border">
                <div className="text-muted-foreground flex items-center justify-center pl-4 rounded-l-xl">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or cuisine"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-foreground focus:outline-none focus:ring-0 border-none bg-card h-full placeholder:text-muted-foreground px-4 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 px-0.5 md:px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded bg-primary text-primary-foreground pl-4 pr-3">
              <p className="text-sm font-medium leading-normal">Cuisine</p>
              <span className="material-symbols-outlined text-xl">arrow_drop_down</span>
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded bg-card border border-border pl-4 pr-3">
              <p className="text-foreground text-sm font-medium leading-normal">Price Range</p>
              <span className="material-symbols-outlined text-xl text-foreground">arrow_drop_down</span>
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded bg-card border border-border pl-4 pr-3">
              <p className="text-foreground text-sm font-medium leading-normal">Rating</p>
              <span className="material-symbols-outlined text-xl text-foreground">arrow_drop_down</span>
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded bg-card border border-border pl-4 pr-3">
              <p className="text-foreground text-sm font-medium leading-normal">Nearby</p>
              <span className="material-symbols-outlined text-xl text-foreground">arrow_drop_down</span>
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded bg-card border border-border pl-4 pr-3">
              <p className="text-foreground text-sm font-medium leading-normal">Open Now</p>
              <span className="material-symbols-outlined text-xl text-foreground">arrow_drop_down</span>
            </button>
          </div>
          <div className="h-2 bg-background"></div>
        </div>

        {/* Restaurant List */}
        <div className="px-0.5 md:px-4 pb-24">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading restaurants...</div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {searchQuery ? 'No restaurants found' : 'No restaurants available'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredRestaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => handleRestaurantClick(restaurant)}
                className="w-full flex items-center gap-3 cursor-pointer rounded bg-card hover:bg-muted/50 border border-border p-3 group"
              >
                {/* Restaurant Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded bg-muted flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl text-muted-foreground">
                    restaurant
                  </span>
                </div>

                {/* Restaurant Info */}
                <div className="flex-1 flex flex-col gap-1 items-start min-w-0">
                  <p className="text-primary text-xs font-semibold">Ethiopian</p>
                  <p className="text-foreground text-base font-bold leading-tight font-sans truncate w-full">
                    {restaurant.name}
                  </p>
                  <p className="text-muted-foreground text-sm truncate w-full">
                    {restaurant.location || 'Addis Ababa'}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className="material-symbols-outlined text-sm text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <p className="text-foreground text-xs font-medium">4.5</p>
                  </div>
                </div>

                {/* Right Arrow Icon */}
                <div className="flex-shrink-0">
                  <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary transition-colors">
                    chevron_right
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
