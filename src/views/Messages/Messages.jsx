import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getMessages } from "../../services/message.service.js";
import { sendSocketMessage, subscribe } from "../../core/socket.js";

export default function Messages() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!chatId) return;

        let joined = false; // ✅ чтобы не спамить join_chat

        async function load() {
            const data = await getMessages(chatId);
            setMessages(data);
        }

        void load();

        const unsubscribe = subscribe((data) => {

            // ✅ КЛЮЧЕВОЕ: join_chat строго после auth
            if (data.type === "auth_success" && !joined) {
                joined = true;

                sendSocketMessage({
                    type: "join_chat",
                    chatId
                });

                console.log("JOIN CHAT SENT AFTER AUTH", chatId);
            }

            // ✅ теперь сообщения точно будут приходить
            if (data.type !== "message") return;

            const msg = data.payload;
            if (!msg) return;

            if (String(msg.chatId) !== String(chatId)) return;

            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };

    }, [chatId]);

    const handleSend = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            const text = e.target.value.trim();
            if (!text) return;

            sendSocketMessage({
                type: "message",
                chatId,
                text
            });

            e.target.value = "";
        }
    };

    return (
        <div>
            <div>
                {messages.map((m, i) => (
                    <div key={i}>{m.text}</div>
                ))}
            </div>

            <textarea onKeyDown={handleSend} />
        </div>
    );
}