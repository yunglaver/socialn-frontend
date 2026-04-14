import styles from "./AuthButton.module.scss";

export const AuthButton = ({buttonText, onClick, id, } ) => {
    return (
        <button className={styles.button} id={id} onClick={onClick}>{buttonText}</button>
    )

}