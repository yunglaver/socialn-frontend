import { apiFetch } from '../core/api.js';
import { connectSocket, getSocket } from '../core/socket.js';

export async function authService(login, password) {
  const response = await apiFetch('/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: login,
      password: password,
    }),
  });

  const result = await response.json();

  if (result.token) {
    localStorage.setItem('token', result.token);
    localStorage.setItem('currentUserId', result.userId);
    localStorage.setItem('currentUserLogin', result.userLogin);
  }

  return result;
}

export async function registerService(login, password) {
  const response = await apiFetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: login,
      password: password,
    }),
  });

  return await response.json();
}

export async function logoutService() {
  const token = localStorage.getItem('token');

  const response = await apiFetch('/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const socket = getSocket();
  if (socket) {
    socket.close(1000, 'offline');
  }

  localStorage.clear();
  return await response.json();
}
