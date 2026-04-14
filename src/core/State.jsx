export const state = {
    isLogged: false,

    currentUserId: Number(localStorage.getItem('currentUserId')),

    currentUserLogin: localStorage.getItem('currentUserLogin'),

    users: [],

    chats: [],

    activeChatId: null,

    musicPlayer: {
        currentTrackId: null,
        isPlaying: false
    },

    messagesByChat: {},
};