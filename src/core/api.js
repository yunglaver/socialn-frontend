export const BACKEND_ORIGIN = '192.168.0.128:3000';
export const BASE_API_URL = `http://${BACKEND_ORIGIN}`;

/**
 * @param {string} url
 * @param {RequestInit} options
 */
export function apiFetch(url, options) {
  return fetch(`${BASE_API_URL}${url}`, options);
}
