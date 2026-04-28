import { apiFetch } from '../core/api.js';

export async function getMessages(chatId, page = 1, limit = 40) {
  const token = localStorage.getItem('token');

  const response = await apiFetch(
    `/messages?chatId=${chatId}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to load messages');
  }

  return await response.json();
}

export async function sendMessages(chatId, text) {
  const token = localStorage.getItem('token');

  const response = await apiFetch(`/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      chatId,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return await response.json();
}
