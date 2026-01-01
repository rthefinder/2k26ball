import { create } from 'zustand';
import { PublicKey, Connection } from '@solana/web3.js';

interface EventStore {
  events: Array<{
    type: string;
    timestamp: number;
    data: Record<string, any>;
  }>;
  config: Record<string, any> | null;
  loading: boolean;
  error: string | null;

  addEvent: (event: any) => void;
  setConfig: (config: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchEvents: () => Promise<void>;
  fetchConfig: () => Promise<void>;
  clear: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  config: null,
  loading: false,
  error: null,

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 100),
    })),

  setConfig: (config) => set({ config }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchEvents: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      set({ events: data.events || [], error: null });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchConfig: async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      set({ config: data.config || null, error: null });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  clear: () =>
    set({
      events: [],
      config: null,
      loading: false,
      error: null,
    }),
}));
