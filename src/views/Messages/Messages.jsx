import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Messages.module.scss"
import { useVirtualizer } from "@tanstack/react-virtual";
import { getMessages } from "../../services/message.service.js";
import { sendSocketMessage, subscribe } from "../../core/socket.js";
import SendMessageBlock from "../../components/Messages/SendMessageBlock.jsx";
import Message from "../../components/Messages/Message.jsx";
import {BASE_API_URL} from "../../core/api.js";
import defaultAvatar from "../../assets/icons/default-avatar.svg";

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

            if (data.type === "auth_success" && !joined) {
                joined = true;

                sendSocketMessage({
                    type: "join_chat",
                    chatId
                });

                console.log("JOIN CHAT SENT AFTER AUTH", chatId);
            }

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

    const rowVirtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 70,
        gap: 0,
    });
    const virtualItems = rowVirtualizer.getVirtualItems();

    // infinite scroll
    useEffect(() => {
        const lastItem = virtualItems[virtualItems.length - 1];
        if (!lastItem) return;

        if (lastItem.index >= messages.length - 1 && hasMoreMessages) {
            const nextPage = pageMessages + 1;
            setPageMessages(nextPage);
            void fetchMessages(nextPage);
        }
    }, [virtualItems]);

    return (
        <div
            className={styles.background}
        >
            <div
                ref={parentRef}
                className={styles.parentScrollBlock}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        position: "relative",
                    }}
                >
                    {virtualItems.map((virtualRow) => {
                        const m = messages[virtualRow.index];
                        if (!m) return null;

                        return (
                            <div
                                key={m.id}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <Message
                                    messageText={m.text}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <SendMessageBlock
                className={styles.sendBlock}
                onKeyDown={handleSend}
            />
        </div>
    );
}