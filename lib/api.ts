import { getInitData } from './telegram';

// Get API base URL - use local API if on localhost or if env var is set
function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://firfir-tera-bot.vercel.app/api/miniapp';
  }

  // Check if we should use local API
  const useLocal = process.env.NEXT_PUBLIC_USE_LOCAL_DB === 'true' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  return useLocal
    ? '/api'
    : (process.env.NEXT_PUBLIC_API_URL || 'https://firfir-tera-bot.vercel.app/api/miniapp');
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Only make API calls on the client side
  if (typeof window === 'undefined') {
    throw new Error('API calls can only be made on the client side');
  }

  const initData = getInitData();
  const API_BASE_URL = getApiBaseUrl();

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': initData,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Handle network errors gracefully
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error:', error);
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    throw error;
  }
}

// API methods
export const api = {
  // Auth
  getProfile: () => apiRequest<{ user: any; noShowCount: number }>('/user/profile'),
  updateProfile: (data: any) => apiRequest<{ user: any }>('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Restaurants
  getRestaurants: () => apiRequest<{ restaurants: any[] }>('/restaurants'),
  getRestaurant: (id: string) => apiRequest<{ restaurant: any }>(`/restaurants/${id}`),
  getMenuItems: (restaurantId: string) =>
    apiRequest<{ menuItems: any[] }>(`/menus/${restaurantId}`),

  // Meals
  getMeals: () => apiRequest<{ organized: any[]; joined: any[] }>('/meals'),
  getMeal: (id: string) => apiRequest<{ meal: any }>(`/meals/${id}`),
  createMeal: (data: any) => {
    // Use /meals for local API, /meals/create for external API
    const endpoint = (typeof window !== 'undefined' &&
      (process.env.NEXT_PUBLIC_USE_LOCAL_DB === 'true' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'))
      ? '/meals'
      : '/meals/create';
    return apiRequest<{ meal: any }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  joinMeal: (id: string) =>
    apiRequest<{ success: boolean }>(`/meals/${id}/join`, { method: 'POST' }),
  cancelMeal: (id: string) =>
    apiRequest<{ success: boolean }>(`/meals/${id}/cancel`, { method: 'POST' }),

  // Admin
  adminGetRestaurants: () => apiRequest<{ restaurants: any[] }>('/admin/restaurants'),
  adminCreateRestaurant: (data: any) =>
    apiRequest<{ restaurant: any }>('/admin/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  adminUpdateRestaurant: (id: string, data: any) =>
    apiRequest<{ restaurant: any }>(`/admin/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  adminDeleteRestaurant: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/restaurants/${id}`, { method: 'DELETE' }),
  adminGetMenuItems: (restaurantId: string) =>
    apiRequest<{ menuItems: any[] }>(`/admin/menus/${restaurantId}`),
  adminCreateMenuItem: (data: any) =>
    apiRequest<{ menuItem: any }>('/admin/menus', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  adminUpdateMenuItem: (id: string, data: any) =>
    apiRequest<{ menuItem: any }>(`/admin/menus/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  adminDeleteMenuItem: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/menus/${id}`, { method: 'DELETE' }),
};

