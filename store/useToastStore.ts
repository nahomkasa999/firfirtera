import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };
    
    set((state) => ({ toasts: [...state.toasts, toast] }));
    
    // Auto remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  success: (message) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type: 'success', duration: 3000 };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
  error: (message) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type: 'error', duration: 5000 };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 5000);
  },
  info: (message) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type: 'info', duration: 4000 };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  warning: (message) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type: 'warning', duration: 4000 };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
}));

