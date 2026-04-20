import { apiFetch } from "../core/api.js";

export async function getChats(page = 1) {
    const token = localStorage.getItem('token');

    const response = await apiFetch(
        `/chats?page=${page}&limit=20`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    return await response.json();
}

export async function startChat(receiverUserId) {
    const token = localStorage.getItem('token');

    const response = await apiFetch("/chats", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            receiverUserId
        })
    });

    return await response.json();
}