'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Plus, Edit, Trash2, UtensilsCrossed } from 'lucide-react';

const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID || '560058670';

export default function AdminPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'restaurants' | 'menus'>('restaurants');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    imageUrl: '',
    price: '',
    description: '',
  });

  useEffect(() => {
    // Only load on client side
    if (typeof window !== 'undefined' && user && String(user.id) === ADMIN_USER_ID) {
      loadRestaurants();
    }
  }, [user]);

  async function loadRestaurants() {
    try {
      setIsLoading(true);
      const data = await api.adminGetRestaurants();
      setRestaurants(data.restaurants);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMenuItems(restaurantId: string) {
    try {
      const data = await api.adminGetMenuItems(restaurantId);
      setMenuItems(data.menuItems);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    }
  }

  async function handleCreateRestaurant() {
    try {
      await api.adminCreateRestaurant({
        name: formData.name,
        location: formData.location || null,
        imageUrl: formData.imageUrl || null,
      });
      setShowRestaurantForm(false);
      setFormData({ name: '', location: '', imageUrl: '', price: '', description: '' });
      loadRestaurants();
    } catch (error: any) {
      alert(error.message || 'Failed to create restaurant');
    }
  }

  async function handleCreateMenuItem() {
    if (!selectedRestaurant) {
      alert('Please select a restaurant first');
      return;
    }

    try {
      await api.adminCreateMenuItem({
        restaurantId: selectedRestaurant.id,
        name: formData.name,
        price: formData.price ? parseFloat(formData.price) : null,
        description: formData.description || null,
        imageUrl: formData.imageUrl || null,
      });
      setShowMenuItemForm(false);
      setFormData({ name: '', location: '', imageUrl: '', price: '', description: '' });
      loadMenuItems(selectedRestaurant.id);
    } catch (error: any) {
      alert(error.message || 'Failed to create menu item');
    }
  }

  async function handleDeleteRestaurant(id: string) {
    if (!confirm('Are you sure you want to delete this restaurant?')) return;

    try {
      await api.adminDeleteRestaurant(id);
      loadRestaurants();
    } catch (error: any) {
      alert(error.message || 'Failed to delete restaurant');
    }
  }

  async function handleDeleteMenuItem(id: string) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await api.adminDeleteMenuItem(id);
      if (selectedRestaurant) {
        loadMenuItems(selectedRestaurant.id);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete menu item');
    }
  }

  if (!user || String(user.id) !== ADMIN_USER_ID) {
    return (
      <GlassCard>
        <p className="text-center text-muted-foreground">Access denied. Admin only.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground font-sans">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-2 bg-card rounded p-1">
        <button
          onClick={() => {
            setActiveTab('restaurants');
            setSelectedRestaurant(null);
            setMenuItems([]);
          }}
          className={`flex-1 py-2 rounded font-medium ${
            activeTab === 'restaurants'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground'
          }`}
        >
          Restaurants
        </button>
        <button
          onClick={() => setActiveTab('menus')}
          className={`flex-1 py-2 rounded font-medium ${
            activeTab === 'menus'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground'
          }`}
        >
          Menu Items
        </button>
      </div>

      {/* Restaurants Tab */}
      {activeTab === 'restaurants' && (
        <div className="space-y-4">
          <GlassButton
            fullWidth
            onClick={() => setShowRestaurantForm(!showRestaurantForm)}
          >
            <Plus size={18} className="mr-2" />
            Add Restaurant
          </GlassButton>

          {showRestaurantForm && (
            <GlassCard>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-card rounded-xl px-4 py-3 text-foreground placeholder-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="text"
                  placeholder="Location (optional)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-card rounded-xl px-4 py-3 text-foreground placeholder-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-card rounded-xl px-4 py-3 text-foreground placeholder-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="flex gap-2">
                  <GlassButton variant="secondary" fullWidth onClick={() => setShowRestaurantForm(false)}>
                    Cancel
                  </GlassButton>
                  <GlassButton fullWidth onClick={handleCreateRestaurant}>
                    Create
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          )}

          {isLoading ? (
            <GlassCard>
              <p className="text-center text-muted-foreground">Loading...</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {restaurants.map((restaurant) => (
                <GlassCard key={restaurant.id}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
                      {restaurant.location && (
                        <p className="text-sm text-muted-foreground">{restaurant.location}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteRestaurant(restaurant.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Menu Items Tab */}
      {activeTab === 'menus' && (
        <div className="space-y-4">
          <div>
            <label className="block text-muted-foreground mb-2">Select Restaurant</label>
            <select
              value={selectedRestaurant?.id || ''}
              onChange={(e) => {
                const restaurant = restaurants.find((r) => r.id === e.target.value);
                setSelectedRestaurant(restaurant || null);
                if (restaurant) {
                  loadMenuItems(restaurant.id);
                }
              }}
              className="w-full bg-card rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select a restaurant</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id} className="bg-card">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRestaurant && (
            <>
              <GlassButton
                fullWidth
                onClick={() => setShowMenuItemForm(!showMenuItemForm)}
              >
                <Plus size={18} className="mr-2" />
                Add Menu Item
              </GlassButton>

              {showMenuItemForm && (
                <GlassCard>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Menu Item Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-card rounded-xl px-4 py-3 text-foreground placeholder-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                      type="number"
                      placeholder="Price (optional)"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-card rounded-xl px-4 py-3 text-foreground placeholder-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-card rounded-xl px-4 py-3 text-foreground placeholder-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      rows={3}
                    />
                    <input
                      type="url"
                      placeholder="Image URL (optional)"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full bg-card rounded-xl px-4 py-3 text-foreground placeholder-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="flex gap-2">
                      <GlassButton variant="secondary" fullWidth onClick={() => setShowMenuItemForm(false)}>
                        Cancel
                      </GlassButton>
                      <GlassButton fullWidth onClick={handleCreateMenuItem}>
                        Create
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              )}

              <div className="space-y-3">
                {menuItems.map((item) => (
                  <GlassCard key={item.id}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        {item.price && (
                          <p className="text-sm text-muted-foreground">{item.price} Birr</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

