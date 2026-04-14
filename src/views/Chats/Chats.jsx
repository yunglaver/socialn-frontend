import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getChats } from "../../services/chat.service.js";
import { subscribe } from "../../core/socket.js";

export default function Chats() {
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            const data = await getChats();
            setChats(data);
        }

        load();

        // ✅ websocket обновление (аналог bindChatsView)
        const unsubscribe = subscribe((data) => {
            if (data.type !== "chat_updated") return;

            setChats((prev) => {
                // простое обновление списка
                return [...prev];
            });
        });

        return () => unsubscribe && unsubscribe();
    }, []);

    return (
        <div style={{ display: "flex", height: "100%" }}>

            {/* ✅ ЛЕВАЯ КОЛОНКА (чаты) */}
            <div style={{ width: "300px", borderRight: "1px solid #ccc" }}>
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => navigate(`/m/chats/${chat.id}`)} // ✅ ВАЖНО: теперь другой путь
                        style={{ padding: "10px", cursor: "pointer" }}
                    >
                        {chat.chatName}
                    </div>
                ))}
            </div>

            {/* ✅ ПРАВАЯ КОЛОНКА (messages) */}
            <div style={{ flex: 1 }}>
                <Outlet /> {/* ✅ сюда рендерится Messages */}
            </div>

        </div>
    );
}