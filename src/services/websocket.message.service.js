import { getSocket } from '../core/socket.js';

export function sendMessageWs(chatId, text) {

    const socket = getSocket();

    socket.send(JSON.stringify({
        type: 'message',
        chatId,
        text
    }));
}
