import { create } from 'zustand';
import {
  getMyMusic,
  getOtherMusic,
  likeSong,
  removeSong,
} from '../services/music.service.js';

export const useAudioPlayerStore = create((set) => ({
  mySongs: [],
  allSongs: [],
  pageMy: 1,
  pageAll: 1,
  hasMoreMy: true,
  hasMoreAll: true,
  setPageMy: (page) => set({ pageMy: page }),
  setPageAll: (page) => set({ pageAll: page }),
  currentTab: 'my',
  currentPlaylist: [],
  playingId: null,
  isPlaying: false,

  fetchMyMusic: async (page = 1) => {
    const data = await getMyMusic(page);

    set((state) => ({
      mySongs: page === 1 ? data : [...state.mySongs, ...data],
      pageMy: page,
      hasMoreMy: data.length > 0,
    }));
  },

  fetchAllMusic: async (page = 1) => {
    const data = await getOtherMusic(page);

    set((state) => ({
      allSongs: page === 1 ? data : [...state.allSongs, ...data],
      pageAll: page,
      hasMoreAll: data.length > 0,
    }));
  },

  fetchLikeSong: async (songId) => {
    await likeSong(songId);
  },

  fetchRemoveSong: async (songId) => {
    await removeSong(songId);
  },

  setTrack: (id) =>
    set({
      playingId: id,
    }),

  setCurrentTab: (tab) =>
    set({
      currentTab: tab,
    }),

  togglePlay: () =>
    set((state) => ({
      isPlaying: !state.isPlaying,
    })),

  resetPlayer: () =>
      set({
        mySongs: [],
        allSongs: [],
        currentTab: 'my',
        currentPlaylist: [],
        playingId: null,
        isPlaying: false,
      }),
}));
