import { getSocket } from '../core/socket.js';

export function openChatWs(chatId) {

    const socket = getSocket();

    socket.send(JSON.stringify({
        type: 'join_chat',
        chatId
    }));
}