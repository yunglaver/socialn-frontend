import styles from "./Button.module.scss";

export const Button = ({ text, onClick, isActive, iconSrc, iconAlt}) => {


    return (
        <button
            onClick={onClick}
            className={`${styles.button} ${isActive ? styles.active : ''}`}

        >

            <img
                className={styles.icon}
                src={iconSrc}
                alt={iconAlt}
            />

            <span
                className={styles.text}
            >
                {text}
            </span>
        </button>
    )
}
