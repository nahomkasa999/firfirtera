import { create } from 'zustand';
import { getUser } from '@/lib/telegram';

interface User {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  campus?: string;
  gender?: string;
  collegeYear?: string;
  department?: string;
  religion?: string;
}

interface AuthState {
  user: User | null;
  noShowCount: number;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setNoShowCount: (count: number) => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  noShowCount: 0,
  isLoading: true,
  setUser: (user) => set({ user }),
  setNoShowCount: (count) => set({ noShowCount: count }),
  init: () => {
    const telegramUser = getUser();
    if (telegramUser) {
      set({ user: telegramUser as User, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));

