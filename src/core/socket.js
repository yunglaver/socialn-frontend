import { BACKEND_ORIGIN } from "./api.js";

export let socket = null;
let listeners = [];
let isAuth = false;

export function connectSocket() {
    const token = localStorage.getItem("token");

    if (socket && socket.readyState !== WebSocket.CLOSED) {
        return;
    }

    socket = new WebSocket(`ws://${BACKEND_ORIGIN}`)

    socket.onopen = () => {
        console.log("socket is connected");

        socket.send(JSON.stringify({
            type: "auth",
            token
        }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "auth_success") {
            isAuth = true;

            listeners.forEach(fn => fn({ type: "socket_ready" }));
        }

        listeners.forEach((fn) => fn(data));
    };

    socket.onclose = () => {
        console.log("WS disconnected");
        isAuth = false;
        socket = null;
    };
}

export function sendSocketMessage(data) {
    const msg = JSON.stringify(data);

    if (!socket || socket.readyState !== WebSocket.OPEN || !isAuth) {
        return;
    }
    socket.send(msg);
}

export function subscribe(callback) {
    listeners.push(callback);

    return () => {
        listeners = listeners.filter(fn => fn !== callback);
    };
}

export function getSocket() {
    return socket;
}