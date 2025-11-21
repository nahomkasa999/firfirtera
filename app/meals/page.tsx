'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMealStore } from '@/store/useMealStore';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { Clock, Users, X, Search, Filter, X as XIcon } from 'lucide-react';
import Link from 'next/link';

interface FilterState {
  location: string;
  minPrice: string;
  maxPrice: string;
  status: string;
}

export default function MyMealsPage() {
  const router = useRouter();
  const { organized, joined, setOrganized, setJoined, setLoading } = useMealStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'organized' | 'joined'>('organized');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    minPrice: '',
    maxPrice: '',
    status: '',
  });

  useEffect(() => {
    // Only load on client side
    if (typeof window !== 'undefined') {
      loadMeals();
    }
  }, []);

  async function loadMeals() {
    try {
      setLoading(true);
      const data = await api.getMeals();
      setOrganized(data.organized);
      setJoined(data.joined);
    } catch (error) {
      console.error('Failed to load meals:', error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }

  async function handleCancel(mealId: string) {
    if (!confirm('Are you sure you want to cancel this meal?')) return;

    try {
      await api.cancelMeal(mealId);
      setOrganized(organized.filter((m) => m.id !== mealId));
      setJoined(joined.filter((m) => m.id !== mealId));
    } catch (error: any) {
      alert(error.message || 'Failed to cancel meal');
    }
  }

  const allMeals = activeTab === 'organized' ? organized : joined;

  // Filter meals based on search and filters
  const filteredMeals = allMeals.filter((meal) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        meal.description?.toLowerCase().includes(query) ||
        meal.restaurant?.name?.toLowerCase().includes(query) ||
        meal.restaurant?.location?.toLowerCase().includes(query) ||
        meal.menuItem?.name?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Location filter
    if (filters.location) {
      const mealLocation = meal.restaurant?.location?.toLowerCase() || '';
      if (!mealLocation.includes(filters.location.toLowerCase())) return false;
    }

    // Price filters
    if (filters.minPrice) {
      const splitAmount = parseFloat(meal.splitAmount || '0');
      if (splitAmount < parseFloat(filters.minPrice)) return false;
    }
    if (filters.maxPrice) {
      const splitAmount = parseFloat(meal.splitAmount || '0');
      if (splitAmount > parseFloat(filters.maxPrice)) return false;
    }

    // Status filter
    if (filters.status && meal.status !== filters.status) return false;

    return true;
  });

  function handleApplyFilters() {
    setShowFilters(false);
  }

  function handleClearFilters() {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      status: '',
    });
    setSearchQuery('');
  }

  const hasActiveFilters = searchQuery || filters.location || filters.minPrice || filters.maxPrice || filters.status;

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-8">
      <h1 className="text-2xl font-bold text-foreground font-sans">My Meals</h1>

      {/* Search and Filter Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Browse meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card rounded-xl pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 rounded font-medium ${hasActiveFilters
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-foreground border border-border'
            }`}
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <GlassCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon size={20} />
              </button>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g., Piassa, Bole"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full bg-background rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Min Price (Birr)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full bg-background rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Max Price (Birr)</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full bg-background rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full bg-background rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="FULL">Full</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-2.5 rounded bg-muted text-muted-foreground font-medium"
              >
                Clear All
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 py-2.5 rounded bg-primary text-primary-foreground font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
              Search: {searchQuery}
            </span>
          )}
          {filters.location && (
            <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
              Location: {filters.location}
            </span>
          )}
          {filters.minPrice && (
            <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
              Min: {filters.minPrice} Birr
            </span>
          )}
          {filters.maxPrice && (
            <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
              Max: {filters.maxPrice} Birr
            </span>
          )}
          {filters.status && (
            <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
              Status: {filters.status}
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-card rounded p-1">
        <button
          onClick={() => setActiveTab('organized')}
          className={`flex-1 py-2 rounded font-medium ${activeTab === 'organized'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground'
            }`}
        >
          Organized ({organized.length})
        </button>
        <button
          onClick={() => setActiveTab('joined')}
          className={`flex-1 py-2 rounded font-medium ${activeTab === 'joined'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground'
            }`}
        >
          Joined ({joined.length})
        </button>
      </div>

      {/* Meals List */}
      {isLoading ? (
        <GlassCard>
          <p className="text-center text-muted-foreground">Loading...</p>
        </GlassCard>
      ) : filteredMeals.length === 0 ? (
        <GlassCard>
          <p className="text-center text-muted-foreground">
            {hasActiveFilters
              ? 'No meals match your filters'
              : `No ${activeTab === 'organized' ? 'organized' : 'joined'} meals`}
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filteredMeals.map((meal) => (
            <Link key={meal.id} href={`/meals/${meal.id}`}>
              <GlassCard>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{meal.description}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{meal.mealTimeText || new Date(meal.mealTime).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>
                          {meal.currentParticipants}/{meal.requiredParticipants}
                        </span>
                      </div>
                    </div>
                    {meal.restaurant && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {meal.restaurant.name}
                        {meal.menuItem && ` - ${meal.menuItem.name}`}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${meal.status === 'FULL'
                          ? 'bg-chart-2 text-foreground'
                          : meal.status === 'OPEN'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                    >
                      {meal.status}
                    </span>
                    {activeTab === 'organized' && meal.status === 'OPEN' && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCancel(meal.id);
                        }}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

