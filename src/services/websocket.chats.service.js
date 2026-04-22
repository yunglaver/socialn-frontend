import { sendSocketMessage } from "../core/socket.js";

export function openChatWs(chatId) {
    sendSocketMessage({
        type: "join_chat",
        chatId: String(chatId),
    });
}

export function closeChatWs(chatId) {
    sendSocketMessage({
        type: "leave_chat",
        chatId: String(chatId),
    });
}