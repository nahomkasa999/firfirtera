import { create } from 'zustand';

interface Meal {
  id: string;
  description: string;
  totalCost: string;
  splitAmount: string;
  requiredParticipants: number;
  currentParticipants: number;
  status: string;
  mealTime: string;
  mealTimeText?: string;
  restaurant?: { id: string; name: string; imageUrl?: string | null; location?: string };
  menuItem?: { id: string; name: string; price?: number; imageUrl?: string | null };
  genderPreferences?: { male: number; female: number };
  organizer: { id: string; username?: string; firstName?: string };
  participants?: { user: { firstName?: string; username?: string } }[];
}

interface MealState {
  organized: Meal[];
  joined: Meal[];
  isLoading: boolean;
  setOrganized: (meals: Meal[]) => void;
  setJoined: (meals: Meal[]) => void;
  addMeal: (meal: Meal) => void;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  removeMeal: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useMealStore = create<MealState>((set) => ({
  organized: [],
  joined: [],
  isLoading: false,
  setOrganized: (meals) => set({ organized: meals }),
  setJoined: (meals) => set({ joined: meals }),
  addMeal: (meal) => set((state) => ({ organized: [...state.organized, meal] })),
  updateMeal: (id, updates) =>
    set((state) => ({
      organized: state.organized.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      joined: state.joined.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),
  removeMeal: (id) =>
    set((state) => ({
      organized: state.organized.filter((m) => m.id !== id),
      joined: state.joined.filter((m) => m.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

