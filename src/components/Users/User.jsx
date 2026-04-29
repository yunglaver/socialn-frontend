import styles from "./User.module.scss"

export default function User ({userName, userAvatar, onClickToChat}){

    return (
        <>
            <div
                className={styles.container}
            >
                <div
                    className={styles.avatarWrapper}
                >
                    <img
                        src={userAvatar}
                        alt="user-photo"
                        className={styles.avatarImg}
                    />
                    {/* потом сделаю сюда логику онлайн dot*/}
                </div>
                <div
                    className={styles.textContentWrapper}
                >
                    <span
                        className={styles.userName}
                    >
                    {userName}
                    </span>
                    <button
                        className={styles.toChatButton}
                        onClick={onClickToChat}
                    >
                        Send message
                    </button>
                </div>
            </div>
        </>
    )
}