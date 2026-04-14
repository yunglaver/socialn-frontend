import { getSocket } from '../core/socket.js';

export async function authWs() {

    const socket = getSocket();
    console.log('auth websocket reached')
    socket.send(JSON.stringify({
        type: 'auth'
    }));
}

export async function logoutWs() {

    const socket = getSocket();
    console.log('auth websocket reached')
    socket.send(JSON.stringify({
        type: 'auth'
    }));
}