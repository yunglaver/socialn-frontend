import { create } from 'zustand';

export const useSocketStore = create((set) => ({
  isConnected: false,
  isAuthed: false,

  setConnected: (value) => set({ isConnected: value }),
  setAuthed: (value) => set({ isAuthed: value }),
}));
