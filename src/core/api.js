export const BACKEND_ORIGIN =
  import.meta.env.VITE_BACKEND_ORIGIN || 'localhost:3000';

export const BASE_API_URL = `http://${BACKEND_ORIGIN}`;

export function apiFetch(url, options) {
  return fetch(`${BASE_API_URL}${url}`, options);
}

console.log('ENV:', import.meta.env.VITE_BACKEND_ORIGIN);
console.log('BASE_API_URL:', BASE_API_URL);