import { BACKEND_ORIGIN } from "./api.js";

export let socket = null;
let listeners = [];
let isAuth = false;

let openPromise = null;
let authPromise = null;
let resolveAuthPromise = null;

function createAuthPromise() {
    authPromise = new Promise((resolve) => {
        resolveAuthPromise = resolve;
    });
}

createAuthPromise();

export function connectSocket() {
    const token = localStorage.getItem("token");

    if (socket && socket.readyState !== WebSocket.CLOSED) {
        return;
    }

    socket = new WebSocket(`ws://${BACKEND_ORIGIN}`);

    openPromise = new Promise((resolve, reject) => {
        socket.onopen = () => {
            console.log("socket is connected");

            socket.send(JSON.stringify({
                type: "auth",
                token,
            }));

            resolve();
        };

        socket.onerror = (error) => {
            console.error("WS error", error);
            reject(error);
        };
    });

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "auth_success") {
            isAuth = true;

            if (resolveAuthPromise) {
                resolveAuthPromise();
            }

            listeners.forEach((fn) => fn({ type: "socket_ready" }));
        }

        listeners.forEach((fn) => fn(data));
    };

    socket.onclose = () => {
        console.log("WS disconnected");
        isAuth = false;
        socket = null;
        openPromise = null;
        createAuthPromise();
    };
}

export async function waitForSocketReady() {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        connectSocket();
    }

    if (!socket) {
        throw new Error("Socket was not created");
    }

    if (socket.readyState === WebSocket.CONNECTING) {
        await openPromise;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        throw new Error("Socket is not open");
    }

    if (!isAuth) {
        await authPromise;
    }

    return socket;
}

export async function sendSocketMessage(data) {
    const msg = JSON.stringify(data);
    const readySocket = await waitForSocketReady();
    readySocket.send(msg);
}

export function subscribe(callback) {
    listeners.push(callback);

    return () => {
        listeners = listeners.filter((fn) => fn !== callback);
    };
}

export function getSocket() {
    return socket;
}