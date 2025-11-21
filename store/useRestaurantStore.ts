import { create } from 'zustand';

interface MenuItem {
  id: string;
  name: string;
  price?: number;
  description?: string;
  imageUrl?: string;
}

interface Restaurant {
  id: string;
  name: string;
  location?: string;
  imageUrl?: string;
  menuItems?: MenuItem[];
}

interface CreateFormState {
  restaurantId: string;
  menuItemIds: string[];
  date: string;
  time: string;
}

interface RestaurantState {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  selectedMenuItem: MenuItem | null; // Keep for backward compatibility
  selectedMenuItems: MenuItem[]; // New: multiple selections
  isLoading: boolean;
  createFormState: CreateFormState | null; // Track form completion state
  setRestaurants: (restaurants: Restaurant[]) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  setSelectedMenuItem: (item: MenuItem | null) => void; // Keep for backward compatibility
  setSelectedMenuItems: (items: MenuItem[]) => void;
  toggleMenuItem: (item: MenuItem) => void; // Toggle item in selection
  setCreateFormState: (state: CreateFormState | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  selectedRestaurant: null,
  selectedMenuItem: null,
  selectedMenuItems: [],
  isLoading: false,
  createFormState: null,
  setRestaurants: (restaurants) => set({ restaurants }),
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  setSelectedMenuItem: (item) => set({ selectedMenuItem: item }),
  setSelectedMenuItems: (items) => set({ selectedMenuItems: items }),
  toggleMenuItem: (item) => set((state) => {
    const isSelected = state.selectedMenuItems.some((i) => i.id === item.id);
    if (isSelected) {
      return { selectedMenuItems: state.selectedMenuItems.filter((i) => i.id !== item.id) };
    } else {
      return { selectedMenuItems: [...state.selectedMenuItems, item] };
    }
  }),
  setCreateFormState: (state) => set({ createFormState: state }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

