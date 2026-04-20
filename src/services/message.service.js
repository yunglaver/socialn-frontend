import {apiFetch} from "../core/api.js";

export async function getMessages(chatId) {
    const token = localStorage.getItem('token');
    const response = await apiFetch(
        `/messages?chatId=${chatId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    return await response.json();
}

export async function sendMessages(chatId, text) {
    const token = localStorage.getItem('token');
    const response = await apiFetch(`/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            text: text,
            chatId: chatId
        })
    });

    return await response.json();
}





