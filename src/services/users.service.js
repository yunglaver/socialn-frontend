import {apiFetch} from "../core/api.js";

export async function getUsers(page = 1) {
    const token = localStorage.getItem('token');

    const response = await apiFetch(
        `/users?page=${page}&limit=20`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Ошибка при получении пользователей');
    }

    return await response.json();
}