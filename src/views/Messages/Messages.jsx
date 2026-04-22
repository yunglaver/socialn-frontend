import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { openChatWs } from "../../services/websocket.chats.service.js"
import styles from "./Messages.module.scss";
import { getMessages } from "../../services/message.service.js";
import { sendSocketMessage, subscribe } from "../../core/socket.js";
import SendMessageBlock from "../../components/Messages/SendMessageBlock.jsx";
import Message from "../../components/Messages/Message.jsx";

const PAGE_SIZE = 40;
const INITIAL_FIRST_ITEM_INDEX = 100000;

export default function Messages() {

    const { chatId } = useParams();
    const inputRef = useRef(null)
    const virtuosoRef = useRef(null);
    const loadingOlderRef = useRef(false);
    const atBottomRef = useRef(true);
    const pendingOwnMessageScrollRef = useRef(false);

    const currentChatRef = useRef(null);
    const joinedChatRef = useRef(null);
    const socketAuthedRef = useRef(false);

    const [userId, setUserId] = useState(() => Number(localStorage.getItem("currentUserId")));
    const [messages, setMessages] = useState([]);
    const [pageMessages, setPageMessages] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoadingInitial, setIsLoadingInitial] = useState(false);
    const [firstItemIndex, setFirstItemIndex] = useState(INITIAL_FIRST_ITEM_INDEX);
    const [isInitialReady, setIsInitialReady] = useState(false);




    function joinCurrentChat() {
        const currentChatId = currentChatRef.current;
        if (!currentChatId) return;
        if (!socketAuthedRef.current) return;

        if (joinedChatRef.current && joinedChatRef.current !== currentChatId) {
            sendSocketMessage({
                type: "leave_chat",
                chatId: joinedChatRef.current,
            });
        }

        openChatWs(currentChatId)

        joinedChatRef.current = currentChatId;
    }

    async function loadInitialMessages(currentChatId) {
        setIsLoadingInitial(true);
        setIsInitialReady(false);

        try {
            const data = await getMessages(currentChatId, 1, PAGE_SIZE);
            const normalized = data.slice().reverse(); // oldest -> newest

            setMessages(normalized);
            setPageMessages(1);
            setHasMoreMessages(data.length === PAGE_SIZE);
            setFirstItemIndex(INITIAL_FIRST_ITEM_INDEX - normalized.length);
            atBottomRef.current = true;
        } catch (error) {
            console.error("Failed to load initial messages:", error);
            setMessages([]);
            setPageMessages(1);
            setHasMoreMessages(false);
            setFirstItemIndex(INITIAL_FIRST_ITEM_INDEX);
            atBottomRef.current = true;
        } finally {
            setIsLoadingInitial(false);
            setIsInitialReady(true);
        }
    }

    async function loadOlderMessages() {
        if (!chatId) return;
        if (loadingOlderRef.current) return;
        if (!hasMoreMessages) return;
        if (!isInitialReady) return;

        loadingOlderRef.current = true;

        const nextPage = pageMessages + 1;

        try {
            const data = await getMessages(chatId, nextPage, PAGE_SIZE);

            if (!data.length) {
                setHasMoreMessages(false);
                return;
            }

            const normalized = data.slice().reverse(); // oldest -> newest

            setMessages((prev) => {
                const seen = new Set(prev.map((m) => String(m.id)));
                const filtered = normalized.filter((m) => !seen.has(String(m.id)));
                return [...filtered, ...prev];
            });

            setFirstItemIndex((prev) => prev - normalized.length);
            setPageMessages(nextPage);
            setHasMoreMessages(data.length === PAGE_SIZE);
        } catch (error) {
            console.error("Failed to load older messages:", error);
        } finally {
            loadingOlderRef.current = false;
        }
    }

    useEffect(() => {
        if (!chatId) return;

        currentChatRef.current = String(chatId);
        inputRef.current?.focus();
        setMessages([]);
        setPageMessages(1);
        setHasMoreMessages(true);
        setFirstItemIndex(INITIAL_FIRST_ITEM_INDEX);
        setIsInitialReady(false);

        atBottomRef.current = true;
        pendingOwnMessageScrollRef.current = false;

        void loadInitialMessages(chatId);

        if (socketAuthedRef.current) {
            joinCurrentChat();
        }

        return () => {
            if (joinedChatRef.current === String(chatId)) {
                sendSocketMessage({
                    type: "leave_chat",
                    chatId: String(chatId),
                });
                joinedChatRef.current = null;
            }
        };
    }, [chatId]);

    useEffect(() => {
        const unsubscribe = subscribe((data) => {
            if (data.type === "auth_success") {
                socketAuthedRef.current = true;
                joinCurrentChat();
                return;
            }

            if (data.type !== "message") return;

            const msg = data.payload;
            if (!msg) return;
            if (String(msg.chatId) !== String(currentChatRef.current)) return;

            setMessages((prev) => {
                const exists = prev.some((item) => String(item.id) === String(msg.id));
                if (exists) return prev;
                return [...prev, msg];
            });
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const handleSend = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage()
        }
    };

    const sendMessage = () => {

        const text = inputRef.current.value

        if (!text) return;

        pendingOwnMessageScrollRef.current = true;

        sendSocketMessage({
            type: "message",
            chatId,
            text,
        });

        inputRef.current.value = "";

    };



    const followOutput = (isAtBottom) => {
        if (pendingOwnMessageScrollRef.current) {
            pendingOwnMessageScrollRef.current = false;
            return "auto";
        }

        return isAtBottom ? "auto" : false;
    };

    return (
        <div className={styles.background}>
            <div className={styles.parentScrollBlock}>
                {isInitialReady && (
                    <Virtuoso
                        className={styles.messagesContainer}
                        key={chatId}
                        ref={virtuosoRef}
                        data={messages}
                        firstItemIndex={firstItemIndex}
                        initialTopMostItemIndex={
                            messages.length > 0
                                ? { index: messages.length - 1, align: "end" }
                                : 0
                        }
                        alignToBottom
                        followOutput={followOutput}
                        atBottomStateChange={(atBottom) => {
                            atBottomRef.current = atBottom;
                        }}
                        atBottomThreshold={120}
                        startReached={() => {
                            void loadOlderMessages();
                        }}
                        computeItemKey={(index, item) => item?.id ?? `fallback-${index}`}
                        defaultItemHeight={35}
                        increaseViewportBy={{ top: 600, bottom: 300 }}
                        overscan={{ main: 300, reverse: 600 }}
                        style={{ height: "100%", width: "100%" }}
                        itemContent={(index, message) => (
                            <Message
                                messageText={message.text}
                                isOutgoing={message.senderId === userId}
                                messageTime={message.createdAt}
                            />
                        )}
                    />
                )}
            </div>

            <SendMessageBlock
                className={styles.sendBlock}
                inputRef={inputRef}
                onKeyDown={handleSend}
                onClick={sendMessage}
            />
        </div>
    );
}