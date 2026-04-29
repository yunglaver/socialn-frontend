import { create } from 'zustand';
import { getUsers } from '../services/users.service.js';

export const useUsersStore = create((set, get) => ({
    users: [],
    pageUsers: 1,
    hasMoreUsers: true,
    isLoadingUsers: false,
    loadingPages: new Set(),

    fetchUsers: async (page = 1) => {
        const { loadingPages } = get();

        if (loadingPages.has(page)) return;

        set((state) => ({
            isLoadingUsers: true,
            loadingPages: new Set(state.loadingPages).add(page),
        }));

        try {
            const result = await getUsers(page);
            const newUsers = Array.isArray(result) ? result : result.data ?? [];

            set((state) => {
                const merged =
                    page === 1 ? newUsers : [...state.users, ...newUsers];

                const uniqueUsers = Array.from(
                    new Map(merged.map((user) => [user.id, user])).values()
                );

                return {
                    users: uniqueUsers,
                    pageUsers: Math.max(state.pageUsers, page),
                    hasMoreUsers: Array.isArray(result)
                        ? newUsers.length > 0
                        : Boolean(result.hasMore),
                };
            });
        } catch (err) {
            console.error('Ошибка загрузки пользователей:', err);
        } finally {
            set((state) => {
                const nextLoadingPages = new Set(state.loadingPages);
                nextLoadingPages.delete(page);

                return {
                    isLoadingUsers: nextLoadingPages.size > 0,
                    loadingPages: nextLoadingPages,
                };
            });
        }
    },
}));