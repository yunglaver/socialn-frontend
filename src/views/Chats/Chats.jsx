import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./Chats.module.scss";
import Chat from "../../components/Chats/Chat";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useChatsStore } from "../../stores/ChatsStore.js";
import { BASE_API_URL } from "../../core/api.js";
import defaultAvatar from "../../assets/icons/default-avatar.svg"

export default function Chats() {

    const chats = useChatsStore(s => s.chats);
    const pageChats = useChatsStore(s => s.pageChats);
    const hasMoreChats = useChatsStore(s => s.hasMoreChats);
    const setPageChats = useChatsStore(s => s.setPageChats);
    const currentChatId = useChatsStore(s => s.currentChatId);
    const fetchChats = useChatsStore(s => s.fetchChats);
    const setCurrentChat = useChatsStore(s => s.setCurrentChat);

    const navigate = useNavigate();
    const parentRef = useRef(null);

    useEffect(() => {
        void fetchChats(1);
        console.log('ЧАТЫ:',chats)
    }, []);

    useEffect(() => {

        console.log('ЧАТЫ:',chats)

    }, [chats]);

    useEffect(() => {
        if (!currentChatId) return;
        navigate(`/m/chats/${currentChatId}`);
    }, [currentChatId]);

    const rowVirtualizer = useVirtualizer({
        count: chats.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 70,
        gap: 0,
    });
    const virtualItems = rowVirtualizer.getVirtualItems();

    // infinite scroll
    useEffect(() => {
        const lastItem = virtualItems[virtualItems.length - 1];
        if (!lastItem) return;

        if (lastItem.index >= chats.length - 1 && hasMoreChats) {
            const nextPage = pageChats + 1;
            setPageChats(nextPage);
            void fetchChats(nextPage);
        }
    }, [virtualItems]);

    return (
        <div className={styles.chatPage}>

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
                        const c = chats[virtualRow.index];
                        if (!c) return null;

                        return (
                            <div
                                key={c.id}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <Chat
                                    isActive={location.pathname === `/m/chats/${c.id}`}
                                    onClick={() => setCurrentChat(c.id)}
                                    chatPic={c.userPic ? `${BASE_API_URL}${c.userPic}_sm.webp` : defaultAvatar}
                                    isOnline={c.isOnline}
                                    chatUserName={c.chatName}
                                    chatLastMessage={c.lastMessageText}
                                    lastMessageTime={c.lastMessageCreatedAt}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <Outlet />
            </div>

        </div>
    );
}