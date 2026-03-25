import { create } from 'zustand';
import Cookies from 'js-cookie';
import { authAPI, cartAPI } from '../lib/api';

// ============ Auth Store ============
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    Cookies.set('akm-token', data.accessToken, { expires: 7 });
    Cookies.set('akm-user', JSON.stringify(data.user), { expires: 7 });
    set({ user: data.user, token: data.accessToken });
  },

  register: async (registerData) => {
    const { data } = await authAPI.register(registerData);
    Cookies.set('akm-token', data.accessToken, { expires: 7 });
    Cookies.set('akm-user', JSON.stringify(data.user), { expires: 7 });
    set({ user: data.user, token: data.accessToken });
  },

  logout: () => {
    Cookies.remove('akm-token');
    Cookies.remove('akm-user');
    set({ user: null, token: null });
  },

  loadUser: () => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('akm-token');
      const userData = Cookies.get('akm-user');
      if (token && userData) {
        set({ user: JSON.parse(userData), token, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    }
  },
}));

// ============ Cart Store ============
interface CartItem {
  _id: string;
  product: any;
  color: string;
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (data: any) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const { data } = await cartAPI.get();
      set({ items: data.items || [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (itemData) => {
    const { data } = await cartAPI.addItem(itemData);
    set({ items: data.items || [] });
  },

  updateItem: async (itemId, quantity) => {
    const { data } = await cartAPI.updateItem(itemId, { quantity });
    set({ items: data.items || [] });
  },

  removeItem: async (itemId) => {
    const { data } = await cartAPI.removeItem(itemId);
    set({ items: data.items || [] });
  },

  clearCart: async () => {
    await cartAPI.clear();
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0,
    );
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));

// ============ UI Store ============
interface UIState {
  isSidebarOpen: boolean;
  isCartOpen: boolean;
  toggleSidebar: () => void;
  toggleCart: () => void;
  closeSidebar: () => void;
  closeCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isCartOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
}));
