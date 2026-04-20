import styles from "./SendMessageBlock.module.scss"

export default function SendMessageBlock({onKeyDown}) {
    return(
        <div
            className={styles.container}
        >
            <textarea
                className={styles.textArea}
                onKeyDown={onKeyDown}
                placeholder="Enter your message here..."
            />
            <button
                className={styles.sendButton}
            >
                Send
            </button>
        </div>
    )
}