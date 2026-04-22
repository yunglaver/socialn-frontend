import styles from "./SendMessageBlock.module.scss"

export default function SendMessageBlock({onKeyDown, onClick, inputRef}) {
    return(
        <div
            className={styles.container}
        >
            <textarea
                className={styles.textArea}
                onKeyDown={onKeyDown}
                ref={inputRef}
                placeholder="Enter your message here..."
            />
            <button
                className={styles.sendButton}
                onClick={onClick}
            >
                Send
            </button>
        </div>
    )
}