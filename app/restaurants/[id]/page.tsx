'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, MapPin, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  const { setSelectedRestaurant, setSelectedMenuItem } = useRestaurantStore();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only load on client side
    if (typeof window !== 'undefined') {
      loadRestaurant();
    }
  }, [restaurantId]);

  async function loadRestaurant() {
    try {
      setIsLoading(true);
      const [restaurantData, menuData] = await Promise.all([
        api.getRestaurant(restaurantId),
        api.getMenuItems(restaurantId),
      ]);
      setRestaurant(restaurantData.restaurant);
      setMenuItems(menuData.menuItems);
      setSelectedRestaurant(restaurantData.restaurant);
    } catch (error) {
      console.error('Failed to load restaurant:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectMenuItem(item: any) {
    setSelectedMenuItem(item);
    router.push('/create');
  }

  if (isLoading) {
    return (
      <GlassCard>
        <p className="text-center text-muted-foreground">Loading...</p>
      </GlassCard>
    );
  }

  if (!restaurant) {
    return (
      <div>
        <p className="text-center text-muted-foreground">Restaurant not found</p>
        <Link href="/restaurants">
          <GlassButton fullWidth className="mt-4">
            Back to Restaurants
          </GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/restaurants" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft size={20} />
        <span>Back</span>
      </Link>

      {/* Restaurant Info */}
      <GlassCard>
        {restaurant.imageUrl && (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-48 rounded-xl object-cover mb-4"
          />
        )}
        <h1 className="text-2xl font-bold text-foreground mb-2 font-sans">{restaurant.name}</h1>
        {restaurant.location && (
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin size={16} />
            <span>{restaurant.location}</span>
          </div>
        )}
      </GlassCard>

      {/* Menu Items */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 font-sans">Menu</h2>
        {menuItems.length === 0 ? (
          <GlassCard>
            <p className="text-center text-muted-foreground">No menu items available</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <GlassCard key={item.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    )}
                    {item.price !== null && item.price !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign size={14} />
                        <span className="font-semibold">{item.price} Birr</span>
                      </div>
                    )}
                  </div>
                  <GlassButton
                    onClick={() => handleSelectMenuItem(item)}
                    className="ml-4"
                  >
                    Select
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

