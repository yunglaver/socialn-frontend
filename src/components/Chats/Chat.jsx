import styles from "./Chat.module.scss"
import FormatMessageTime from "../FormatEventTime.jsx";

export default function Chat({onClick, chatPic, isOnline, lastMessageTime, chatUserName, chatLastMessage, isActive}) {

    const timeFormatted = new Date(lastMessageTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div
            className={styles.chatContainer}
        >
            <button
                className={`${styles.chatButton} ${isActive ? styles.activeButton : ''}`}

                onClick={onClick}
            >
                <div
                    className={styles.chatInfo}
                >

                    <div
                        className={styles.chatInfoWrapper}
                    >
                        <div
                            className={styles.chatIconContainer}
                        >
                            <img
                                src={chatPic}
                                alt="avatarPic"
                                className={styles.chatPic}
                            />
                            {isOnline ? "" : ""}
                            {/*<img src={isOnline ? "" : ""} alt="isOnlineDot"/>*/}
                        </div>

                        <div
                            className={styles.chatTitleContainer}
                        >
                            <span
                                className={styles.chatUserName}
                            >
                                {chatUserName}
                            </span>
                            <span
                                className={styles.chatLastMessage}
                            >
                                {chatLastMessage}
                            </span>
                        </div>
                    </div>


                    <><span
                        className={styles.lastMessageTime}
                    >
                        {FormatMessageTime(lastMessageTime)}
                    </span></>
                    
                </div>
            </button>
        </div>
    )
}