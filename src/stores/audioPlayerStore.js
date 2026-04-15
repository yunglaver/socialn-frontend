import { create } from 'zustand';
import {getMyMusic, getOtherMusic, likeSong, removeSong} from "../services/music.service.js";

export const useAudioPlayerStore = create((set) => ({

    mySongs: [],
    allSongs:[],
    currentTab: "my",
    currentPlaylist: [],
    playingId: null,
    isPlaying: false,

    fetchMyMusic: async () => {
        const data = await getMyMusic();
        set({ mySongs: data });
    },

    fetchAllMusic: async () => {
        const data = await getOtherMusic();
        set({ allSongs: data });
    },

    fetchLikeSong: async (songId) => {
        await likeSong(songId);
    },

    fetchRemoveSong: async (songId) => {
        await removeSong(songId);
    },

    setTrack: (id) => set({
        playingId: id,
    }),

    setCurrentTab: (tab) => set({
        currentTab: tab,
    }),

    togglePlay: () => set((state) => ({
        isPlaying: !state.isPlaying
    })),
}));