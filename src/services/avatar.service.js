import { apiFetch } from '../core/api.js';

export async function uploadAvatar(formData) {
  const token = localStorage.getItem('token');

  const response = await apiFetch('/avatar', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return await response.json();
}

export async function loadAvatar() {
  const token = localStorage.getItem('token');
  const response = await apiFetch(`/avatar`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
