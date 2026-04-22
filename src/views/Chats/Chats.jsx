import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";

import styles from "./Chats.module.scss";
import Chat from "../../components/Chats/Chat.jsx";
import { useChatsStore } from "../../stores/chats.store.js";
import { BASE_API_URL } from "../../core/api.js";
import defaultAvatar from "../../assets/icons/default-avatar.svg";
import { subscribe } from "../../core/socket.js";

export default function Chats() {
    const chats = useChatsStore((s) => s.chats);
    const pageChats = useChatsStore((s) => s.pageChats);
    const hasMoreChats = useChatsStore((s) => s.hasMoreChats);
    const setPageChats = useChatsStore((s) => s.setPageChats);
    const currentChatId = useChatsStore((s) => s.currentChatId);
    const fetchChats = useChatsStore((s) => s.fetchChats);
    const setCurrentChat = useChatsStore((s) => s.setCurrentChat);
    const setChats = useChatsStore((s) => s.setChats);

    const navigate = useNavigate();
    const location = useLocation();
    const virtuosoRef = useRef(null);
    const loadingMoreRef = useRef(false);

    useEffect(() => {
        void fetchChats(1);
    }, [fetchChats]);

    useEffect(() => {
        if (!currentChatId) return;
        navigate(`/m/chats/${currentChatId}`);
    }, [currentChatId, navigate]);

    useEffect(() => {
        const unsubscribe = subscribe((data) => {
            if (!data) return;

            if (data.type === "chat_updated") {
                const updatedChat = data.payload;
                if (!updatedChat) return;

                setChats((prev) => {
                    const exists = prev.some((chat) => String(chat.id) === String(updatedChat.id));

                    if (!exists) {
                        return [updatedChat, ...prev];
                    }

                    const next = prev.map((chat) =>
                        String(chat.id) === String(updatedChat.id)
                            ? { ...chat, ...updatedChat }
                            : chat
                    );

                    next.sort((a, b) => {
                        const aTime = a.lastMessageCreatedAt ? new Date(a.lastMessageCreatedAt).getTime() : 0;
                        const bTime = b.lastMessageCreatedAt ? new Date(b.lastMessageCreatedAt).getTime() : 0;
                        return bTime - aTime;
                    });

                    return next;
                });

                return;
            }

            if (data.type === "user_online") {
                const userId = data.payload?.userId;
                if (!userId) return;

                setChats((prev) =>
                    prev.map((chat) =>
                        String(chat.userId) === String(userId)
                            ? { ...chat, isOnline: true }
                            : chat
                    )
                );

                return;
            }

            if (data.type === "user_offline") {
                const userId = data.payload?.userId;
                if (!userId) return;

                setChats((prev) =>
                    prev.map((chat) =>
                        String(chat.userId) === String(userId)
                            ? { ...chat, isOnline: false }
                            : chat
                    )
                );
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [setChats]);

    const loadMoreChats = async () => {
        if (loadingMoreRef.current) return;
        if (!hasMoreChats) return;

        loadingMoreRef.current = true;

        try {
            const nextPage = pageChats + 1;
            setPageChats(nextPage);
            await fetchChats(nextPage);
        } finally {
            loadingMoreRef.current = false;
        }
    };

    return (
        <div className={styles.chatPage}>
            <div className={styles.parentScrollBlock}>
                <Virtuoso
                    ref={virtuosoRef}
                    className={styles.chatsList}
                    data={chats}
                    endReached={() => {
                        void loadMoreChats();
                    }}
                    computeItemKey={(index, item) => item?.id ?? `fallback-${index}`}
                    defaultItemHeight={70}
                    increaseViewportBy={{ top: 300, bottom: 500 }}
                    overscan={{ main: 300, reverse: 300 }}
                    style={{ height: "100%", width: "100%" }}
                    itemContent={(index, c) => (
                        <Chat
                            isActive={location.pathname === `/m/chats/${c.id}`}
                            onClick={() => setCurrentChat(c.id)}
                            chatPic={c.userPic ? `${BASE_API_URL}${c.userPic}_sm.webp` : defaultAvatar}
                            isOnline={c.isOnline}
                            chatUserName={c.chatName}
                            chatLastMessage={c.lastMessageText}
                            lastMessageTime={c.lastMessageCreatedAt}
                        />
                    )}
                />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <Outlet />
            </div>
        </div>
    );
}