import { create } from 'zustand';
import { getChats } from '../services/chat.service.js';
import { getMessages } from '../services/message.service.js';

export const useChatsStore = create((set) => ({
  chats: [],
  messages: [],

  pageChats: 1,
  pageMessages: 1,

  hasMoreChats: true,
  hasMoreMessages: true,

  currentChatId: 0,

  setChats: (updater) =>
    set((state) => ({
      chats: typeof updater === 'function' ? updater(state.chats) : updater,
    })),

  setPageChats: (page) => set({ pageChats: page }),
  setPageMessages: (page) => set({ pageMessages: page }),

  fetchChats: async (page = 1) => {
    const data = await getChats(page);

    set((state) => ({
      chats: page === 1 ? data : [...state.chats, ...data],
      pageChats: page,
      hasMoreChats: data.length > 0,
    }));
  },

  fetchMessages: async (chatId, page = 1) => {
    const data = await getMessages(chatId, page);

    set((state) => ({
      messages:
        page === 1
          ? data.slice().reverse()
          : [...data.slice().reverse(), ...state.messages],
      pageMessages: page,
      hasMoreMessages: data.length > 0,
    }));
  },

  setCurrentChat: (chatId) =>
    set({
      currentChatId: chatId,
    }),
}));
