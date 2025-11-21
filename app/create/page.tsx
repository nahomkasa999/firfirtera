'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { WheelTimePicker } from '@/components/ui/WheelTimePicker';
import { ArrowLeft, Plus, Minus, X, Search, Settings, MapPin, Check } from 'lucide-react';

export default function CreateMealPage() {
  const router = useRouter();
  const { selectedRestaurant, selectedMenuItems, setSelectedRestaurant, toggleMenuItem, setSelectedMenuItems } =
    useRestaurantStore();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [showRestaurantResults, setShowRestaurantResults] = useState(false);
  const [showMenuItems, setShowMenuItems] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [hasGenderPreference, setHasGenderPreference] = useState(false);
  const [formData, setFormData] = useState({
    restaurantId: '',
    menuItemIds: [] as string[],
    maleCount: 0,
    femaleCount: 0,
    peopleNeeded: 1,
    date: '',
    time: '',
    timeFormat: '12', // '12' or '24'
    period: 'AM', // AM or PM (only for 12-hour format)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRestaurants();
    if (selectedRestaurant) {
      setFormData((prev) => ({ ...prev, restaurantId: selectedRestaurant.id }));
      setRestaurantSearch(selectedRestaurant.name);
    } else {
      // Clear menu items when restaurant is deselected
      setMenuItems([]);
      setShowMenuItems(false);
      setSelectedMenuItems([]);
    }
  }, [selectedRestaurant]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, menuItemIds: selectedMenuItems.map((item) => item.id) }));
  }, [selectedMenuItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target as Node)) {
        setShowMenuItems(false);
      }
    }

    if (showMenuItems) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenuItems]);

  async function loadRestaurants() {
    try {
      const data = await api.getRestaurants();
      setRestaurants(data.restaurants || []);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    }
  }

  async function loadMenuItems() {
    if (!selectedRestaurant) return;

    // If menu items are already loaded, just toggle dropdown
    if (menuItems.length > 0) {
      setShowMenuItems(!showMenuItems);
      return;
    }

    // Otherwise, load menu items first
    try {
      setIsLoadingMenu(true);
      const data = await api.getMenuItems(selectedRestaurant.id);
      setMenuItems(data.menuItems || []);
      setShowMenuItems(true);
    } catch (error) {
      console.error('Failed to load menu items:', error);
      alert('Failed to load menu items');
    } finally {
      setIsLoadingMenu(false);
    }
  }

  function handleToggleMenuItem(item: any) {
    toggleMenuItem(item);
  }

  const filteredRestaurants = restaurants.filter((r) =>
    r.name?.toLowerCase().includes(restaurantSearch.toLowerCase()) ||
    r.location?.toLowerCase().includes(restaurantSearch.toLowerCase())
  );

  function handleRestaurantSelect(restaurant: any) {
    setSelectedRestaurant(restaurant);
    setRestaurantSearch(restaurant.name);
    setShowRestaurantResults(false);
    setFormData((prev) => ({ ...prev, restaurantId: restaurant.id }));
  }

  function formatDateTime() {
    if (!formData.date || !formData.time) return 'Select time';

    const datePart = formData.date === 'zare' ? 'Zare' : 'Nege';
    let timeDisplay = formData.time;

    if (formData.timeFormat === '12') {
      const [hours, minutes] = formData.time.split(':');
      let hour12 = parseInt(hours);
      if (formData.period === 'PM' && hour12 !== 12) {
        hour12 += 12;
      } else if (formData.period === 'AM' && hour12 === 12) {
        hour12 = 0;
      }
      timeDisplay = `${hour12}:${minutes} ${formData.period}`;
    }

    return `${datePart}, ${timeDisplay}`;
  }

  function calculateTotalPrice() {
    if (selectedMenuItems.length === 0) return 0;
    const totalItemPrice = selectedMenuItems.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price || '0');
      return sum + price;
    }, 0);
    const peopleCount = hasGenderPreference
      ? formData.maleCount + formData.femaleCount
      : formData.peopleNeeded;
    return totalItemPrice * (1 + peopleCount);
  }

  function calculateSplitAmount() {
    if (selectedMenuItems.length === 0) return 0;
    const totalPrice = calculateTotalPrice();
    const peopleCount = hasGenderPreference
      ? formData.maleCount + formData.femaleCount
      : formData.peopleNeeded;
    return totalPrice / (1 + peopleCount);
  }

  async function handleSubmit() {
    try {
      setIsSubmitting(true);

      if (selectedMenuItems.length === 0) {
        alert('Please select at least one menu item');
        return;
      }

      // Build meal data
      const description = selectedMenuItems.map((item) => item.name).join(', ');
      const totalCost = calculateTotalPrice().toFixed(2);
      const splitAmount = calculateSplitAmount().toFixed(2);

      // Build time string
      const datePart = formData.date; // 'zare' or 'nege'
      let timeText = '';

      if (formData.timeFormat === '12') {
        timeText = `${datePart} ${formData.period} ${formData.time}`;
      } else {
        timeText = `${datePart} ${formData.time}`;
      }

      // Parse to Date
      const now = new Date();
      let hour24 = parseInt(formData.time.split(':')[0]);
      let minute = parseInt(formData.time.split(':')[1]);

      if (formData.timeFormat === '12') {
        if (formData.period === 'PM' && hour24 !== 12) {
          hour24 += 12;
        } else if (formData.period === 'AM' && hour24 === 12) {
          hour24 = 0;
        }
      }

      const mealTime =
        formData.date === 'zare'
          ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour24, minute)
          : new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            hour24,
            minute
          );

      const mealData = {
        description,
        totalCost,
        splitAmount,
        requiredParticipants: hasGenderPreference
          ? 1 + formData.maleCount + formData.femaleCount
          : 1 + formData.peopleNeeded,
        mealTime: mealTime.toISOString(),
        mealTimeText: timeText,
        restaurantId: formData.restaurantId,
        menuItemIds: formData.menuItemIds,
        genderPreferences:
          hasGenderPreference && (formData.maleCount > 0 || formData.femaleCount > 0)
            ? { male: formData.maleCount, female: formData.femaleCount }
            : null,
      };

      await api.createMeal(mealData);
      router.push('/meals');
    } catch (error: any) {
      alert(error.message || 'Failed to create meal');
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    selectedRestaurant &&
    selectedMenuItems.length > 0 &&
    formData.date &&
    formData.time;

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-32 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-muted/50"
        >
          <ArrowLeft size={18} />
          <span className="font-medium text-sm">Back</span>
        </button>
        <h1 className="text-base font-bold text-foreground">Create Meal Request</h1>
        <div className="w-16"></div> {/* Spacer */}
      </div>

      <div className="space-y-6">
        {/* Section 1: Where and what to eat? */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
            Where and what to eat?
          </h2>

          {/* Restaurant Search */}
          <div className="relative">
            <label className="block mb-1.5 text-xs font-medium text-foreground">Restaurant</label>
            <div className="flex items-stretch rounded-lg overflow-hidden border border-border shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <input
                type="text"
                placeholder="Search for a restaurant"
                value={restaurantSearch}
                onChange={(e) => {
                  setRestaurantSearch(e.target.value);
                  setShowRestaurantResults(true);
                  if (!e.target.value) {
                    setSelectedRestaurant(null);
                    setSelectedMenuItem(null);
                    setFormData((prev) => ({ ...prev, restaurantId: '', menuItemId: '' }));
                  }
                }}
                onFocus={() => setShowRestaurantResults(true)}
                className="flex-1 h-10 px-3 bg-card text-sm text-foreground placeholder-muted-foreground focus:outline-none"
              />
              <div className="flex items-center justify-center px-3 bg-card border-l border-border">
                <Search size={16} className="text-muted-foreground" />
              </div>
            </div>

            {/* Restaurant Results Dropdown */}
            {showRestaurantResults && restaurantSearch && filteredRestaurants.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {filteredRestaurants.map((restaurant) => (
                  <button
                    key={restaurant.id}
                    onClick={() => handleRestaurantSelect(restaurant)}
                    className="w-full px-3 py-2 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 flex justify-between items-center group"
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{restaurant.name}</p>
                      {restaurant.location && (
                        <p className="text-xs text-muted-foreground">{restaurant.location}</p>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-muted-foreground group-hover:translate-x-1 transition-transform text-lg">chevron_right</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Restaurant Display */}
          {selectedRestaurant && (
            <GlassCard className="py-2 px-3 border-primary/20 bg-primary/5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{selectedRestaurant.name}</h3>
                    {selectedRestaurant.location && (
                      <p className="text-xs text-muted-foreground">{selectedRestaurant.location}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedRestaurant(null);
                    setSelectedMenuItems([]);
                    setRestaurantSearch('');
                    setFormData((prev) => ({ ...prev, restaurantId: '', menuItemIds: [] }));
                  }}
                  className="p-1.5 hover:bg-background/50 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </GlassCard>
          )}

          {/* Menu Selection */}
          {selectedRestaurant && (
            <div className="relative" ref={menuDropdownRef}>
              <button
                onClick={loadMenuItems}
                disabled={isLoadingMenu}
                className="flex w-full items-center justify-between gap-3 rounded-lg bg-card p-3 h-12 hover:bg-muted transition-all border border-border hover:border-primary/30 shadow-sm hover:shadow-md disabled:opacity-50 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Menu Items</p>
                    <p className="truncate text-sm font-medium text-foreground">
                      {selectedMenuItems.length > 0 
                        ? `${selectedMenuItems.length} item${selectedMenuItems.length > 1 ? 's' : ''} selected`
                        : 'Select from Menu'}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                  <span className={`material-symbols-outlined text-[20px] transition-transform ${showMenuItems ? 'rotate-90' : ''}`}>
                    chevron_right
                  </span>
                </div>
              </button>

              {/* Menu Items Dropdown */}
              {showMenuItems && (
                <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-80 overflow-y-auto">
                  {isLoadingMenu ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-sm">Loading menu...</p>
                    </div>
                  ) : menuItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <span className="material-symbols-outlined text-3xl mb-2 opacity-50">no_meals</span>
                      <p className="text-sm">No menu items available</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {menuItems.map((item) => {
                        const isSelected = selectedMenuItems.some((selected) => selected.id === item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleToggleMenuItem(item)}
                            className="w-full text-left bg-background rounded-lg p-2 border border-border hover:border-primary/50 hover:shadow-sm transition-all group mb-1 last:mb-0"
                          >
                            <div className="flex gap-3 items-center">
                              <div className={`flex size-5 shrink-0 items-center justify-center rounded border-2 ${
                                isSelected 
                                  ? 'bg-primary border-primary' 
                                  : 'border-border group-hover:border-primary/50'
                              }`}>
                                {isSelected && <Check size={14} className="text-primary-foreground" />}
                              </div>
                              {item.imageUrl ? (
                                <div className="size-12 rounded-md bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${item.imageUrl})` }} />
                              ) : (
                                <div className="size-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0 group-hover:bg-primary/5 transition-colors">
                                  <span className="material-symbols-outlined text-lg">fastfood</span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                  <p className={`text-sm font-bold truncate pr-2 transition-colors ${
                                    isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
                                  }`}>
                                    {item.name}
                                  </p>
                                  <p className="text-sm font-bold text-primary whitespace-nowrap">{item.price} Birr</p>
                                </div>
                                {item.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Selected Menu Items Display */}
              {selectedMenuItems.length > 0 && (
                <div className="mt-2 space-y-2">
                  {selectedMenuItems.map((item) => (
                    <div key={item.id} className="bg-card rounded-lg p-2 border border-border shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {item.imageUrl ? (
                            <div className="size-8 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }} />
                          ) : (
                            <div className="size-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                              <span className="material-symbols-outlined text-base">fastfood</span>
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-foreground">{item.name}</p>
                            <p className="text-xs text-primary font-medium">{item.price} Birr</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleMenuItem(item)}
                          className="p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Section 2: Who's joining? */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
            Who's joining?
          </h2>

          {!hasGenderPreference ? (
            /* Anonymous Mode - Default */
            <div className="space-y-2">
              <div className="bg-card rounded p-2 flex flex-col items-start gap-1">
                <p className="text-xs font-medium text-muted-foreground">Anonymous</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        peopleNeeded: Math.max(1, prev.peopleNeeded - 1),
                      }))
                    }
                    className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-lg font-bold text-foreground w-6 text-center">{formData.peopleNeeded}</span>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, peopleNeeded: prev.peopleNeeded + 1 }))
                    }
                    className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setHasGenderPreference(true);
                  setFormData((prev) => ({
                    ...prev,
                    maleCount: 0,
                    femaleCount: 0,
                  }));
                }}
                className="text-xs text-primary font-medium"
              >
                + Add gender preference
              </button>
            </div>
          ) : (
            /* Gender Preference Mode */
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-1">
                {/* Male */}
                <div className="bg-card rounded p-2 flex flex-col items-start gap-1">
                  <p className="text-xs font-medium text-muted-foreground">Male</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          maleCount: Math.max(0, prev.maleCount - 1),
                        }))
                      }
                      className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-lg font-bold text-foreground w-6 text-center">{formData.maleCount}</span>
                    <button
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, maleCount: prev.maleCount + 1 }))
                      }
                      className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Female */}
                <div className="bg-card rounded p-2 flex flex-col items-start gap-1">
                  <p className="text-xs font-medium text-muted-foreground">Female</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          femaleCount: Math.max(0, prev.femaleCount - 1),
                        }))
                      }
                      className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-lg font-bold text-foreground w-6 text-center">{formData.femaleCount}</span>
                    <button
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, femaleCount: prev.femaleCount + 1 }))
                      }
                      className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setHasGenderPreference(false);
                  setFormData((prev) => ({
                    ...prev,
                    maleCount: 0,
                    femaleCount: 0,
                    peopleNeeded: Math.max(1, prev.maleCount + prev.femaleCount),
                  }));
                }}
                className="text-xs text-muted-foreground font-medium"
              >
                Remove preference
              </button>
            </div>
          )}
        </section>

        {/* Section 3: When and how much? */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
            When and how much?
          </h2>

          {/* Date & Time Picker */}
          <GlassCard className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm text-foreground">Select Date & Time</h3>
              </div>

                {/* Single Row: Date, Time Input, Toggle, and AM/PM */}
                <div className="flex items-center gap-2">
                  {/* Date Selection */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => setFormData((prev) => ({ ...prev, date: 'zare' }))}
                      className={`py-1.5 px-3 rounded text-xs font-medium border ${formData.date === 'zare'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border'
                        }`}
                    >
                      Zare
                    </button>
                    <button
                      onClick={() => setFormData((prev) => ({ ...prev, date: 'nege' }))}
                      className={`py-1.5 px-3 rounded text-xs font-medium border ${formData.date === 'nege'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border'
                        }`}
                    >
                      Nege
                    </button>
                  </div>

                  {/* Time Input */}
                  <div className="flex-1">
                    <WheelTimePicker
                      value={formData.time}
                      onChange={(value) => setFormData((prev) => ({ ...prev, time: value }))}
                      format={formData.timeFormat as '12' | '24'}
                      onFormatChange={(newFormat) => setFormData((prev) => ({ ...prev, timeFormat: newFormat }))}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
        </section>

        {/* Price Display (calculated from menu) */}
        {selectedMenuItems.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">4</span>
              Price Breakdown
            </h2>
            <GlassCard className="py-3 px-4 border-primary/10">
              <div className="space-y-2 text-xs">
                {selectedMenuItems.map((item) => {
                  const price = typeof item.price === 'number' ? item.price : parseFloat(item.price || '0');
                  return (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-medium text-foreground">{price} Birr</span>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center pt-2 border-t border-border mt-1">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-medium text-foreground">
                    {selectedMenuItems.reduce((sum, item) => {
                      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price || '0');
                      return sum + price;
                    }, 0).toFixed(2)} Birr
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total ({hasGenderPreference ? 1 + formData.maleCount + formData.femaleCount : 1 + formData.peopleNeeded} people)</span>
                  <span className="font-medium text-foreground">{calculateTotalPrice().toFixed(2)} Birr</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border mt-1">
                  <span className="font-bold text-foreground text-sm">Per Person</span>
                  <span className="font-bold text-primary text-lg">{calculateSplitAmount().toFixed(2)} Birr</span>
                </div>
              </div>
            </GlassCard>
          </section>
        )}
      </div>

      {/* Floating Action Button */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-3 z-40 flex justify-center">
        <div className="w-full max-w-xs">
          <GlassButton
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="w-full rounded bg-primary py-3 text-center text-sm font-bold text-primary-foreground disabled:opacity-50 shadow-lg shadow-primary/25"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating...</span>
              </div>
            ) : (
              'Create Meal Request'
            )}
          </GlassButton>
        </div>
      </footer>
    </div>
  );
}
